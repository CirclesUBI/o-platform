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
  icon: "homeSidemenu",
};

const sharePersonalInvite: Page<any, DappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: ["=share"],
  title: "common.shareProfile",
  component: SharePersonalInvite,
};

const externalChat: Link<any, DappState> = {
  type: "link",
  title: "common.support",
  icon: "whatsapp",
  routeParts: [],
  openInNewTab: true,
  url: () => "https://wa.me/6281337303696",
};

export interface DappState {
  // put state here
}

export const home: DappManifest<DappState> = {
  type: "dapp",
  dappId: "home:1",
  icon: "dashboard",
  title: "<span class='text-2xl sm:text-3xl'>CIRCLES</span><span class='text-xl sm:text-2xl'>UBI.ID</span>",
  routeParts: ["home"],
  defaultRoute: [""],
  tag: Promise.resolve("alpha"),
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, sharePersonalInvite, externalChat],
};
