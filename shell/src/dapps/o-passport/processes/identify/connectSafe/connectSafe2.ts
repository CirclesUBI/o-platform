import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import * as bip39 from "bip39";
import gql from "graphql-tag";
import {DropdownSelectorParams} from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import DropDownString from "@o-platform/o-editors/src/dropdownItems/DropDownString.svelte";
import {EditorViewContext} from "@o-platform/o-editors/src/shared/editorViewContext";
import {AddressEoaMap, Eoa, KeyManager} from "../../../data/keyManager";
import PinInputEditor from "@o-platform/o-editors/src/Pin/PinInputEditor.svelte";
import * as yup from "yup";
import {Utilities} from "../../../../o-banking/chain/utilities";
import {CirclesSafe} from "../../../../o-banking/chain/circlesSafe";
import {DefaultExecutionContext} from "../../../../o-banking/chain/actions/action";

export type ConnectSafeContextData = {
  safeAddress?: string;
  foundSafeAddresses?: string[];
  safeOwners?: string[];
  accountAddress?: string;
  seedPhrase?: string;
  unlockKeyPin?: string;
  privateKey?: string;
  availableKeys?: AddressEoaMap;
  selectedKey?: Eoa;
};

export type ConnectSafeContext = ProcessContext<ConnectSafeContextData>;

const editorContent: { [x: string]: EditorViewContext } = {
  seedPhrase: {
    title: window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.editorContent.seedPhrase.title"),
    description: window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.editorContent.seedPhrase.description"),
    placeholder: window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.editorContent.seedPhrase.placeholder"),
    submitButtonText: window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.editorContent.seedPhrase.submitButtonText"),
  },
  selectExistingKey: {
    title: "PLEASE CHOOSE A KEY",
    description: `We found the some keys on your device. Please select the one you want to use:`,
    placeholder: "Recovery Code",
    submitButtonText: "Use key",
  },
  unlockPin: {
    title: "Please enter encryptingPin",
    description: "Please enter the encryptingPin for your key",
    placeholder: "Enter Pin",
    submitButtonText: "Login",
  },
};

const processDefinition = (processId: string) =>
  createMachine<ConnectSafeContext, any>({
    id: `${processId}`,
    initial: "init",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<ConnectSafeContext, any>("error"),

      init: {
        invoke: {
          src: async (context) => {
            const keyManager = new KeyManager(context.data.safeAddress);
            await keyManager.load();
            context.data.availableKeys = keyManager.eoas;
          },
          onDone: "#checkLocalKeys",
        },
      },
      checkLocalKeys: {
        id: "checkLocalKeys",
        entry: () => console.log("connectSafe2/checkLocalKeys/entry"),
        //always: "#seedPhrase",
        always: [
          {
            cond: (context) => {
              const availableKeys = Object.values(context.data.availableKeys);
              return availableKeys.filter((o) => o.isOwner && o.encryptedPrivateKey)
                .length > 0;
            },
            target: "#unlockKeyPin",
          },
          {
            cond: (context) => {
              const availableKeys = Object.values(context.data.availableKeys);
              return availableKeys.filter((o) => o.isOwner && o.encryptedPrivateKey)
                .length == 0;
            },
            target: "#seedPhrase",
          },
        ],
      },
      unlockKeyPin: prompt<ConnectSafeContext, any>({
        id: "unlockKeyPin",
        field: "unlockKeyPin",
        component: PinInputEditor,
        isSensitive: true,
        params: (context) => {
          const eoa = Object.values(context.data.availableKeys).filter(
            (o) => o.isOwner && o.encryptedPrivateKey
          )[0];
          return {
            view: editorContent.unlockPin,
            label: window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.unlockKeyPin.label", { values: { eoaName: eoa.name}}),
            submitButtonText: window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.unlockKeyPin.submitButtonText"),
          };
        },
        dataSchema: yup.string().required(window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.unlockKeyPin.dataSchema")),
        navigation: {
          next: "#unlockKey",
        },
      }),
      unlockKey: {
        id: "unlockKey",
        invoke: {
          src: async (context) => {
            const key = Object.values(context.data.availableKeys).filter(
              (o) => o.isOwner && o.encryptedPrivateKey
            )[0];
            if (!key) throw new Error(window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.unlockKey.errors.wtf"));

            const km = new KeyManager(context.data.safeAddress);
            await km.load();
            const decryptedKey = await km.getKey(
              key.address,
              context.data.unlockKeyPin
            );

            if (!decryptedKey) {
              throw new Error(window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.unlockKey.errors.wrongPin"));
            }

            sessionStorage.setItem("circlesKey", decryptedKey);
          },
          onDone: "#checkSafeAddress",
        },
      },
      seedPhrase: prompt<ConnectSafeContext, any>({
        field: "seedPhrase",
        component: TextareaEditor,
        isSensitive: true,
        params: {
          view: editorContent.seedPhrase,
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
              ] = window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.checkSeedphrase.contextMessage1");
              throw e;
            }

            try {
              account = Utilities.addressFromPrivateKey(keyFromMnemonic);
            } catch (e) {
              context.messages[
                "seedPhrase"
              ] = window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.checkSeedphrase.contextMessage2");
              throw e;
            }

            if (!context.data.safeAddress) {
              // If the flow was initialized without safe-address ..
              const graph =
                await window.o.theGraphClient.client.subscribeToResult();
              const foundSafes = await graph.query({
                query: gql`
                  query user($id: String!) {
                    user(id: $id) {
                      id
                      safeAddresses
                    }
                  }
                `,
                variables: {
                  id: account.toLowerCase(),
                },
              });

              if (foundSafes.errors && foundSafes.errors.length) {
                const msg = window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.checkSeedphrase.contextMessage3", { values: { error: JSON.stringify(foundSafes.errors)}});
                context.messages["seedPhrase"] = msg;
                throw new Error(msg);
              }

              context.data.foundSafeAddresses =
                foundSafes.data.user?.safeAddresses ?? [];
              if (!context.data.foundSafeAddresses.length) {
                const msg = window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.checkSeedphrase.contextMessage4", { values: { accountAddress: account}});
                context.messages["seedPhrase"] = msg;
                throw new Error(msg);
              }
            }

            localStorage.setItem("circlesAccount", account);

            context.data.accountAddress = account;
            context.data.privateKey = keyFromMnemonic;

            const km = new KeyManager(context.data.safeAddress);
            await km.load();
            // await km.setKey(account, "123456", keyFromMnemonic);
          },
          onDone: [
            {
              cond: (context) =>
                (context.messages["seedPhrase"]?.trim() ?? "") !== "",
              target: "#seedPhrase",
            },
            {
              cond: (context) => context.data.foundSafeAddresses?.length > 1,
              target: "#safeAddress",
            },
            {
              cond: (context) => context.data.foundSafeAddresses?.length == 1,
              actions: (context) =>
                (context.data.safeAddress = context.data.foundSafeAddresses[0]),
              target: "#checkSafeAddress",
            },
            {
              target: "#checkSafeAddress",
            },
          ],
          onError: "#seedPhrase",
        },
      },
      safeAddress: prompt({
        field: "safeAddress",
        component: DropdownSelectEditor,
        params: <DropdownSelectorParams<ConnectSafeContext, string, string>>{
          label: window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.safeAddress.label"),
          placeholder: window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.safeAddress.placeholder"),
          submitButtonText: window.o.i18n("dapps.o-passport.processes.identify.connectSafe.connectSafe2.safeAddress.submitButtonText"),
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
            context.messages["safeAddress"] = ``;
            context.data.safeAddress = context.data.safeAddress?.trim();

            const circlesSafe = new CirclesSafe(context.data.safeAddress, DefaultExecutionContext.fromKey(context.data.privateKey));
            context.data.safeOwners = await circlesSafe.getOwners();

            return true;
          },
          onDone: "#success",
          onError: "#safeAddress",
        },
      },
      success: {
        id: "success",
        type: "final",
        data: (context) => {
          return context.data;
        },
      },
    },
  });

export const connectSafe: ProcessDefinition<void, ConnectSafeContextData> = {
  name: "connectSafe",
  stateMachine: <any>processDefinition,
};
