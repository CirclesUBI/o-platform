import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { ContactsDappState } from "./o-contacts.manifest";
import Marketlisting from "./o-marketlisting/pages/Marketlisting.svelte";
import MarketlistingDetail from "./o-marketlisting/pages/MarketlistingDetail.svelte";

const listing: Page<any, ContactsDappState> = {
  routeParts: ["=listing"],
  component: Marketlisting,
  title: "Market",
  type: "page",
  position: "main"
};

const detailPage: Page<any, ContactsDappState> = {
  routeParts: ["=detail",":circlesAddress"],
  component: MarketlistingDetail,
  title: "detail",
  isSystem: true,
  type: "page",
  position: "modal"
};


export interface DappState {
  // put state here
}

export const marketlisting: DappManifest<DappState> = {
  type: "dapp",
  dappId: "market:1",
  isSingleton: true,
  isHidden: false,
  icon: "check",
  title: "Market",
  routeParts: ["market"],
  defaultRoute: ["listing"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: listing,
      cancelDependencyLoading: false,
    };
  },
  routables: [listing, detailPage],
};
