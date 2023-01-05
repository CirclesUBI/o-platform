import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import * as yup from "yup";
import { promptChoice, PromptChoiceSpec } from "./identify/prompts/promptChoice";
import ChoiceSelector from "@o-platform/o-editors/src/ChoiceSelector.svelte";
import { promptFile } from "../../../shared/api/promptFile";
import { DisplayCurrency, UpsertProfileDocument } from "../../../shared/api/data/types";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import NumberEditor from "@o-platform/o-editors/src/NumberEditor.svelte";

export type UpsertIdentityContextData = {
  id?: number;
  newsletter?: boolean;
  displayTimeCircles?: boolean;
  displayCurrency?: DisplayCurrency;
  circlesAddress?: string;
  circlesSafeOwner?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  dream?: string;
  avatarUrl?: string;
  avatarMimeType?: string;
  gender?: string;
  age?: number;
  successAction?: (data: UpsertIdentityContextData) => void;
};

export type UpsertIdentityContext = ProcessContext<UpsertIdentityContextData>;

const editorContent: { [x: string]: EditorViewContext } = {
  firstName: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.description"),
    placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.placeholder"),
    submitButtonText: window.o.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.firstName.submitButtonText"
    ),
  },
  lastName: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.description"),
    placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.placeholder"),
    submitButtonText: window.o.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.lastName.submitButtonText"
    ),
  },

  gender: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.gender.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.gender.description"),
    placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.gender.placeholder"),
    submitButtonText: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.gender.submitButtonText"),
  },
  age: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.age.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.age.description"),
    placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.age.placeholder"),
    submitButtonText: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.age.submitButtonText"),
  },
  imageView: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.description"),
    placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.placeholder"),
    submitButtonText: window.o.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.imageView.submitButtonText"
    ),
  },
  newsletter: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.newsletter.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.newsletter.description"),
    placeholder: "",
    submitButtonText: "",
  },
};

const processDefinition = (processId: string) =>
  createMachine<UpsertIdentityContext, any>({
    id: `${processId}:upsertIdentity`,
    initial: "firstName",

    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<UpsertIdentityContext, any>("error"),

      firstName: prompt<UpsertIdentityContext, any>({
        field: "firstName",
        component: TextEditor,
        params: {
          view: (editorContent.firstName = {
            title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.title"),
            description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.description"),
            placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.placeholder"),
            submitButtonText: window.o.i18n(
              "dapps.o-passport.processes.upsertIdentity.editorContent.firstName.submitButtonText"
            ),
          }),
        },
        dataSchema: yup.string().required(window.o.i18n("dapps.o-passport.processes.upsertIdentity.requiredName")),
        navigation: {
          canGoBack: () => true,
          previous: "#newsletter",
          next: "#lastName",
        },
      }),

      lastName: prompt<UpsertIdentityContext, any>({
        field: "lastName",
        component: TextEditor,
        params: {
          view: (editorContent.lastName = {
            title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.title"),
            description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.description"),
            placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.placeholder"),
            submitButtonText: window.o.i18n(
              "dapps.o-passport.processes.upsertIdentity.editorContent.lastName.submitButtonText"
            ),
          }),
        },
        navigation: {
          next: "#gender",
          previous: "#firstName",
          canSkip: () => true,
        },
      }),

      gender: promptChoice(<PromptChoiceSpec<any, any>>{
        id: "gender",
        options: [
          {
            key: "male",
            target: "#male",
            label: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.gender.option.male"),
          },
          {
            key: "female",
            target: "#female",
            label: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.gender.option.female"),
          },
          {
            key: "divers",
            target: "#divers",
            label: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.gender.option.divers"),
          },
        ],
        params: {
          view: {
            title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.gender.title"),
            description: window.o.i18n("apps.o-passport.processes.upsertIdentity.editorContent.gender.description"),
          },
        },
        component: ChoiceSelector,
        navigation: {
          canSkip: () => true,
          canGoBack: () => true,
          next: "#age",
          previous: "#lastName",
        },
      }),

      male: {
        id: "male",
        entry: (ctx) => (ctx.data.gender = "MALE"),
        always: "#age",
      },
      female: {
        id: "female",
        entry: (ctx) => (ctx.data.gender = "FEMALE"),
        always: "#age",
      },
      divers: {
        id: "divers",
        entry: (ctx) => (ctx.data.gender = "DIVERS"),
        always: "#age",
      },

      age: prompt<UpsertIdentityContext, any>({
        field: "age",
        component: NumberEditor,
        params: {
          view: (editorContent.age = {
            title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.age.title"),
            description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.age.description"),
            placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.age.placeholder"),
            submitButtonText: window.o.i18n(
              "dapps.o-passport.processes.upsertIdentity.editorContent.age.submitButtonText"
            ),
          }),
        },
        navigation: {
          next: "#location",
          previous: "#gender",
          canSkip: () => true,
        },
      }),

      avatarUrl: promptFile<UpsertIdentityContext, any>({
        field: "avatarUrl",
        uploaded: (context, event) => {
          context.data.avatarUrl = event.data?.url;
          context.data.avatarMimeType = event.data?.mimeType;
        },
        params: {
          view: (editorContent.imageView = {
            title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.title"),
            description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.description"),
            placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.placeholder"),
            submitButtonText: window.o.i18n(
              "dapps.o-passport.processes.upsertIdentity.editorContent.imageView.submitButtonText"
            ),
          }),
        },
        navigation: {
          next: "#upsertIdentity",
          previous: "#location",
          canSkip: () => true,
        },
      }),

      upsertIdentity: {
        id: "upsertIdentity",
        invoke: {
          src: async (context) => {
            if (!context.data.circlesSafeOwner && sessionStorage.getItem("circlesKey")) {
              localStorage.removeItem("circlesKey");
            }

            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const safeOwnerAddress =
              context.data.circlesSafeOwner ??
              (sessionStorage.getItem("circlesKey")
                ? RpcGateway.get().eth.accounts.privateKeyToAccount(sessionStorage.getItem("circlesKey")).address
                : undefined);
            const result = await apiClient.mutate({
              mutation: UpsertProfileDocument,
              variables: {
                id: context.data.id,
                circlesAddress: context.data.circlesAddress,
                circlesSafeOwner: safeOwnerAddress.toLowerCase(),
                firstName: context.data.firstName,
                lastName: context.data.lastName,

                newsletter: context.data.newsletter,
                displayTimeCircles: context.data.displayTimeCircles ?? true,
                country: context.data.country,
                avatarUrl: context.data.avatarUrl,
                avatarMimeType: context.data.avatarMimeType,
                status: "",
                displayCurrency: context.data.displayCurrency,
                age: context.data.age,
                gender: context.data.gender,
              },
            });

            return result.data.upsertProfile;
          },
          onDone: "#success",
          onError: "#error",
        },
      },
      success: {
        type: "final",
        id: "success",
        entry: (context, event) => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.authenticated",
            profile: event.data,
          });
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        },
        data: (context, event: any) => {
          return event.data;
        },
      },
    },
  });

export const upsertIdentity: ProcessDefinition<void, UpsertIdentityContextData> = {
  name: "upsertIdentity",
  stateMachine: <any>processDefinition,
};
