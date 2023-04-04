import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { CirclesHub } from "@o-platform/o-circles/dist/circles/circlesHub";
import { BN } from "ethereumjs-util";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import HtmlViewer from "@o-platform/o-editors/src/HtmlViewer.svelte";
import TrustChangeConfirmation from "../molecules/TrustChangeConfirmation.svelte";
import { promptCirclesSafe } from "../../../shared/api/promptCirclesSafe";
import type { TransactionReceipt } from "web3-core";
import { Environment } from "../../../shared/environment";
import { setWindowLastError } from "../../../shared/processes/actions/setWindowLastError";
import { Contact, ContactDirection, Profile, ProfileType, ProfilesByCirclesAddressDocument, ProfilesByCirclesAddressQueryVariables } from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";
import { loadProfile } from "../../o-passport/processes/identify/services/loadProfile";
import { me } from "../../../shared/stores/me";
import { contacts } from "../../../shared/stores/contacts";
import { throwError } from "rxjs";
import { show } from "@o-platform/o-process/dist/actions/show";
import ErrorView from "../../../shared/atoms/Error.svelte";

export type SetTrustContextData = {
  safeAddress: string;
  hubAddress: string;
  privateKey: string;
  profile?: Profile;
  profileType?: ProfileType;
  trustReceiver?: string;
  trustLimit?: number;
  successAction?: (data: SetTrustContextData) => void;
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type SetTrustContext = ProcessContext<SetTrustContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */

const editorContent: { [x: string]: EditorViewContext } = {
  recipient: {
    title: window.o.i18n("dapps.o-banking.processes.setTrust.editorContent.recipient.title"),
    description: "",
    placeholder: window.o.i18n("dapps.o-banking.processes.setTrust.editorContent.recipient.placeholder"),
    submitButtonText: window.o.i18n("dapps.o-banking.processes.setTrust.editorContent.recipient.submitButtonText"),
  },
  limit: {
    title: window.o.i18n("dapps.o-banking.processes.setTrust.editorContent.limit.title"),
    description: "",
    submitButtonText: window.o.i18n("dapps.o-banking.processes.setTrust.editorContent.limit.submitButtonText"),
  },
  message: {
    title: window.o.i18n("dapps.o-banking.processes.setTrust.editorContent.message.title"),
    description: "",
    submitButtonText: window.o.i18n("dapps.o-banking.processes.setTrust.editorContent.message.submitButtonText"),
  },
  confirm: {
    title: window.o.i18n("dapps.o-banking.processes.setTrust.editorContent.confirm.title"),
    description: "",
    submitButtonText: window.o.i18n("dapps.o-banking.processes.setTrust.editorContent.confirm.submitButtonText"),
  },
  success: {
    title: window.o.i18n("dapps.o-banking.processes.setTrust.editorContent.success.title"),
    description: "",
    submitButtonText: window.o.i18n("dapps.o-banking.processes.setTrust.editorContent.success.submitButtonText"),
  },
};

/**
 * Checks which users are trusted by the current user and automatically trusts these users also in all orgas.
 * @param mainSafeAddress
 */
async function hSetTrust(mainSafeAddress: string) {
  let $contacts: Contact[];
  contacts.subscribe((value) => ($contacts = value))();

  const iTrust = $contacts.filter((contact) => {
    const trustMetadata = contact.metadata.find((metadata) => metadata.name == "CrcTrust");
    if (!trustMetadata) return false;

    const outDirectionIdx = trustMetadata.directions.indexOf(ContactDirection.Out);
    if (outDirectionIdx == -1) return false;

    const outTrustLimit = trustMetadata.values[outDirectionIdx];
    return {
      contactAddress: contact.contactAddress,
      trustLimit: outTrustLimit,
    };
  });

  let $me: Profile;
  me.subscribe((value) => ($me = value))();
  const myAdminMemberships = $me.memberships?.filter((o) => o.isAdmin)?.map((o) => o.organisation.circlesAddress) ?? [];
}

async function gSetTrust(mainSafeAddress: string, trustReceiver: string, limit: number) {
  const myProfile = await loadProfile(mainSafeAddress);
  const myAdminMemberships = myProfile.memberships?.filter((o) => o.isAdmin)?.map((o) => o.organisation.circlesAddress) ?? [];

  const web3 = await RpcGateway.get();
  const safeProxy = new GnosisSafeProxy(web3, myProfile.circlesAddress);
  const key = sessionStorage.getItem("circlesKey");

  const personTrustReceipt = await fSetTrust({
    data: {
      privateKey: key,
      hubAddress: Environment.circlesHubAddress,
      safeAddress: safeProxy.address,
      trustLimit: limit,
      trustReceiver: trustReceiver,
    },
    dirtyFlags: {},
    messages: {},
    onlyThesePages: undefined,
  });
  console.log("personTrustReceipt.transactionHash: ", personTrustReceipt.transactionHash);

  for (const membership of myAdminMemberships) {
    try {
      const followTrust = await fSetTrust({
        data: {
          privateKey: key,
          hubAddress: Environment.circlesHubAddress,
          safeAddress: membership,
          trustLimit: limit,
          trustReceiver: trustReceiver,
        },
        dirtyFlags: {},
        messages: {},
        onlyThesePages: undefined,
      });
      console.log("followTrust.transactionHash: ", followTrust.transactionHash);
    } catch (e) {
      console.error(`followTrust error. mainSafeAddress: ${mainSafeAddress}, followTrustSafeAddress: ${membership}, limit: ${limit}, error:`, e);
    }
  }
}

export async function fSetTrust(context: ProcessContext<SetTrustContextData>): Promise<TransactionReceipt> {
  const gnosisSafeProxy = new GnosisSafeProxy(RpcGateway.get(), context.data.safeAddress);

  return await new CirclesHub(RpcGateway.get(), Environment.circlesHubAddress).setTrust(
    context.data.privateKey,
    gnosisSafeProxy,
    context.data.trustReceiver,
    new BN(context.data.trustLimit.toString())
  );
}

const processDefinition = (processId: string) =>
  createMachine<SetTrustContext, any>({
    id: `${processId}:setTrust`,
    initial: "checkTrustReceiver",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<SetTrustContext, any>("error"),

      checkTrustReceiver: {
        id: "checkTrustReceiver",
        always: [
          {
            cond: (context) => !!context.data.trustReceiver,
            target: "#checkTrustLimit",
          },
          {
            target: "#trustReceiver",
          },
        ],
      },

      trustReceiver: promptCirclesSafe<SetTrustContext, any>({
        field: "trustReceiver",
        onlyWhenDirty: false,
        params: {
          profileType: ProfileType.Person,
          view: editorContent.recipient,
          placeholder: editorContent.recipient.placeholder,
          submitButtonText: editorContent.recipient.submitButtonText,
        },
        navigation: {
          next: "#checkTrustLimit",
        },
      }),

      checkTrustLimit: {
        id: "checkTrustLimit",
        always: [
          {
            cond: (context) => context.data.trustReceiver.toLowerCase() == context.data.safeAddress.toLowerCase(),
            actions: (context) => {
              console.log("TRUSTRECEIVER", context.data.trustReceiver);
              editorContent.recipient.description = "HERRGOTSACK";
            },
            target: "#trustReceiver",
          },
          {
            cond: (context) => context.data.trustLimit !== undefined && context.data.trustLimit !== null,
            target: "#getProfile",
          },
          {
            target: "#trustReceiver",
          },
        ],
      },

      getProfile: {
        id: "getProfile",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.o.i18n("dapps.o-banking.processes.setTrust.setTrust.gettingProfile"),
          });
        },
        invoke: {
          src: async (context) => {
            try {
              const result = await ApiClient.query<Profile, ProfilesByCirclesAddressQueryVariables>(ProfilesByCirclesAddressDocument, {
                circlesAddresses: [context.data.trustReceiver],
              });
              context.data.profile = result;
            } catch (error) {
              console.info(`Could not load Profile for circlesAddress: ${context.data.trustReceiver}`, error);
            }
            return context.data.profile;
          },
          onDone: "#verifyProfile",

          onError: {
            target: "#showError",
            actions: setWindowLastError,
          },
        },
      },

      verifyProfile: {
        id: "verifyProfile",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.o.i18n("dapps.o-banking.processes.setTrust.setTrust.verifyingProfile"),
          });
        },
        always: [
          {
            cond: (context) => context.data.profile[0].type == "ORGANISATION",
            actions: (context) => {
              context.messages["trustReceiver"] = window.o.i18n("dapps.o-banking.processes.setTrust.notAPersonalProfile");
            },
            target: "#trustReceiver",
          },
          {
            cond: (context) => context.data.profile[0].type !== "ORGANISATION",
            target: "#setTrust",
          },
          {
            target: "#trustReceiver",
          },
        ],
      },

      setTrust: {
        id: "setTrust",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.o.i18n("dapps.o-banking.processes.setTrust.setTrust.message"),
          });
        },
        invoke: {
          src: async (context) => {
            try {
              await gSetTrust(context.data.safeAddress, context.data.trustReceiver, context.data.trustLimit);
            } catch (error) {
              console.info(`${window.o.i18n("dapps.o-banking.processes.setTrust.editorContent.error.trustfailed")} ${context.data.trustReceiver}`, error);
            }
          },
          onDone: "#showSuccess",

          onError: {
            target: "#showError",
            actions: setWindowLastError,
          },
        },
      },

      showSuccess: prompt({
        id: "showSuccess",
        field: "__",
        component: TrustChangeConfirmation,
        params: (context) => {
          return {
            view: (editorContent.success = {
              title: window.o.i18n("dapps.o-banking.processes.setTrust.editorContent.success.title"),
              description: "",
              submitButtonText: window.o.i18n("dapps.o-banking.processes.setTrust.editorContent.success.submitButtonText"),
            }),
            profile: context.data.profile,
            trustLimit: context.data.trustLimit,
            submitButtonText: editorContent.success.submitButtonText,
            hideNav: false,
          };
        },
        navigation: {
          next: "#success",
        },
      }),

      showError: {
        id: "showError",
        entry: show({
          component: ErrorView,
          params: {},
          field: {
            name: "",
            get: () => undefined,
            set: (o: any) => {},
          },
        }),
      },

      success: {
        type: "final",
        id: "success",
        data: (context, event: PlatformEvent) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
          return window.o.i18n("dapps.o-banking.proccesses.setTrust.success.return");
        },
      },
    },
  });

export const setTrust: ProcessDefinition<void, SetTrustContext> = {
  name: "setTrust",
  stateMachine: <any>processDefinition,
};
