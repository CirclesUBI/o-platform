import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import * as yup from "yup";
import {promptFile} from "../../../shared/api/promptFile";
import {Profile, UpsertOrganisationDocument} from "../../../shared/api/data/types";
import {me} from "../../../shared/stores/me";
import {show} from "@o-platform/o-process/dist/actions/show";
import ErrorView from "../../../shared/atoms/Error.svelte";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {setWindowLastError} from "../../../shared/processes/actions/setWindowLastError";
import {cityByHereId, promptCity} from "../../../shared/api/promptCity";
import {CirclesSafe} from "../../o-banking/chain/circlesSafe";
import {Utilities} from "../../o-banking/chain/utilities";
import {DefaultExecutionContext} from "../../o-banking/chain/actions/action";

export type CreateOrganisationContextData = {
  successAction: (data: CreateOrganisationContextData) => void;
  id: number | undefined;
  avatarMimeType: "image/png";
  avatarUrl: string;
  circlesAddress: string;
  description: string;
  name: string;
  organisationSafeProxy: CirclesSafe;
  location: string;
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
            window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.maximumChars")
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
            title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.city.title"),
            description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.city.description"),
            placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.city.placeholder"),
            submitButtonText: window.o.i18n(
              "dapps.o-passport.processes.upsertIdentity.editorContent.city.submitButtonText"
            ),
          },
        },
        navigation: {
          next: "#avatarUrl",
          previous: "#description",
          canSkip: () => false,
        }
      }),
      avatarUrl: promptFile<CreateOrganisationContext, any>({
        field: "avatarUrl",
        uploaded: (_,__) => {
          //context.data.avatarUrl = event.data?.url;
          //context.data.avatarMimeType = event.data?.mimeType;
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


            const ownerAddress = Utilities.addressFromPrivateKey(privateKey);
            const executionContext = DefaultExecutionContext.fromKey(privateKey);

            context.data.organisationSafeProxy = await CirclesSafe.deploySafe(
              [ownerAddress],
              1,
              executionContext.signer,
              executionContext.ethAdapter,
              executionContext.networkConfig);
            context.data.circlesAddress = context.data.organisationSafeProxy.safeAddress;

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
          src: async (context, _) => {
            const privateKey = sessionStorage.getItem("circlesKey");
            if (!privateKey) {
              throw new Error(
                window.o.i18n(
                  "dapps.o-coop.processes.createOrganisations.createOrganisationContext.signupOrganisation.notUnlockedKey"
                )
              );
            }
            const receipt = await context.data.organisationSafeProxy.hubSignupOrganization();
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
            // return result.data.upsertProfile;
            if (context.data.location) {
              const city = await cityByHereId(context.data.location);
              context.data.lat = city.position.lat;
              context.data.lon = city.position.lng;
            }
            const organisation = {
              avatarMimeType: context.data.avatarMimeType,
              avatarUrl: context.data.avatarUrl,
              circlesAddress: context.data.circlesAddress.toLowerCase(),
              description: context.data.description,
              name: context.data.name,
              id: context.data.id,
              location: context.data.location,
              lat: context.data.lat,
              lon: context.data.lon
            };

            const apiClient = await window.o.apiClient.client.subscribeToResult();
            await apiClient.mutate({
              mutation: UpsertOrganisationDocument,
              variables: {
                organisation: organisation,
              },
            });
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
            set: (_) => {},
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
        data: () => true,
      },
    },
  });

export const createOrganisation: ProcessDefinition<void, CreateOrganisationContext> = {
  name: "createOrganisation",
  stateMachine: <any>processDefinition,
};
