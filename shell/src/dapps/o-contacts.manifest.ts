import ContactsView from "./o-contacts/pages/Contacts.svelte";
import ProfilePage from "./o-contacts/pages/Profile.svelte";
import ScanToTrust from "./o-contacts/pages/ScanToTrust.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { me } from "../shared/stores/me";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { init } from "./o-banking/init";
import { Jumplist, JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { Contact, ContactDirection, EventType, Profile, ProfileOrigin, ProfileType } from "../shared/api/data/types";
import { transfer } from "./o-banking/processes/transfer";
import { push } from "svelte-spa-router";
import { setTrust } from "./o-banking/processes/setTrust";
import { contacts as contactStore } from "../shared/stores/contacts";
import { Environment } from "../shared/environment";
import ListComponent from "../shared/molecules/NextNav/Components/List.svelte";
import { Link } from "@o-platform/o-interfaces/dist/routables/link";
export interface DappState {
  // put state here
}

const externalChat: Link<any, DappState> = {
  type: "link",
  title: "common.support",
  icon: "whatsapp",
  routeParts: ["=chat"],
  openInNewTab: true,
  url: () => "https://wa.me/6281337303696",
};

const index: Page<any, DappState> = {
  routeParts: [],
  component: ContactsView,
  title: "dapps.o-dashboard.pages.home.contacts",
  icon: "friends",
  type: "page",
  navigation: {
    leftSlot: {
      component: ListComponent,
      props: {
        icon: "dashfriends",
        backgroundColorClass: "contacts",
        // action: () => processNavigation.back(),
      },
    },
  },
};

export class ContactsDappState {
  /**
   * The currently displayed profile (e.g. in the profile detail)
   */
  currentProfileId?: number;
  /**
   * The address of the currently displayed safe (e.g. in the profile detail)
   */
  currentSafeAddress?: string;

  trusted?: boolean;
}

async function findContactActions(circlesAddress: string) {
  const recipientProfile: Contact = await contactStore.findBySafeAddress(circlesAddress);
  if (!recipientProfile) {
    return [];
  }

  const trustMetadata = recipientProfile.metadata.find((o) => o.name == EventType.CrcTrust);

  const inTrustIndex = trustMetadata.directions.indexOf(ContactDirection.In);
  const trustsYou = inTrustIndex > -1 ? parseInt(trustMetadata.values[inTrustIndex]) > 0 : false;

  const outTrustIndex = trustMetadata.directions.indexOf(ContactDirection.Out);
  const youTrust = outTrustIndex > -1 ? parseInt(trustMetadata.values[outTrustIndex]) > 0 : false;

  const availableActions: JumplistItem[] = [];

  if (trustsYou) {
    // I can send circles to people who trust me
    availableActions.push({
      key: "sendCircles",
      title: window.o.i18n("dapps.common.quickactions.sendMoney"),
      icon: "sendmoney",
      action: () => { },
    });
  }
}

const profileJumplist: Jumplist<any, ContactsDappState> = {
  type: "jumplist",
  title: "Actions",
  isSystem: false,
  routeParts: ["=actions"],
  items: async (params, runtimeDapp) => {
    let $me: Profile = null;
    me.subscribe((e) => ($me = e))();

    let actions = [];

    if (params.id) {
      const recipientProfile: Contact = await contactStore.findBySafeAddress(params.id ?? $me.circlesAddress);
      const trustMetadata = recipientProfile?.metadata.find((o) => o.name == EventType.CrcTrust) ?? undefined;
      let trustsYou = false;
      let youTrust = false;

      if (trustMetadata) {
        const inTrust = trustMetadata.directions.indexOf(ContactDirection.In);
        if (inTrust > -1) {
          const trustLimit = trustMetadata.values[inTrust];
          trustsYou = parseInt(trustLimit) > 0;
        }
        const outTrust = trustMetadata.directions.indexOf(ContactDirection.Out);
        if (outTrust > -1) {
          const trustLimit = trustMetadata.values[outTrust];
          youTrust = parseInt(trustLimit) > 0;
        }
      }

      if (recipientProfile?.contactAddress) {
        if (recipientProfile.contactAddress_Profile && recipientProfile.contactAddress_Profile.type == ProfileType.Person) {
          actions = actions.concat(
            trustsYou
              ? [
                {
                  category: "Banking",
                  key: "transfer",
                  icon: "sendmoney",
                  order: 3,
                  displayHint: "encouraged",
                  title: "dapps.common.quickactions.sendMoney",
                  action: async () => {
                    window.o.runProcess(transfer, {
                      safeAddress: $me.circlesAddress,
                      recipientAddress: recipientProfile.contactAddress,
                      privateKey: sessionStorage.getItem("circlesKey"),
                    });
                  },
                },
              ]
              : [],
            youTrust
              ? [
                {
                  category: "Contacts",
                  key: "setTrust",
                  icon: "minus-circle",
                  order: 4,
                  title: "dapps.common.quickactions.untrust",
                  displayHint: "discouraged",
                  colorClass: "text-alert",
                  action: async () => {
                    window.o.runProcess(setTrust, {
                      trustLimit: 0,
                      trustReceiver: recipientProfile.contactAddress,
                      safeAddress: $me.circlesAddress,
                      hubAddress: Environment.circlesHubAddress,
                      privateKey: sessionStorage.getItem("circlesKey"),
                    });
                  },
                },
              ]
              : [
                {
                  category: "Contacts",
                  key: "setTrust",
                  icon: "trust",
                  order: 4,
                  title: "dapps.common.quickactions.trust",
                  displayHint: "encouraged",
                  action: async () => {
                    window.o.runProcess(setTrust, {
                      trustLimit: 100,
                      trustReceiver: recipientProfile.contactAddress,
                      safeAddress: $me.circlesAddress,
                      hubAddress: Environment.circlesHubAddress,
                      privateKey: sessionStorage.getItem("circlesKey"),
                    });
                  },
                },
              ]
          );
        }
      }

      if (!recipientProfile) {
        actions = actions.concat({
          category: "Contacts",
          key: "setTrust",
          icon: "trust",
          order: 4,
          title: "dapps.common.quickactions.trust",
          displayHint: "encouraged",
          action: async () => {
            window.o.runProcess(setTrust, {
              trustLimit: 100,
              safeAddress: $me.circlesAddress,
              hubAddress: Environment.circlesHubAddress,
              privateKey: sessionStorage.getItem("circlesKey"),
            });
          },
        });
      }
    } else {
      actions = actions.concat({
        category: "Contacts",
        key: "setTrust",
        icon: "trust",
        order: 4,
        displayHint: "encouraged",
        title: "dapps.common.quickactions.trustNewFriend",
        action: async () => {
          window.o.runProcess(setTrust, {
            trustLimit: 100,
            safeAddress: $me.circlesAddress,
            hubAddress: Environment.circlesHubAddress,
            privateKey: sessionStorage.getItem("circlesKey"),
          });
        },
      });
      actions = actions.concat({
        category: "Contacts",
        key: "setTrust",
        icon: "qrcode",
        order: 5,
        title: "dapps.common.quickactions.scanToTrust",
        action: async () => {
          push("#/contacts/scanToTrust/");
        },
      });
    }

    return actions;
  },
};

export const profile: Page<any, ContactsDappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: ["=profile", ":id"],
  title: "Profile",
  component: ProfilePage,
};

export const scanToTrust: Page<any, ContactsDappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: ["=scanToTrust"],
  title: "Scan to trust",
  component: ScanToTrust,
};

export const contacts: DappManifest<DappState> = {
  type: "dapp",
  dappId: "contacts:1",
  icon: "group",
  title: "dapps.o-dashboard.pages.home.contacts",
  routeParts: ["contacts"],
  defaultRoute: [],
  tag: Promise.resolve("alpha"),
  jumplist: profileJumplist,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    const myProfileResult = await new Promise<Profile>((resolve) => {
      const unsub = me.subscribe((myProfile) => {
        resolve(myProfile);
      });
      unsub();
    });

    if (myProfileResult) {
      await init();
    }

    return {
      initialRoutable: contacts,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, profile, externalChat, scanToTrust],
};
