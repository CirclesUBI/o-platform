import Home from "./o-dashboard/pages/Home.svelte";
import SharePersonalInvite from "./o-dashboard/pages/SharePersonalInvite.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { Link } from "@o-platform/o-interfaces/dist/routables/link";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

const index: Page<any, DappState> = {
  isSystem: false,
  routeParts: [],
  component: Home,
  title: "common.home",
  type: "page",
};

const sharePersonalInvite: Page<any, DappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: ["=share"],
  title: "Share Profile",
  component: SharePersonalInvite,
};

const externalChat: Link<any, DappState> = {
  type: "link",
  title: "common.support",
  icon: "chat",
  routeParts: [],
  openInNewTab: true,
  url: () => window.o.i18n("common.supportUrl"),
};
const externalForum: Link<any, DappState> = {
  type: "link",
  title: "common.forum",
  icon: "forum",
  routeParts: [],
  openInNewTab: true,
  url: () => "https://aboutcircles.com/c/earth-circle-dao/13",
};

export interface DappState {
  // put state here
}

export const home: DappManifest<DappState> = {
  type: "dapp",
  dappId: "home:1",
  isSingleton: true,
  isHidden: true,
  icon: "dashboard",
  title: "Circlesland",
  routeParts: ["home"],
  defaultRoute: [""],
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
  routables: [index, sharePersonalInvite, externalChat, externalForum],
};
