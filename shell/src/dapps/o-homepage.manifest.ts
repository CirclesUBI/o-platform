import Home from "./o-homepage/pages/Home.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { Link } from "@o-platform/o-interfaces/dist/routables/link";
import Terms from "./o-homepage/pages/Terms.svelte";
import Privacy from "./o-homepage/pages/Privacy.svelte";
import NotFound from "./o-homepage/pages/NotFound.svelte";
import ListComponent from "../shared/molecules/NextNav/Components/List.svelte";
import { logout } from "./o-passport/processes/logout";
import { push } from "svelte-spa-router";

const externalChat: Link<any, DappState> = {
  type: "link",
  title: "common.support",
  icon: "whatsapp",
  routeParts: ["=chat"],
  openInNewTab: true,
  url: () => "https://wa.me/6281337303696",
};
const externalForum: Link<any, DappState> = {
  type: "link",
  title: "common.forum",
  icon: "forum",
  routeParts: ["=forum"],
  openInNewTab: true,
  url: () => "https://aboutcircles.com/c/earth-circle-dao/13",
};
const login: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=login"],
  component: Home,
  title: "<span class='text-2xl sm:text-3xl'>CIRCLES</span><span class='text-xl sm:text-2xl'>UBI.ID</span>",
  type: "page",
};

const index: Page<any, DappState> = {
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "<span class='text-2xl sm:text-3xl'>CIRCLES</span><span class='text-xl sm:text-2xl'>UBI.ID</span>",
  icon: "homeSidemenu",
  type: "page",
  navigation: {
    rightSlot: {
      component: ListComponent,
      props: {
        icon: "exit",
        backgroundColorClass: "transparent",
        action: () => {
          push("#/passport/actions/logout");
        },
      },
    },
  },
};

const invite: Page<{ inviteCode: string }, DappState> = {
  isSystem: true,
  anonymous: true,
  routeParts: ["=invite", ":inviteCode"],
  component: Home,
  title: "<span class='text-2xl sm:text-3xl'>CIRCLES</span><span class='text-xl sm:text-2xl'>UBI.ID</span>",
  type: "page",
};

const terms: Page<any, DappState> = {
  type: "page",
  isSystem: true,
  anonymous: true,
  title: "common.termsOfService",
  routeParts: ["=terms"],
  icon: "forum",
  component: Terms,
};

const privacy: Page<any, DappState> = {
  type: "page",
  isSystem: true,
  anonymous: true,
  title: "common.privacyPolicy",
  routeParts: ["=privacy"],
  icon: "forum",
  component: Privacy,
};

const notFound: Page<any, DappState> = {
  type: "page",
  isSystem: true,
  anonymous: true,
  title: "notFound",
  routeParts: ["=notfound"],
  pageBackgroundClass: "bg-white",
  component: NotFound,
};

export interface DappState {
  // put state here
}

export const homepage: DappManifest<DappState> = {
  type: "dapp",
  dappId: "homepage:1",
  icon: "home",
  anonymous: true,
  title: "<span class='text-2xl sm:text-3xl'>CIRCLES</span><span class='text-xl sm:text-2xl'>UBI.ID</span>",
  routeParts: [],
  tag: Promise.resolve("alpha"),
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  hideFooterGradient: true,
  routables: [index, invite, login, terms, privacy, notFound],
};
