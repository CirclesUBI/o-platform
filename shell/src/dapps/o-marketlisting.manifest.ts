import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { ContactsDappState } from "./o-contacts.manifest";
import Marketlisting from "./o-marketlisting/pages/Marketlisting.svelte";
import MarketlistingDetail from "./o-marketlisting/pages/MarketlistingDetail.svelte";
import Favorites from "./o-marketlisting/pages/Favorites.svelte";
import ListComponent from "../shared/molecules/NextNav/Components/List.svelte";
import { Link } from "@o-platform/o-interfaces/dist/routables/link";

const externalChat: Link<any, DappState> = {
  type: "link",
  title: "common.support",
  icon: "support",
  routeParts: ["=chat"],
  openInNewTab: true,
  url: () => "https://api.whatsapp.com/send?phone=6281381556669",
};

const listing: Page<any, ContactsDappState> = {
  routeParts: ["=listing"],
  component: Marketlisting,
  title: "Market",
  icon: "marketlisting",
  type: "page",
  navigation: {
    leftSlot: {
      component: ListComponent,
      props: {
        icon: "marketlisting",
        backgroundColorClass: "market",
      },
    },
  },
  position: "main",
};

const favorites: Page<any, ContactsDappState> = {
  routeParts: ["=favorites"],
  component: Favorites,
  title: "Favorites",
  type: "page",
  position: "main",
  icon: "favorite",
  navigation: {
    leftSlot: {
      component: ListComponent,
      props: {
        icon: "marketlisting",
        backgroundColorClass: "market",
      },
    },
  },
};

const detailPage: Page<any, ContactsDappState> = {
  routeParts: ["=detail", ":circlesAddress"],
  component: MarketlistingDetail,
  title: "detail",
  isSystem: true,
  type: "page",
  position: "modal",
};

export interface DappState {
  // put state here
}

export const marketlisting: DappManifest<DappState> = {
  type: "dapp",
  dappId: "market:1",
  icon: "check",
  title: "Market",
  routeParts: ["market"],
  defaultRoute: ["listing"],
  tag: Promise.resolve("alpha"),
  navigation: {
    leftSlot: {
      component: ListComponent,
      props: {
        icon: "marketlisting",
        backgroundColorClass: "market",
      },
    },
  },
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: listing,
      cancelDependencyLoading: false,
    };
  },
  routables: [listing, detailPage, favorites, externalChat],
};
