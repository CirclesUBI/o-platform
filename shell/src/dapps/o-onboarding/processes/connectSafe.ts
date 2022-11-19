import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import TextareaEditor from "../../../../../packages/o-editors/src/TextareaEditor.svelte";
import {ConnectSafeContext} from "../../o-passport/processes/identify/connectSafe/connectSafe2";
import {
  FindSafesByOwnerDocument,
  FindSafesByOwnerQueryVariables,
  ImportOrganisationsDocument,
  SafeInfo,
  UpsertProfileDocument,
} from "../../../shared/api/data/types";
import HtmlViewer from "../../../../../packages/o-editors/src/HtmlViewer.svelte";
import {KeyManager} from "../../o-passport/data/keyManager";
import {loadProfile} from "../../o-passport/processes/identify/services/loadProfile";
import SimpleDropDownEditor from "../../../../../packages/o-editors/src/SimpleDropDownEditor.svelte";
import {DropdownSelectorParams} from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import DropDownCandidateSafe from "../views/atoms/DropDownCandidateSafe.svelte";
import {ApiClient} from "../../../shared/apiConnection";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {Utilities} from "../../o-banking/chain/utilities";
import {DefaultExecutionContext} from "../../o-banking/chain/actions/action";
import {Environment} from "../../../shared/environment";
import {CirclesSafe} from "../../o-banking/chain/circlesSafe";

export type ConnectSafeInfo = {
  success: boolean;
  errorMessage?: string;
  importedAccount?: { address: string, privateKey: string };
  ownedSafes?: { [x: string]: SafeInfo & { isAlive: boolean } };
};

export type PromptConnectOrCreateContextData = {
  seedPhrase?: string;
  availableSafes?: ConnectSafeInfo;
  selectedSafe?: SafeInfo & { isAlive: boolean };
  successAction?: (data: PromptConnectOrCreateContextData) => void;
};

export type PromptConnectOrCreateContext = ProcessContext<PromptConnectOrCreateContextData>;

const editorContent = {
  seedPhrase: {
    title: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.title"),
    description: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.description"),
    placeholder: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.placeholder"),
    submitButtonText: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.submitButtonText"),
  },
  addOwnerInfo: {
    title: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.addOwnerInfo.title"),
    description: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.addOwnerInfo.description"),
    placeholder: "",
    submitButtonText: window.o.i18n(
      "dapps.o-onboarding.processes.connectSafe.editorContent.addOwnerInfo.submitButtonText"
    ),
  },
  accountIsDeadInfo: {
    title: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.accountIsDeadInfo.title"),
    description: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.accountIsDeadInfo.description"),
    placeholder: "",
    submitButtonText: window.o.i18n(
      "dapps.o-onboarding.processes.connectSafe.editorContent.accountIsDeadInfo.submitButtonText"
    ),
  },
};

async function safeInfoFromSeedphrase(context: ConnectSafeContext): Promise<ConnectSafeInfo> {
  let keyFromMnemonic: { privateKey: string, address: string };
  try {
    keyFromMnemonic = Utilities.mnemonicToPrivateKey(context.data.seedPhrase.replace(/\s\s+/g, " "));
    //keyFromMnemonic = "0x" + bip39.mnemonicToEntropy();
  } catch (e) {
    return {
      success: false,
      errorMessage: window.o.i18n("dapps.o-onboarding.processes.connectSafe.safeInfoFromSeedphrase.seedphraseError"),
    };
  }

  const candidates = await ApiClient.query<SafeInfo[], FindSafesByOwnerQueryVariables>(FindSafesByOwnerDocument, {
    owner: keyFromMnemonic.address.toLowerCase(),
  });

  if (candidates.length == 0) {
    return {
      success: false,
      errorMessage:
        window.o.i18n("dapps.o-onboarding.processes.connectSafe.safeInfoFromSeedphrase.foundNoSafes") +
        `${keyFromMnemonic.address.toLowerCase()}.`,
    };
  }

  const candidatesBySafeAddress = candidates.reduce((p, c) => {
    p[c.safeAddress] = c;
    return p;
  }, <{ [x: string]: SafeInfo }>{});

  return {
    success: true,
    importedAccount: keyFromMnemonic,
    ownedSafes: Object.values(candidatesBySafeAddress)
      .map((o) => {
        const nowMinus90days = Date.now() - 90 * 24 * 60 * 60 * 1000;
        return {
          ...o,
          isAlive: o.lastUbiAt && parseInt(o.lastUbiAt) > nowMinus90days,
        };
      })
      .reduce((p, c) => {
        p[c.safeAddress] = c;
        return p;
      }, <{ [x: string]: SafeInfo & { isAlive: boolean } }>{}),
  };
}

const processDefinition = (processId: string) =>
  createMachine<PromptConnectOrCreateContext, any>({
    id: `${processId}:promptConnectOrCreate`,
    initial: "seedPhrase",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<PromptConnectOrCreateContext, any>("error"),

      seedPhrase: prompt<ConnectSafeContext, any>({
        field: "seedPhrase",
        component: TextareaEditor,
        isSensitive: true,
        params: {
          view: editorContent.seedPhrase = {
            title: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.title"),
            description: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.description"),
            placeholder: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.placeholder"),
            submitButtonText: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.seedPhrase.submitButtonText"),
          },
        },
        navigation: {
          next: "#findSafe",
        },
      }),

      findSafe: {
        id: "findSafe",
        invoke: {
          src: async (context) => {
            context.data.availableSafes = await safeInfoFromSeedphrase(context);
            if (!context.data.availableSafes.success) {
              context.messages["seedPhrase"] = context.data.availableSafes.errorMessage;
              throw new Error(context.messages["seedPhrase"]);
            }
            const ownedSafes = Object.values(context.data.availableSafes.ownedSafes);
            if (context.data.availableSafes.success && ownedSafes.length == 1) {
              context.data.selectedSafe = ownedSafes[0];
            }
          },
          onDone: [
            {
              cond: (context) => !!context.data.selectedSafe && context.data.selectedSafe.isAlive,
              target: "#addNewOwnerInfo",
            },
            {
              cond: (context) => !!context.data.selectedSafe && !context.data.selectedSafe.isAlive,
              target: "#accountIsDeadInfo",
            },
            {
              target: "#selectSafe",
            },
          ],
          onError: "#seedPhrase",
        },
      },

      selectSafe: prompt<PromptConnectOrCreateContext, any>({
        id: "selectSafe",
        field: "selectedSafe",
        component: SimpleDropDownEditor,
        params: <DropdownSelectorParams<PromptConnectOrCreateContext, SafeInfo, string>>{
          view: {
            title: window.o.i18n("dapps.o-onboarding.processes.connectSafe.selectSafe.title"),
            description: window.o.i18n("dapps.o-onboarding.processes.connectSafe.selectSafe.description"),
            submitButtonText: window.o.i18n("dapps.o-onboarding.processes.connectSafe.selectSafe.submitButtonText"),
          },
          placeholder: "",
          submitButtonText: window.o.i18n("dapps.o-onboarding.processes.connectSafe.selectSafe.submitButtonText"),
          itemTemplate: DropDownCandidateSafe, // TODO: This is not used by the SimpleDropDownEditor
          getKey: (o) => o.safeAddress,
          getLabel: (o) => (o.safeProfile ? o.safeProfile.displayName : o.safeAddress),
          keyProperty: "safeAddress",
          choices: {
            byKey: async (key: string, context) => {
              return context.data.availableSafes.ownedSafes[key];
            },
            find: async (filter: string, context) => {
              return Object.values(context.data.availableSafes.ownedSafes);
            },
          },
        },
        navigation: {
          next: [
            {
              cond: (context) => !context.data.selectedSafe.isAlive,
              target: "#accountIsDeadInfo",
            },
            {
              target: "#addNewOwnerInfo",
            },
          ],
          previous: "#seedPhrase",
          canSkip: () => false,
          canGoBack: () => true,
        },
      }),

      accountIsDeadInfo: prompt({
        id: "accountIsDeadInfo",
        field: "__",
        component: HtmlViewer,
        params: {
          view: editorContent.accountIsDeadInfo = {
            title: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.accountIsDeadInfo.title"),
            description: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.accountIsDeadInfo.description"),
            placeholder: "",
            submitButtonText: window.o.i18n(
              "dapps.o-onboarding.processes.connectSafe.editorContent.accountIsDeadInfo.submitButtonText"
            ),
          },
          html: () => editorContent.accountIsDeadInfo.description = window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.accountIsDeadInfo.description"),
          hideNav: false,
        },
        navigation: {
          next: "#addNewOwner",
        },
      }),

      addNewOwnerInfo: prompt({
        id: "addNewOwnerInfo",
        field: "__",
        component: HtmlViewer,
        params: {
          view: editorContent.addOwnerInfo = {
            title: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.addOwnerInfo.title"),
            description: window.o.i18n("dapps.o-onboarding.processes.connectSafe.editorContent.addOwnerInfo.description"),
            placeholder: "",
            submitButtonText: window.o.i18n(
              "dapps.o-onboarding.processes.connectSafe.editorContent.addOwnerInfo.submitButtonText"
            ),
          },
          html: () => "", //window.o.i18n("dapps.o-onboarding.processes.connectSafe.addNewOwnerInfo"),
          hideNav: false,
        },
        navigation: {
          next: "#addNewOwner",
        },
      }),

      addNewOwner: {
        id: "addNewOwner",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.o.i18n("dapps.o-onboarding.processes.connectSafe.addNewOwner"),
          });
        },
        invoke: {
          src: async (context) => {
            if (typeof context.data.selectedSafe === "string") {
              context.data.selectedSafe = context.data.availableSafes[context.data.selectedSafe];
            }

            // Transfer the 'controlledSafeMinBalance' to the eoa if it's got not enough balance to pay for gas
            const oldOwnerBalance = await Utilities.getBalance(
              DefaultExecutionContext.readonly(),
              context.data.availableSafes.importedAccount.address);

            if (oldOwnerBalance.lt(Utilities.toWei(Environment.controlledSafeMinBalance))) {
              const circlesKey = sessionStorage.getItem("circlesKey");
              const currentTorusEoa = Utilities.addressFromPrivateKey(
                sessionStorage.getItem("circlesKey")
              );

              const result = await Utilities.transferEth(
                DefaultExecutionContext.fromKey(circlesKey),
                currentTorusEoa,
                context.data.availableSafes.importedAccount.address,
                Utilities.toWei(0.01));

              console.log(`Transferred ${Environment.controlledSafeMinBalance} xdai to ${context.data.availableSafes.importedAccount.address}. Tx hash: ${result.transactionHash}`)
            }

            const importedSafe = new CirclesSafe(
              context.data.selectedSafe.safeAddress,
              DefaultExecutionContext.fromKey(context.data.availableSafes.importedAccount.privateKey));

            var km = new KeyManager(null);
            await km.load();

            const currentOwners = await importedSafe.getOwners();
            if (currentOwners.find((o) => o.toLowerCase() == km.torusKeyAddress.toLowerCase())) {
              console.log("The new safe owner was already added.");
            } else {
              const receipt = await importedSafe.addOwner(km.torusKeyAddress);
              console.log("Added new owner to safe: ", receipt);
            }
          },
          onDone: "updateRegistration",
          onError: {
            actions: (context, event) => {
              console.log(`An error occurred while adding the owner:`, event);
            },
            target: "seedPhrase",
          },
        },
      },

      updateRegistration: {
        id: "updateRegistration",
        invoke: {
          src: async (context) => {
            const apiClient = await window.o.apiClient.client.subscribeToResult();

            window.o.publishEvent(<PlatformEvent>{
              type: "shell.progress",
              message: window.o.i18n(
                "dapps.o-onboarding.processes.connectSafe.updateRegistration.importingYourOrganisations"
              ),
            });

            const importedOrganisations = await apiClient.mutate({
              mutation: ImportOrganisationsDocument,
            });
            console.log("importedOrganisations:", importedOrganisations);

            const orgas: {
              id: number;
              circlesAddress: string;
              name: string;
              description?: string;
              avatarUrl?: string;
            }[] = importedOrganisations.data?.importOrganisationsOfAccount;

            var km = new KeyManager(null);
            await km.load();

            for (let orga of orgas) {
              window.o.publishEvent(<PlatformEvent>{
                type: "shell.progress",
                message: window.o.i18n("dapps.o-onboarding.processes.connectSafe.updateRegistration.addingYouAsOwner", {
                  values: {orgaName: orga.name},
                }),
              });
              try {
                const safe = new CirclesSafe(
                  orga.circlesAddress,
                  DefaultExecutionContext.fromKey(context.data.availableSafes.importedAccount.privateKey));

                const receipt = await safe.addOwner(km.torusKeyAddress);
                console.log(`Added current torus owner as new owner for imported orga ${orga.circlesAddress}:`, receipt);
              } catch (e) {
                console.error(e);
              }
            }

            window.o.publishEvent(<PlatformEvent>{
              type: "shell.progress",
              message: window.o.i18n("dapps.o-onboarding.processes.connectSafe.publishEvent"),
            });

            const $me = await loadProfile();

            let importedFirstName = context.data.selectedSafe.safeProfile?.firstName
              ? context.data.selectedSafe.safeProfile?.firstName
              : "";

            if (Utilities.isAddress(importedFirstName)) {
              importedFirstName = "";
            }

            await apiClient.mutate({
              mutation: UpsertProfileDocument,
              variables: {
                id: $me.id,
                successorOfCirclesAddress: !context.data.selectedSafe.isAlive
                  ? context.data.selectedSafe.safeAddress?.toLowerCase()
                  : undefined,
                circlesSafeOwner: $me.circlesSafeOwner,
                askedForEmailAddress: false,
                circlesAddress: context.data.selectedSafe.isAlive
                  ? context.data.selectedSafe.safeAddress.toLowerCase()
                  : undefined,
                avatarCid: $me.avatarCid,
                avatarUrl: $me.avatarUrl
                  ? $me.avatarUrl
                  : context.data.selectedSafe.safeProfile?.avatarUrl
                    ? context.data.selectedSafe.safeProfile?.avatarUrl
                    : null,
                avatarMimeType: $me.avatarMimeType,
                firstName: $me.firstName && $me.firstName != "" ? $me.firstName : importedFirstName,
                lastName: $me.lastName
                  ? $me.lastName
                  : context.data.selectedSafe.safeProfile?.lastName
                    ? context.data.selectedSafe.safeProfile?.lastName
                    : null,
                country: $me.country,
                dream: $me.dream,
                newsletter: $me.newsletter,
                displayCurrency: $me.displayCurrency,
                status: $me.status ?? "registered",
              },
            });
          },
          onDone: "success",
          onError: "seedPhrase",
        },
      },

      success: {
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

export const connectSafe: ProcessDefinition<void, PromptConnectOrCreateContext> = {
  name: "connectSafe",
  stateMachine: <any>processDefinition,
};
