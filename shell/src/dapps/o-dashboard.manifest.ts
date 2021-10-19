import Home from "./o-dashboard/pages/Home.svelte";
import Invites from "./o-dashboard/pages/Invites.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { Link } from "@o-platform/o-interfaces/dist/routables/link";

import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

const index: Page<any, DappState> = {
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "Dashboard",
  type: "page",
};
const invites: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=invites"],
  component: Invites,
  title: "Invites",
  position: "modal",
  type: "page",
};

const externalChat: Link<any, DappState> = {
  type: "link",
  title: "Chat",
  icon: "chat",
  routeParts: ["=chat"],
  openInNewTab: true,
  url: () => "https://discord.gg/CS6xq7jECR",
};
const externalForum: Link<any, DappState> = {
  type: "link",
  title: "Forum",
  icon: "forum",
  routeParts: ["=forum"],
  openInNewTab: true,
  url: () => "https://aboutcircles.com",
};
const login: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=login"],
  component: Home,
  title: "Circles Land",
  type: "page",
};

const externalBlog: Link<any, DappState> = {
  type: "link",
  title: "Blog",
  icon: "blog",
  routeParts: ["=blog"],
  openInNewTab: true,
  url: () => "https://blog.circles.land/",
};

const externalWhitepaper: Link<any, DappState> = {
  type: "link",
  title: "Whitepaper",
  icon: "whitepaper",
  routeParts: ["=whitepaper"],
  openInNewTab: true,
  url: () => "https://blog.circles.land/whitepaper/",
};

export interface DappState {
  // put state here
}

export const dashboard: DappManifest<DappState> = {
  type: "dapp",
  dappId: "dashboard:1",
  isSingleton: true,
  isHidden: true,
  icon: "dashboard",
  title: "Dashboard",
  routeParts: ["=dashboard"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: true,

  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [
    index,
    invites,
    externalChat,
    externalForum,
    externalBlog,
    externalWhitepaper,
  ],
};
