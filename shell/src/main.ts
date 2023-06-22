import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {_, setupI18n} from "./i18n/i18nDictionary";
import {get} from "svelte/store";
import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {Generate} from "@o-platform/o-utils/dist/generate";
import * as LoadingIndicator from "./shared/atoms/LoadingIndicator.svelte";
import Success from "./shared/atoms/Success.svelte";
import ErrorIndicator from "./shared/atoms/Error.svelte";
import {useMachine} from "@xstate/svelte";
import {Subject, Subscription} from "rxjs";
import {ProcessEvent} from "@o-platform/o-process/dist/interfaces/processEvent";
import {AnyEventObject} from "xstate";
import {Bubble} from "@o-platform/o-process/dist/events/bubble";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {Process} from "@o-platform/o-process/dist/interfaces/process";
import {Sinker} from "@o-platform/o-process/dist/events/sinker";
import {shellEvents} from "./shared/shellEvents";
import {ApiConnection} from "./shared/apiConnection";
import {Stopped} from "@o-platform/o-process/dist/events/stopped";
import {Environment} from "./shared/environment";
import {IShell} from "./iShell";
import * as Sentry from "@sentry/browser";
import {BrowserTracing} from "@sentry/tracing";
import * as bip39 from "bip39";
import posthog from 'posthog-js'

const i18nString = get(_);

setupI18n({ withLocale: Environment.userLanguage.slice(0, 2) });

Sentry.init({
  dsn: "https://42e2eed7fcd94a3f86fa2ca4ffa7bd70@o4504719125905408.ingest.sentry.io/4504719127740416",
  integrations: [new BrowserTracing(), new Sentry.Replay()],

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 1.0,
  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});


dayjs.extend(relativeTime);
RpcGateway.setup(Environment.xdaiRpcGatewayUrl);

declare global {
  interface Window {
    o: IShell;
    i18n: (id: string, options?: any) => string;
  }
}

declare global {
  interface Array<T> {
    groupBy(groupSelector: (item: T) => string | number | null | undefined): { [group: string]: T[] };
    skip(number: number): T[];
    toLookup(keySelector: (item: T) => string): { [key: string]: boolean };
    toLookup<TValue>(keySelector: (item: T) => string | number | null | undefined, valueSelector?: (item: T) => TValue): { [key: string]: TValue };
  }
}

Array.prototype.groupBy = function groupBy<T>(groupSelector: (item: T) => string): { [group: string]: T[] } {
  return (<T[]>this).reduce((p, c) => {
    const group = groupSelector(c);
    if (group === undefined || group === null) {
      return p;
    }
    if (!p[group]) {
      p[group] = [];
    }
    p[group].push(c);
    return p;
  }, <{ [group: string]: T[] }>{});
};

Array.prototype.skip = function skip<T>(number: number): T[] {
  return (<T[]>this).slice(number);
};

Array.prototype.toLookup = function toLookup<T, TValue>(keySelector: (item: T) => string, valueSelector?: (item: T) => TValue): { [key: string]: TValue } {
  return this.reduce((p, c) => {
    const key = keySelector(c);
    if (key === undefined || key === null) {
      return p;
    }
    p[key] = !valueSelector ? true : valueSelector(c);
    return p;
  }, <{ [key: string]: TValue }>{});
};

export async function getProcessContext(): Promise<ProcessContext<any>> {
  return <ProcessContext<any>>{
    data: {},
  };
}

(<any>window).rpcGateway = RpcGateway.get();

const runningProcesses: {
  [id: string]: Process;
} = {};


window.o = <any>{
  posthog: Environment.apiEndpointUrl.indexOf("localhost") == -1 ? posthog.init(Environment.posthogId, { api_host: Environment.posthogUrl }) : undefined,
  bip39: {
    mnemonicToSeed: (mnemonic: string) => bip39.mnemonicToSeed(mnemonic),
    mnemonicToEntropy: (mnemonic: string) => bip39.mnemonicToEntropy(mnemonic),
    entropyToMnemonic: (entropy: string) => bip39.entropyToMnemonic(entropy),
  },
  i18n: (key: string, options?: any) => i18nString(key, options),
  stateMachines: {
    findById(processId: string) {
      return runningProcesses[processId];
    },
    async run<TContext>(definition: ProcessDefinition<any, any>, contextModifier?: (processContext: ProcessContext<any>) => Promise<TContext>) {
      const processId = Generate.randomHexString(8);
      console.log(`Starting process (id: ${processId}) with definition:`, definition, definition.stateMachine("debug"));

      const machine = (<any>definition).stateMachine(LoadingIndicator, Success, ErrorIndicator);
      const machineOptions = {
        context: contextModifier ? await contextModifier(await getProcessContext()) : await getProcessContext(),
      };
      const { service, state, send } = useMachine(machine, machineOptions);

      const outEvents = new Subject<ProcessEvent>();
      const inEvents = new Subject<ProcessEvent>();

      let lastInEvent: AnyEventObject;

      service.onTransition((state1, event) => {
        // console.log(`Shellprocess state: ${state1.value}, event: ${event.type}`)
        if (event.type == "error.platform" || event.type == "xstate.error") {
          console.error(`An error occurred during the execution of process '${definition.name}'::`, event);
        }
        if (event.type == "process.ipc.bubble") {
          process.lastReceivedBubble = <Bubble>event;
        }

        //console.log(`window.o.stateMachines: forwarding event to the processEvents stream of process '${definition.name}':`, event);
        if (event == lastInEvent) {
          // TODO: Hack: Skip this event - it's 'reflected'
          lastInEvent = null;
          return;
        }
        outEvents.next(<any>{
          stopped: false,
          currentState: state1,
          previousState: state1.history,
          event: event,
        });
      });

      service.onStop(() => {
        outEvents.next({
          stopped: true,
        });

        let result: any = undefined;
        if ((<any>service)._state?.event?.data) {
          result = (<any>service)._state.event.data;
          console.log("stopped process (service._state.event.data): ", result);
        }

        delete runningProcesses[processId];
        window.o.publishEvent(new Stopped(processId, result));
      });

      function isProcessEvent(event: PlatformEvent | ProcessEvent): event is ProcessEvent {
        return (event as ProcessEvent).currentState !== null;
      }

      const process = <Process>{
        id: processId,
        events: outEvents,
        inEvents: inEvents,
        lastReceivedBubble: null,
        sendEvent: (event: PlatformEvent & { type: string }) => {
          if (isProcessEvent(event)) {
            lastInEvent = event;
            inEvents.next(<any>{
              event: event,
            });
          }
          send(event);
        },
        sendAnswer(answer: PlatformEvent) {
          if (!this.lastReceivedBubble || this.lastReceivedBubble.noReply) {
            throw new Error("Cannot answer because no Bubble event was received before or the event had the 'noReply' property set.");
          }
          process.sendEvent(<Sinker>{
            type: "process.ipc.sinker",
            levels: this.lastReceivedBubble.levels ?? 0,
            backTrace: this.lastReceivedBubble.trace,
            wrappedEvent: answer,
          });
        },
      };

      service.start();

      runningProcesses[processId] = process;

      return process;
    },
  },
  events: shellEvents.observable,
  publishEvent: (event) => {
    if (event.type == "shell.progress") {
      console.log("Progress event: ", event);
    }
    return shellEvents.publish(event);
  },
  requestEvent: <TResult extends PlatformEvent>(requestEvent) => {
    const timeoutPeriod = 100;
    return new Promise<TResult>((resolve, reject) => {
      let answerSubscription: Subscription;
      let answered = false;

      let timeout = setTimeout(() => {
        if (answered) return;

        reject(new Error(`The request event with the id ${requestEvent.id} wasn't answered within ${timeoutPeriod} ms`));
      }, timeoutPeriod);

      answerSubscription = window.o.events.subscribe((event) => {
        if (event.responseToId != requestEvent.id) {
          return;
        }

        answerSubscription.unsubscribe();
        clearTimeout(timeout);

        resolve(<TResult>event);
      });

      window.o.publishEvent(requestEvent);
    });
  },
  apiClient: new ApiConnection(Environment.apiEndpointUrl, "include"),
  theGraphClient: new ApiConnection(Environment.circlesSubgraphEndpoint),
};

declare global {
  interface Window {
    o: IShell;
    runInitMachine: () => void;
  }
}

async function load() {
  // await I18nDictionary.instance.waitHandle;
  const App = require("src/App.svelte");
  new App.default({
    target: document.body,
  });
}

load();
