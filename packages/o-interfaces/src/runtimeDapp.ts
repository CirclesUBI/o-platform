import {DappManifest} from "./dappManifest";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {Topic} from "@o-platform/o-utils/dist/eventBroker";

export interface RuntimeDapp<TState extends {[x:string]:any}> extends DappManifest<TState>
{
  runtimeId:string,
  route: string,

  /**
   * Used by the auth to receive incoming events.
   */
  inEvents?:Topic<PlatformEvent>,
  /**
   * Used by the auth to send outgoing events for other dapps to subscribe.
   */
  outEvents?:Topic<PlatformEvent>,

  /**
   * Contains the url params from the router (if any - is set by the DappFrame.svelte component)
   */
  params?: {[x:string]:any};
  /**
   * Can contain dapp specific shared state.
   */
  state: TState;

/*
  state: BehaviorSubject<StatePropagation<TState>>

  emitSignal: (signal:Signal) => void;
  emitState: (state:TState) => void;
 */
}
