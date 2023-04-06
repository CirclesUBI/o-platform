import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
// import EmailAddressEditor from "@o-platform/o-editors/src/EmailAddressEditor.svelte";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import * as yup from "yup";
import { promptChoice } from "./identify/prompts/promptChoice";
import ChoiceSelector from "@o-platform/o-editors/src/ChoiceSelector.svelte";
import { promptFile } from "../../../shared/api/promptFile";
import { DisplayCurrency, UpsertProfileDocument } from "../../../shared/api/data/types";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { UpsertRegistrationContext } from "../../o-onboarding/processes/registration/promptRegistration";
import { promptLocation } from "../../../shared/api/promptLocation";
import ErrorView from "../../../shared/atoms/Error.svelte";
import { setWindowLastError } from "../../../shared/processes/actions/setWindowLastError";
import { show } from "@o-platform/o-process/dist/actions/show";

export type UpsertIdentityContextData = {
  id?: number;
  surveyDataSessionId?: string;
  newsletter?: boolean;
  displayTimeCircles?: boolean;
  displayCurrency?: DisplayCurrency;
  circlesAddress?: string;
  circlesSafeOwner?: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  askedForEmailAddress?: boolean;
  country?: string;
  dream?: string;
  avatarUrl?: string;
  avatarMimeType?: string;
  successAction?: (data: UpsertIdentityContextData) => void;
  location: any;
  locationName: string;
  lat: number;
  lon: number;
};

export type UpsertIdentityContext = ProcessContext<UpsertIdentityContextData>;

const editorContent: { [x: string]: EditorViewContext } = {
  firstName: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.description"),
    placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.placeholder"),
    submitButtonText: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.submitButtonText"),
  },
  lastName: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.description"),
    placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.placeholder"),
    submitButtonText: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.submitButtonText"),
  },

  imageView: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.description"),
    placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.placeholder"),
    submitButtonText: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.submitButtonText"),
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
            submitButtonText: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.submitButtonText"),
          }),
        },
        dataSchema: yup.string().required(window.o.i18n("dapps.o-passport.processes.upsertIdentity.requiredName")),
        navigation: {
          canGoBack: () => true,
          // previous: "#newsletter",
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
            submitButtonText: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.submitButtonText"),
          }),
        },
        navigation: {
          next: "#avatarUrl",
          previous: "#firstName",
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
            submitButtonText: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.submitButtonText"),
          }),
        },
        navigation: {
          next: "#location",
          previous: "#lastName",
          canSkip: () => true,
        },
      }),

      location: promptLocation<UpsertIdentityContext, any>({
        id: "location",
        field: "location",
        params: {
          view: (editorContent.city = {
            title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.city.title"),
            description: null,
            placeholder: null,
            submitButtonText: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.city.submitButtonText"),
          }),
        },
        navigation: {
          next: "#upsertIdentity",
          previous: "#avatarUrl",
          canSkip: () => false,
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
              (sessionStorage.getItem("circlesKey") ? RpcGateway.get().eth.accounts.privateKeyToAccount(sessionStorage.getItem("circlesKey")).address : undefined);

            const result = await apiClient.mutate({
              mutation: UpsertProfileDocument,
              variables: {
                id: context.data.id,
                circlesAddress: context.data.circlesAddress,
                circlesSafeOwner: safeOwnerAddress.toLowerCase(),
                firstName: context.data.firstName,
                lastName: context.data.lastName,
                emailAddress: context.data.emailAddress,
                askedForEmailAddress: true,
                displayTimeCircles: context.data.displayTimeCircles ?? true,
                country: context.data.country,
                avatarUrl: context.data.avatarUrl,
                avatarMimeType: context.data.avatarMimeType,
                status: "",
                displayCurrency: context.data.displayCurrency,
                location: context.data.location ? context.data.location.place_id : null,
                lat: context.data.location ? context.data.location.lat : null,
                lon: context.data.location ? context.data.location.lng : null,
                locationName: context.data.location ? context.data.location.address : null,
              },
            });

            return result.data.upsertProfile;
          },
          onDone: "#success",
          onError: {
            actions: setWindowLastError,
            target: "#showError",
          },
        },
      },
      showError: {
        id: "showError",
        entry: show({
          // TODO: fix <any> cast
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
