import Home from "./o-passport/pages/Home.svelte";
import Account from "./o-passport/pages/Account.svelte";
import VerifyEmail from "./o-passport/pages/VerifyEmail.svelte";
import ListComponent from "../shared/molecules/NextNav/Components/List.svelte";
// import Settings from "./o-passport/pages/Settings.svelte";
import { logout } from "./o-passport/processes/logout";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { Trigger } from "@o-platform/o-interfaces/dist/routables/trigger";
import { loadProfile } from "./o-passport/processes/identify/services/loadProfile";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { AvataarGenerator } from "../shared/avataarGenerator";
import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { Profile } from "../shared/api/data/types";
import UpsertOrganization from "./o-passport/pages/UpsertBusiness.svelte";
import { Link } from "@o-platform/o-interfaces/dist/routables/link";

const externalChat: Link<any, DappState> = {
  type: "link",
  title: "common.support",
  icon: "support",
  routeParts: ["=chat"],
  openInNewTab: true,
  url: () => "https://api.whatsapp.com/send?phone=6281381556669",
};

const index: Page<any, DappState> = {
  routeParts: ["=profile"],
  component: Home,
  title: "common.profile",
  icon: "myProfile",
  type: "page",
  navigation: {
    leftSlot: {
      component: ListComponent,
      props: {
        icon: "accounts",
        backgroundColorClass: "passport",
        // action: () => processNavigation.back(),
      },
    },
  },
};

const verifyEmail: Page<any, DappState> = {
  isSystem: true,
  anonymous: true,
  routeParts: ["=verifyEmail", "verify", ":secret"],
  component: VerifyEmail,
  title: "Email address",
  type: "page",
};

const profile: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=profile", ":profileId"],
  component: Home,
  title: "Profile",

  type: "page",
  navigation: {
    leftSlot: {
      component: ListComponent,
      props: {
        icon: "passport",
        backgroundColorClass: "passport",
        // action: () => processNavigation.back(),
      },
    },
  },
};

const newOrganization: Page<any, DappState> = {
  isSystem: false,
  routeParts: ["=new-organization"],
  component: UpsertOrganization,
  title: "Create Shop",

  type: "page",
  navigation: {
    leftSlot: {
      component: ListComponent,
      props: {
        icon: "passport",
        backgroundColorClass: "passport",
        // action: () => processNavigation.back(),
      },
    },
  },
};

const editOrganization: Page<any, DappState> = {
  isSystem: false,
  routeParts: ["=edit-organization", ":circlesAddress"],
  component: UpsertOrganization,
  title: "Shop 1",

  type: "page",
  navigation: {
    leftSlot: {
      component: ListComponent,
      props: {
        icon: "passport",
        backgroundColorClass: "passport",
        // action: () => processNavigation.back(),
      },
    },
  },
};

const account: Page<any, DappState> = {
  routeParts: ["=accounts"],
  component: Account,
  title: "common.accounts",
  icon: "accounts",
  type: "page",
  navigation: {
    leftSlot: {
      component: ListComponent,
      props: {
        icon: "accounts",
        backgroundColorClass: "passport",
        // action: () => processNavigation.back(),
      },
    },
  },
};

// const settings: Page<any, DappState> = {
//   routeParts: ["=settings"],
//   component: Settings,
//   title: "common.settings",
//   icon: "settings",
//   type: "page",
//   navigation: {
//     leftSlot: {
//       component: ListComponent,
//       props: {
//         icon: "accounts",
//         backgroundColorClass: "passport",
//         // action: () => processNavigation.back(),
//       },
//     },
//   },
// };

const logmeout: Trigger<{}, DappState> = {
  isSystem: true,
  anonymous: true,
  routeParts: ["=actions", "=logout"],
  title: window.o.i18n("dapps.common.quickactions.logout"),
  type: "trigger",
  action: async (params) => {
    window.o.runProcess(logout, {});
  },
};

const logmein: Trigger<{}, DappState> = {
  isSystem: true,
  anonymous: true,
  routeParts: ["=actions", "=login", ":keyId"],
  title: "Log in",
  type: "trigger",
  action: async (params: any) => {
    (<any>window).runInitMachine({
      useMockProfileIndex: parseInt(params.keyId),
    });
    /*
    window.o.runProcess(loginWithTorus, {
      useMockProfileIndex: parseInt(params.keyId),
      successAction: () => (<any>window).runInitMachine()
    });
    */
  },
};

export interface DappState {
  // put state here
}

let myProfile: Profile = null;

export const passport: DappManifest<DappState> = {
  type: "dapp",
  dappId: "passport:1",
  title: "Passport",
  icon: "passport",
  routeParts: ["=passport"],
  defaultRoute: ["passport"],
  tag: Promise.resolve("alpha"),
  jumplist: {
    type: "jumplist",
    title: "Actions",
    isSystem: false,
    routeParts: ["=actions"],
    items: async () => {
      let jumplistitems = [
        // <JumplistItem>{
        //   category: "Passport",
        //   key: "lock",
        //   type: "action",
        //   title: "Lock",
        //   icon: "logout",
        //   action: () => {
        //     sessionStorage.removeItem("circlesKey");
        //     sessionStorage.removeItem("keyCache");
        //     push("/").then(() => {
        //       location.reload();
        //     });
        //   },
        // },
        <JumplistItem>{
          category: "Passport",
          key: "logout",
          type: "profile",
          title: window.o.i18n("dapps.common.quickactions.logout"),
          icon: "logout",
          action: () => {
            window.o.runProcess(logout, {});
          },
        },
      ];

      if (!myProfile) {
        myProfile = await loadProfile();
      }

      const myMemberships =
        myProfile.memberships && myProfile.memberships.length > 0
          ? myProfile.memberships.map((o) => o.organisation)
          : [];

      const profileItems = <any>[myProfile, ...myMemberships].map((o) => {
        return <JumplistItem>{
          category: "Passport",
          key: o.circlesAddress,
          title: o.displayName,
          type: "profile",
          icon: o.avatarUrl ? o.avatarUrl : AvataarGenerator.generate(o.circlesAddress),
          action: () => {
            window.o.publishEvent(<PlatformEvent>{
              type: "shell.loggedOut",
            });
            window.o.publishEvent(<PlatformEvent>{
              type: "shell.authenticated",
              profile: o,
            });
            localStorage.removeItem("editShopIndex");
            location.reload();
            /*window.o.publishEvent(<PlatformEvent>{
              type: "shell.closeModal"
            });*/
          },
        };
      });

      return [...profileItems, ...jumplistitems];
    },
  },
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, profile, account, externalChat, verifyEmail, logmeout, logmein, newOrganization, editOrganization],
};
