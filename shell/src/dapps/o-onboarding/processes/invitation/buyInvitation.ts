import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import * as yup from "yup";
import HtmlViewer from "../../../../../../packages/o-editors/src/HtmlViewer.svelte";
import { ClaimInvitationDocument } from "../../../../shared/api/data/types";

export type PromptGetInvitedData = {
  needsInvitation: boolean;
  inviteCode: string;
  successAction?: (data: PromptGetInvitedData) => void;
};

export type PromptGetInvitedContext = ProcessContext<PromptGetInvitedData>;

const editorContent = {
  info: {
    title: window.o.i18n("dapps.o-onboarding.processes.invitation.buyInvitation.getInvited"),
    description: window.o.i18n("dapps.o-onboarding.processes.invitation.buyInvitation.findSomeone"),
    submitButtonText: window.o.i18n("dapps.o-onboarding.processes.invitation.buyInvitation.haveCode"),
  },
  checkInviteCode: {
    title: window.o.i18n("dapps.o-onboarding.processes.invitation.buyInvitation.enterInvitCode"),
    description: window.o.i18n("dapps.o-onboarding.processes.invitation.buyInvitation.enterInvitCodeBelow"),
    submitButtonText: window.o.i18n("dapps.o-onboarding.processes.invitation.buyInvitation.verify"),
  },
};
const processDefinition = (processId: string) =>
  createMachine<PromptGetInvitedContext, any>({
    id: `${processId}:promptGetInvited`,
    initial: "info",
    states: {
      ...fatalError<PromptGetInvitedContext, any>("error"),
      info: prompt({
        id: "info",
        field: "__",
        component: HtmlViewer,
        params: {
          view: (editorContent.info = {
            title: window.o.i18n("dapps.o-onboarding.processes.invitation.buyInvitation.getInvited"),
            description: window.o.i18n("dapps.o-onboarding.processes.invitation.buyInvitation.findSomeone"),
            submitButtonText: window.o.i18n("dapps.o-onboarding.processes.invitation.buyInvitation.haveCode"),
          }),
          html: () => "",
          hideNav: false,
        },
        navigation: {
          next: "#inviteCode",
        },
      }),
      inviteCode: prompt<PromptGetInvitedContext, any>({
        field: "inviteCode",
        component: TextareaEditor,
        params: {
          view: (editorContent.checkInviteCode = {
            title: window.o.i18n("dapps.o-onboarding.processes.invitation.buyInvitation.enterInvitCode"),
            description: window.o.i18n("dapps.o-onboarding.processes.invitation.buyInvitation.enterInvitCodeBelow"),
            submitButtonText: window.o.i18n("dapps.o-onboarding.processes.invitation.buyInvitation.verify"),
          }),
        },
        dataSchema: yup
          .string()
          .required(
            window.o.i18n("dapps.o-onboarding.processes.invitation.buyInvitation.editorContent.dataSchemaRequired")
          ),
        navigation: {
          next: "#redeemCode",
        },
      }),
      redeemCode: {
        id: "redeemCode",
        invoke: {
          src: async (context) => {
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const claimResult = await apiClient.mutate({
              mutation: ClaimInvitationDocument,
              variables: {
                code: context.data.inviteCode,
              },
            });
            if (claimResult.errors) {
              context.messages["inviteCode"] = claimResult.errors.map((o) => o.message).join(" \n");
              throw new Error(
                window.o.i18n(
                  "dapps.o-onboarding.processes.invitation.buyInvitation.editorContent.couldNotClaimInvitation",
                  { values: { contextMessages: context.messages["inviteCode"] } }
                )
              );
            }
            if (!claimResult.data.claimInvitation.success) {
              context.messages["inviteCode"] = claimResult.data.claimInvitation.error;
              throw new Error(
                window.o.i18n(
                  "dapps.o-onboarding.processes.invitation.buyInvitation.editorContent.couldNotClaimInvitation",
                  { values: { contextMessages: context.messages["inviteCode"] } }
                )
              );
            }
          },
          onError: "#inviteCode",
          onDone: "#success",
        },
      },

      success: {
        id: "success",
        type: "final",
        entry: (context) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        },
        data: () => true,
      },
    },
  });

export const promptGetInvited: ProcessDefinition<void, PromptGetInvitedContext> = {
  name: "promptGetInvited",
  stateMachine: <any>processDefinition,
};
