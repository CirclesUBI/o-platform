import Translations from "./o-translation/pages/Translations.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { ContactsDappState } from "./o-contacts.manifest";
import { Jumplist } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { Environment } from "../shared/environment";
import Marketlisting from "./o-marketlisting/pages/Marketlisting.svelte";
import MarketlistingDetail from "./o-marketlisting/pages/MarketlistingDetail.svelte";

const marketlistings: Page<any, ContactsDappState> = {
  routeParts: [],
  component: Marketlisting,
  title: "marketlisting",
  type: "page",
  position: "main"
};

const detailPage: Page<any, ContactsDappState> = {
  routeParts: [":id"],
  component: MarketlistingDetail,
  title: "detail",
  type: "page",
  position: "modal",
  isSystem: true
};


export interface DappState {
  // put state here
}

export const marketlisting: DappManifest<DappState> = {
  type: "dapp",
  dappId: "marketlisting:1",
  isSingleton: true,
  isHidden: false,
  icon: "check",
  title: "marketlisting",
  routeParts: ["=marketlisting"],
  defaultRoute: ["marketlisting"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: marketlistings,
      cancelDependencyLoading: false,
    };
  },
  routables: [marketlistings, detailPage],
};
