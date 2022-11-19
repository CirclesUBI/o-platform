import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {EditorViewContext} from "@o-platform/o-editors/src/shared/editorViewContext";
import HtmlViewer from "@o-platform/o-editors/src/HtmlViewer.svelte";
import TrustChangeConfirmation from "../atoms/TrustChangeConfirmation.svelte";
import {promptCirclesSafe} from "../../../shared/api/promptCirclesSafe";
import {
  Profile,
  ProfilesByCirclesAddressDocument,
  ProfilesByCirclesAddressQueryVariables,
} from "../../../shared/api/data/types";
import {ApiClient} from "../../../shared/apiConnection";
import {CirclesSafe} from "../chain/circlesSafe";
import {DefaultExecutionContext} from "../chain/actions/defaultExecutionContext";

export type SetTrustContextData = {
  safeAddress: string;
  hubAddress: string;
  privateKey: string;
  profile?: Profile;
  trustReceiver?: string;
  trustLimit?: number;
  successAction?: (data: SetTrustContextData) => void;
};

export type SetTrustContext = ProcessContext<SetTrustContextData>;

const editorContent: { [x: string]: EditorViewContext } = {
  recipient: {
    title: window.o.i18n(
      "dapps.o-banking.processes.setTrust.editorContent.recipient.title"
    ),
    description: "",
    placeholder: window.o.i18n(
      "dapps.o-banking.processes.setTrust.editorContent.recipient.placeholder"
    ),
    submitButtonText: window.o.i18n(
      "dapps.o-banking.processes.setTrust.editorContent.recipient.submitButtonText"
    ),
  },
  limit: {
    title: window.o.i18n(
      "dapps.o-banking.processes.setTrust.editorContent.limit.title"
    ),
    description: "",
    submitButtonText: window.o.i18n(
      "dapps.o-banking.processes.setTrust.editorContent.limit.submitButtonText"
    ),
  },
  message: {
    title: window.o.i18n(
      "dapps.o-banking.processes.setTrust.editorContent.message.title"
    ),
    description: "",
    submitButtonText: window.o.i18n(
      "dapps.o-banking.processes.setTrust.editorContent.message.submitButtonText"
    ),
  },
  confirm: {
    title: window.o.i18n(
      "dapps.o-banking.processes.setTrust.editorContent.confirm.title"
    ),
    description: "",
    submitButtonText: window.o.i18n(
      "dapps.o-banking.processes.setTrust.editorContent.confirm.submitButtonText"
    ),
  },
  success: {
    title: window.o.i18n(
      "dapps.o-banking.processes.setTrust.editorContent.success.title"
    ),
    description: "",
    submitButtonText: window.o.i18n(
      "dapps.o-banking.processes.setTrust.editorContent.success.submitButtonText"
    ),
  },
};

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
          view: editorContent.recipient = {
            title: window.o.i18n(
              "dapps.o-banking.processes.setTrust.editorContent.recipient.title"
            ),
            description: "",
            placeholder: window.o.i18n(
              "dapps.o-banking.processes.setTrust.editorContent.recipient.placeholder"
            ),
            submitButtonText: window.o.i18n(
              "dapps.o-banking.processes.setTrust.editorContent.recipient.submitButtonText"
            ),
          },
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
            cond: (context) =>
              context.data.trustReceiver.toLowerCase() ==
              context.data.safeAddress.toLowerCase(),
            actions: (context) => {
              context.messages["trustReceiver"] = window.o.i18n(
                "dapps.o-banking.processes.setTrust.checkTrustLimit.contextMessage"
              );
            },
            target: "#trustReceiver",
          },
          {
            cond: (context) =>
              context.data.trustLimit !== undefined &&
              context.data.trustLimit !== null,
            target: "#setTrust",
          },
          {
            target: "#trustReceiver",
          },
        ],
      },

      // The code was either manually entered or pre-configured at launch.
      // Exchange it for the actual token and redirect the user to the application.
      setTrust: {
        id: "setTrust",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.o.i18n(
              "dapps.o-banking.processes.setTrust.setTrust.message"
            ),
          });
        },
        invoke: {
          src: async (context) => {
            try {
              context.data.profile = await ApiClient.query<Profile,
                ProfilesByCirclesAddressQueryVariables>(ProfilesByCirclesAddressDocument, {
                circlesAddresses: [context.data.trustReceiver],
              });
            } catch (error) {
              console.info(
                `Could not load Profile for circlesAddress: ${context.data.trustReceiver}`
              );
            }

            return await new CirclesSafe(context.data.safeAddress, DefaultExecutionContext.fromKey(context.data.privateKey))
              .setTrust(context.data.trustReceiver, context.data.trustLimit);
          },
          onDone: "#showSuccess",

          onError: {
            target: "error",
            actions: console.log,
          },
        },
      },

      showSuccess: prompt({
        id: "showSuccess",
        field: "__",
        component: TrustChangeConfirmation,
        params: (context) => {
          return {
            view: editorContent.success = {
              title: window.o.i18n(
                "dapps.o-banking.processes.setTrust.editorContent.success.title"
              ),
              description: "",
              submitButtonText: window.o.i18n(
                "dapps.o-banking.processes.setTrust.editorContent.success.submitButtonText"
              ),
            },
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

      error: prompt({
        id: "error",
        field: "__",
        component: HtmlViewer,
        params: {
          view: editorContent.message = {
            title: window.o.i18n(
              "dapps.o-banking.processes.setTrust.editorContent.message.title"
            ),
            description: "",
            submitButtonText: window.o.i18n(
              "dapps.o-banking.processes.setTrust.editorContent.message.submitButtonText"
            )},
          html: () =>
            "Oopsie, Something went wrong, please close this window and try again. ",
          hideNav: false,
        },
      }),
      success: {
        type: "final",
        id: "success",
        data: (context, _) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
          return window.o.i18n(
            "dapps.o-banking.proccesses.setTrust.success.return"
          );
        },
      },
    },
  });

export const setTrust: ProcessDefinition<void, SetTrustContext> = {
  name: "setTrust",
  stateMachine: <any>processDefinition,
};
