import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import * as yup from "yup";
import { promptFile } from "../../../shared/api/promptFile";
import { Profile, UpsertOrganisationDocument } from "../../../shared/api/data/types";
import { CirclesHub } from "@o-platform/o-circles/dist/circles/circlesHub";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import { me } from "../../../shared/stores/me";
import { GnosisSafeProxyFactory } from "@o-platform/o-circles/dist/safe/gnosisSafeProxyFactory";
import { show } from "@o-platform/o-process/dist/actions/show";
import ErrorView from "../../../shared/atoms/Error.svelte";
import { Environment } from "../../../shared/environment";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { setWindowLastError } from "../../../shared/processes/actions/setWindowLastError";
import { cityByHereId, promptCity } from "../../../shared/api/promptCity";

export type CreateOrganisationContextData = {
  successAction: (data: CreateOrganisationContextData) => void;
  id: number | undefined;
  avatarMimeType: "image/png";
  avatarUrl: string;
  circlesAddress: string;
  description: string;
  name: string;
  displayName: string;
  organisationSafeProxy: GnosisSafeProxy;
  location: string;
  locationName: string;
  lat: number;
  lon: number;
};

export type CreateOrganisationContext = ProcessContext<CreateOrganisationContextData>;

const processDefinition = (processId: string) =>
  createMachine<CreateOrganisationContext, any>({
    id: `${processId}:createOrganisation`,
    initial: "name",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<CreateOrganisationContext, any>("error"),

      name: prompt<CreateOrganisationContext, any>({
        id: "name",
        field: "name",
        component: TextEditor,
        params: {
          view: {
            title: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.title"),
            description: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.description"
            ),
            placeholder: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.placeholder"
            ),
            submitButtonText: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.submitButtonText"
            ),
          },
        },
        dataSchema: yup
          .string()
          .required(
            window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.enterOrganisationName"
            )
          ),
        navigation: {
          next: "#description",
        },
      }),
      description: prompt<CreateOrganisationContext, any>({
        field: "description",
        component: TextareaEditor,
        params: {
          view: {
            title: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.title"
            ),
            description: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.description"
            ),
            placeholder: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.placeholder"
            ),
            submitButtonText: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.submitButtonText"
            ),
          },
        },
        dataSchema: yup
          .string()
          .nullable()
          .notRequired()
          .max(
            150,
            window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.maximumChars"
            )
          ),
        navigation: {
          next: "#location",
          canSkip: () => false,
          previous: "#description",
        },
      }),
      location: promptCity<CreateOrganisationContext, any>({
        id: "location",
        field: "location",
        params: {
          view: {
            title: window.o.i18n("dapps.o-coop.processes.createOrganisation.editorContent.location.title"),
            description: window.o.i18n("dapps.o-coop.processes.createOrganisation.editorContent.location.description"),
            placeholder: window.o.i18n("dapps.o-coop.processes.createOrganisation.editorContent.location.placeholder"),
            submitButtonText: window.o.i18n(
              "dapps.o-passport.processes.upsertIdentity.editorContent.location.submitButtonText"
            ),
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
            description: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.avatar.description"
            ),
            placeholder: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.avatar.placeholder"
            ),
            submitButtonText: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.avatar.submitButtonText"
            ),
          },
        },
        navigation: {
          next: "#checkDeploy",
          previous: "#description",
          canSkip: () => true,
        },
      }),
      checkDeploy: {
        id: "checkDeploy",
        always: [
          {
            cond: () => true,
            target: "#deployOrganisation",
          },
          {
            cond: () => false,
            target: "#upsertOrganisation",
          },
        ],
      },
      deployOrganisation: {
        id: "deployOrganisation",
        entry: () => {
          console.log(`deployOrganisation ...`);
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.o.i18n("dapps.o-coop.processes.createOrganisations.deployOrganisation.progress"),
          });
        },
        invoke: {
          src: async (context) => {
            const privateKey = sessionStorage.getItem("circlesKey");
            if (!privateKey) {
              throw new Error(
                window.o.i18n(
                  "dapps.o-coop.processes.createOrganisations.createOrganisationContext.deployOrganisation.notUnlockedKey"
                )
              );
            }

            let $me: Profile = null;
            const unsub = me.subscribe((current) => {
              $me = current;
            });
            unsub();

            if (!$me?.circlesAddress) {
              throw new Error(
                window.o.i18n(
                  "dapps.o-coop.processes.createOrganisations.createOrganisationContext.deployOrganisation.needFullAccountSetup"
                )
              );
            }

            const proxyFactory = new GnosisSafeProxyFactory(
              RpcGateway.get(),
              Environment.safeProxyFactoryAddress,
              Environment.masterSafeAddress
            );

            context.data.organisationSafeProxy = await proxyFactory.deployNewSafeProxy(privateKey);
            context.data.circlesAddress = context.data.organisationSafeProxy.address;

            console.log(context.data.organisationSafeProxy);
          },
          onDone: "#signupOrganisation",
          onError: {
            actions: setWindowLastError,
            target: "#showError",
          },
        },
      },
      signupOrganisation: {
        id: "signupOrganisation",
        entry: () => console.log(`signupOrganisation ...`),
        invoke: {
          src: async (context, event) => {
            const privateKey = sessionStorage.getItem("circlesKey");
            if (!privateKey) {
              throw new Error(
                window.o.i18n(
                  "dapps.o-coop.processes.createOrganisations.createOrganisationContext.signupOrganisation.notUnlockedKey"
                )
              );
            }

            const hub = new CirclesHub(RpcGateway.get(), Environment.circlesHubAddress);
            const receipt = await hub.signupOrganisation(privateKey, context.data.organisationSafeProxy);
            console.log(receipt);
          },
          onDone: "#upsertOrganisation",
          onError: {
            actions: setWindowLastError,
            target: "#showError",
          },
        },
      },
      upsertOrganisation: {
        id: "upsertOrganisation",
        entry: () => console.log(`upsertOrganisation ...`),
        invoke: {
          src: async (context) => {
            if (context.data.location) {
              const city = await cityByHereId(context.data.location);
              context.data.lat = city.position.lat;
              context.data.lon = city.position.lng;
              context.data.locationName = city.title;
            }
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: UpsertOrganisationDocument,
              variables: {
                organisation: {
                  avatarMimeType: context.data.avatarMimeType,
                  avatarUrl: context.data.avatarUrl,
                  circlesAddress: context.data.circlesAddress.toLowerCase(),
                  description: context.data.description,
                  name: context.data.name,
                  location: context.data.location,
                  lat: context.data.lat,
                  lon: context.data.lon,
                  locationName: context.data.locationName,
                },
              },
            });
            context.data.displayName = context.data.name;
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

export const createOrganisation: ProcessDefinition<void, CreateOrganisationContext> = {
  name: "createOrganisation",
  stateMachine: <any>processDefinition,
};
