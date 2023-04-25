import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import * as yup from "yup";
import { promptFile } from "../../../shared/api/promptFile";
import { UpsertOrganisationDocument } from "../../../shared/api/data/types";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import { show } from "@o-platform/o-process/dist/actions/show";
import ErrorView from "../../../shared/atoms/Error.svelte";
import { setWindowLastError } from "../../../shared/processes/actions/setWindowLastError";
import { promptLocation } from "../../../shared/api/promptLocation";

export type CreateOrganisationContextData = {
  successAction: (data: CreateOrganisationContextData) => void;
  id: number | undefined;
  avatarMimeType: "image/png";
  avatarUrl: string;
  circlesAddress: string;
  description: string;
  firstName: string;
  displayName: string;
  organisationSafeProxy: GnosisSafeProxy;
  location: any;
  locationName: string;
  lat: number;
  lon: number;
};

export type CreateOrganisationContext = ProcessContext<CreateOrganisationContextData>;

const processDefinition = (processId: string) =>
  createMachine<CreateOrganisationContext, any>({
    id: `${processId}:upsertOrganisation`,
    initial: "firstName",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<CreateOrganisationContext, any>("error"),

      firstName: prompt<CreateOrganisationContext, any>({
        id: "firstName",
        field: "firstName",
        component: TextEditor,
        params: {
          view: {
            title: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.title"),
            description: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.description"),
            placeholder: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.placeholder"),
            submitButtonText: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.submitButtonText"),
          },
        },
        dataSchema: yup
          .string()
          .required(window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.enterOrganisationName"))
          .max(40, window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.maximumChars")),
        navigation: {
          next: "#description",
        },
      }),
      description: prompt<CreateOrganisationContext, any>({
        field: "description",
        component: TextareaEditor,
        params: {
          view: {
            maxLength: "250",
            title: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.title"),
            description: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.description"),
            placeholder: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.placeholder"),
            submitButtonText: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.submitButtonText"),
          },
        },
        dataSchema: yup.string().nullable().notRequired().max(250, window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.maximumChars")),
        navigation: {
          next: "#location",
          canSkip: () => false,
          previous: "#firstName",
        },
      }),
      location: promptLocation<CreateOrganisationContext, any>({
        id: "location",
        field: "location",
        params: {
          view: {
            title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.city.title"),
            description: null,
            placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.city.placeholder"),
            submitButtonText: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.city.submitButtonText"),
          },
        },
        navigation: {
          next: "#avatarUrl",
          previous: "#description",
          canSkip: () => false,
        },
      }),
      avatarUrl: promptFile<CreateOrganisationContext, any>({
        field: "avatarUrl",
        uploaded: (context, event) => {
          context.data.avatarUrl = event.data?.url;
        },
        params: {
          view: {
            title: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.avatar.title"),
            description: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.avatar.description"),
            placeholder: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.avatar.placeholder"),
            submitButtonText: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.avatar.submitButtonText"),
          },
        },
        navigation: {
          next: "#upsertOrganisation",
          previous: "#location",
          canSkip: () => true,
        },
      }),
      upsertOrganisation: {
        id: "upsertOrganisation",
        entry: () => console.log(`upsertOrganisation ...`),
        invoke: {
          src: async (context) => {
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: UpsertOrganisationDocument,
              variables: {
                organisation: {
                  id: context.data.id,
                  avatarMimeType: context.data.avatarMimeType,
                  avatarUrl: context.data.avatarUrl,
                  circlesAddress: context.data.circlesAddress.toLowerCase(),
                  description: context.data.description,
                  firstName: context.data.firstName,
                  location: context.data.location.place_id,
                  lat: context.data.location.lat,
                  lon: context.data.location.lng,
                  locationName: context.data.location.address,
                },
              },
            });
            context.data.displayName = context.data.firstName;
            context.data = {
              ...context.data,
              ...result.data.upsertOrganisation.organisation,
            };
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
        entry: (context) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        },
        data: (context, event: any) => {
          return context.data;
        },
      },
    },
  });

export const upsertOrganisation: ProcessDefinition<void, CreateOrganisationContext> = {
  name: "upsertOrganisation",
  stateMachine: <any>processDefinition,
};
