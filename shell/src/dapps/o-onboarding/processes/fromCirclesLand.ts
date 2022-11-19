import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { createMachine } from "xstate";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import TextareaEditor from "../../../../../packages/o-editors/src/TextareaEditor.svelte";
import * as bip39 from "bip39";
import gql from "graphql-tag";
import DropdownSelectEditor from "../../../../../packages/o-editors/src/DropdownSelectEditor.svelte";
import { DropdownSelectorParams } from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import DropDownString from "../../../../../packages/o-editors/src/dropdownItems/DropDownString.svelte";
import { ConnectSafeContext } from "../../o-passport/processes/identify/connectSafe/connectSafe2";
import { BN } from "ethereumjs-util";
import { upsertIdentity } from "../../o-passport/processes/upsertIdentity";
import { EoaData, SafeData } from "./initEvent";
import {Utilities} from "../../o-banking/chain/utilities";
import {CirclesSafe} from "../../o-banking/chain/circlesSafe";
import {DefaultExecutionContext} from "../../o-banking/chain/actions/defaultExecutionContext";

export type FromCirclesLandContextData = {
  seedPhrase?: string;
  eoa?: EoaData;
  safe?: SafeData;
  foundSafeAddresses?: string[];
  chooseSafeAddress?: string;
  circlesLandProfile?: {
    username: string;
    avatarUrl: string;
  };
};

export type FromCirclesLandContext = ProcessContext<FromCirclesLandContextData>;

const processDefinition = (processId: string) =>
  createMachine<FromCirclesLandContext, any>({
    id: `${processId}:fromCirclesLand`,
    initial: "seedPhrase",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<FromCirclesLandContext, any>("error"),

      seedPhrase: prompt<ConnectSafeContext, any>({
        field: "seedPhrase",
        component: TextareaEditor,
        isSensitive: true,
        params: {
          label: window.o.i18n("dapps.o-onboarding.processes.fromCirclesLand.seedPhraseParams.label"),
          placeholder: window.o.i18n("dapps.o-onboarding.processes.fromCirclesLand.seedPhraseParams.placeholder"),
          submitButtonText: window.o.i18n("dapps.o-onboarding.processes.fromCirclesLand.seedPhraseParams.submitButtonText"),
        },
        navigation: {
          next: "#checkSeedphrase",
        },
      }),
      checkSeedphrase: {
        id: "checkSeedphrase",
        invoke: {
          src: async (context) => {
            context.messages["seedPhrase"] = "";

            let keyFromMnemonic: string;
            let account: string;

            try {
              keyFromMnemonic =
                "0x" +
                bip39.mnemonicToEntropy(
                  context.data.seedPhrase.replace(/\s\s+/g, " ")
                );
            } catch (e) {
              context.messages[
                "seedPhrase"
              ] = window.o.i18n("dapps.o-onboarding.processes.fromCirclesLand.checkSeedphrase.errors.cannotConvertToPrivateKey");
              throw e;
            }

            try {
              account = Utilities.addressFromPrivateKey(keyFromMnemonic);
            } catch (e) {
              context.messages[
                "seedPhrase"
              ] = window.o.i18n("dapps.o-onboarding.processes.fromCirclesLand.checkSeedphrase.errors.cannotConvertToEthereum");
              throw e;
            }

            if (!context.data.safe?.address) {
              // If the flow was initialized without safe-address ..
              const graph =
                await window.o.theGraphClient.client.subscribeToResult();
              const foundSafes = await graph.query({
                query: gql`
                  query user($id: String!) {
                    user(id: $id) {
                      safes {
                        id
                        organization
                        deployed
                        balances {
                          amount
                          token {
                            id
                          }
                        }
                      }
                    }
                  }
                `,
                variables: {
                  id: account.toLowerCase(),
                },
              });

              if (foundSafes.errors && foundSafes.errors.length) {
                const msg = window.o.i18n("dapps.o-onboarding.processes.fromCirclesLand.checkSeedphrase.errors.errorWhileTryingToFindSafe", { values: { error: JSON.stringify(foundSafes.errors)}});
                context.messages["seedPhrase"] = msg;
                throw new Error(msg);
              }

              context.data.foundSafeAddresses = foundSafes.data.user.safes
                .filter((o) => o.deployed && o.balances.length > 0)
                .map((o) => o.id);

              if (!context.data.foundSafeAddresses.length) {
                const msg = window.o.i18n("dapps.o-onboarding.processes.fromCirclesLand.checkSeedphrase.errors.couldNotFindSafe", { values: { accountAddress: account }});
                context.messages["seedPhrase"] = msg;
                throw new Error(msg);
              }
            }

            context.data.eoa = {
              address: account,
              privateKey: keyFromMnemonic,
              origin: "Imported",
              balance: new BN("0"),
            };
          },
          onDone: [
            {
              cond: (context) =>
                (context.messages["seedPhrase"]?.trim() ?? "") !== "",
              target: "#seedPhrase",
            },
            {
              cond: (context) => context.data.foundSafeAddresses?.length > 1,
              target: "#chooseSafeAddress",
            },
            {
              cond: (context) => context.data.foundSafeAddresses?.length == 1,
              actions: (context) =>
                (context.data.safe = {
                  address: context.data.foundSafeAddresses[0],
                  origin: "Imported",
                }),
              target: "#checkSafeAddress",
            },
            {
              target: "#checkSafeAddress",
            },
          ],
          onError: "#seedPhrase",
        },
      },
      chooseSafeAddress: prompt({
        field: "chooseSafeAddress",
        component: DropdownSelectEditor,
        params: <DropdownSelectorParams<ConnectSafeContext, string, string>>{
          label: window.o.i18n("dapps.o-onboarding.processes.fromCirclesLand.chooseSafeAddress.label"),
          placeholder: window.o.i18n("dapps.o-onboarding.processes.fromCirclesLand.chooseSafeAddress.placeholder"),
          submitButtonText: window.o.i18n("dapps.o-onboarding.processes.fromCirclesLand.chooseSafeAddress.submitButtonText"),
          itemTemplate: DropDownString,
          getKey: (safeAddress: any) => safeAddress.value,
          getLabel: (safeAddress: any) => safeAddress.label,
          choices: {
            byKey: async (key: string, context) => {
              return context.data.foundSafeAddresses.find((o) => o == key);
            },
            find: async (filter: string | undefined, context) => {
              return context.data.foundSafeAddresses.filter((o) =>
                o.toLowerCase().startsWith(filter?.toLowerCase() ?? "")
              );
            },
          },
        },
        navigation: {
          next: "#checkSafeAddress",
        },
      }),
      checkSafeAddress: {
        id: "checkSafeAddress",
        invoke: {
          src: async (context) => {
            context.messages["chooseSafeAddress"] = ``;
            const addressToCheck =
              context.data.chooseSafeAddress?.trim() ??
              context.data.safe?.address;
            try {
              const circlesSafe = new CirclesSafe(addressToCheck, DefaultExecutionContext.readonly);
              await circlesSafe.getNonce();

              context.data.safe = {
                address: addressToCheck,
                origin: "Imported",
              };

              return true;
            } catch (e) {
              context.messages[
                "chooseSafeAddress"
              ] = window.o.i18n("dapps.o-onboarding.processes.fromCirclesLand.checkSafeAddress.error", { values: { addressToCheck: addressToCheck}});

              throw e;
            }
          },
          onDone: "#success",
          onError: "#chooseSafeAddress",
        },
      },

      success: {
        id: "success",
        type: "final",
        entry: () => {
          // Start the upsert identity flow with the circles.garden profile
          // data:
          window.o.runProcess(upsertIdentity, {
            firstName: "Imported user",
            avatarUrl:
              "https://storage.googleapis.com/subgraph-images/1603464601140logo.svg",
          });
        },
        data: (context) => {
          return context.data;
        },
      },
    },
  });

export const fromCirclesLand: ProcessDefinition<void, FromCirclesLandContext> =
  {
    name: "fromCirclesLand",
    stateMachine: <any>processDefinition,
  };
