import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { push } from "svelte-spa-router";
import {
  EventsDocument,
  EventType,
  InvitationTransactionDocument,
  RedeemClaimedInvitationDocument,
} from "../../../../shared/api/data/types";
import {show} from "@o-platform/o-process/dist/actions/show";
import ErrorView from "../../../../shared/atoms/Error.svelte";
import {setWindowLastError} from "../../../../shared/processes/actions/setWindowLastError";

export type RedeemInvitationContextData = {
  inviteCode: string;
};

export type PromptRedeemInvitationContext = ProcessContext<RedeemInvitationContextData>;

const editorContent = {
  waitUntilRedeemed: {
    title: window.o.i18n(
      "dapps.o-onboarding.processes.invitation.promptRedeemInvitation.editorContent.waitUntilRedeemed.title"
    ),
    description: window.o.i18n(
      "dapps.o-onboarding.processes.invitation.promptRedeemInvitation.editorContent.waitUntilRedeemed.description"
    ),
    submitButtonText: window.o.i18n(
      "dapps.o-onboarding.processes.invitation.promptRedeemInvitation.editorContent.waitUntilRedeemed.submitButtonText"
    ),
  },
};
const processDefinition = (processId: string) =>
  createMachine<PromptRedeemInvitationContext, any>({
    id: `${processId}:promptRedeemInvitation`,
    initial: "redeemInvitation",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<PromptRedeemInvitationContext, any>("error"),

      redeemInvitation: {
        id: "redeemInvitation",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.o.i18n(
              "dapps.o-onboarding.processes.invitation.promptRedeemInvitation.redeemInvitation.message"
            ),
          });
        },
        invoke: {
          src: async (context) => {
            delete context.messages["__"];
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const claimResult = await apiClient.mutate({
              mutation: RedeemClaimedInvitationDocument,
              variables: {},
            });
            if (claimResult.errors) {
              context.messages["__"] = claimResult.errors.map((o) => o.message).join(" \n");
              throw new Error(
                window.o.i18n("dapps.o-onboarding.processes.invitation.promptRedeemInvitation.redeemInvitation.error", {
                  values: { contextMessages: context.messages["inviteCode"] },
                })
              );
            }
            if (!claimResult.data?.redeemClaimedInvitation?.success) {
              context.messages["__"] = claimResult.data.error;
              throw new Error(
                window.o.i18n("dapps.o-onboarding.processes.invitation.promptRedeemInvitation.redeemInvitation.error", {
                  values: { contextMessages: context.messages["inviteCode"] },
                })
              );
            }
          },
          onError: {
            actions: setWindowLastError,
            target: "#showError",
          },
          onDone: "#checkIfRedeemed",
        },
      },
      checkIfRedeemed: {
        id: "checkIfRedeemed",
        invoke: {
          src: async (context) => {
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const claimResult = await apiClient.mutate({
              mutation: InvitationTransactionDocument,
              variables: {},
            });

            if (claimResult.errors?.length || !claimResult.data.invitationTransaction?.transaction_hash) {
              throw new Error(
                window.o.i18n(
                  "dapps.o-onboarding.processes.invitation.promptRedeemInvitation.checkIfRedeemed.notYetRedeemed"
                )
              );
            }
          },
          onDone: "#success",
          onError: "#waitUntilRedeemed",
        },
      },
      waitUntilRedeemed: {
        id: "waitUntilRedeemed",
        invoke: {
          src: async () => {
            const timeout = new Promise((resolve) => {
                setTimeout(() => {
                    resolve(null);
                }, 1000 * 10);
            });
            const waiter = new Promise(async (resolve) => {
              const apiClient = await window.o.apiClient.client.subscribeToResult();
              const observable = apiClient.subscribe({
                query: EventsDocument,
              });
              let subscription: ZenObservable.Subscription;
              const subscriptionHandler = (next) => {
                if (
                  next.data.events.type == EventType.EthTransfer ||
                  next.data.events.type == EventType.GnosisSafeEthTransfer
                ) {
                  if (subscription) {
                    subscription.unsubscribe();
                  }
                  resolve(null);
                  // TODO: Close the connection when done
                }
              };
              subscription = observable.subscribe(subscriptionHandler);
            });

            await Promise.any([timeout, waiter]);
          },
          onDone: "#checkIfRedeemed",
        },
      },
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
        id: "success",
        type: "final",
        data: (context, event: PlatformEvent) => {
          push("/");
          (<any>window).runInitMachine();
          return "yeah";
        },
      },
    },
  });

export const promptRedeemInvitation: ProcessDefinition<void, PromptRedeemInvitationContext> = {
  name: "promptRedeemInvitation",
  stateMachine: <any>processDefinition,
};
