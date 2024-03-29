import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { ContactsDappState } from "./o-contacts.manifest";
import Marketlisting from "./o-marketlisting/pages/Marketlisting.svelte";
import MarketlistingDetail from "./o-marketlisting/pages/MarketlistingDetail.svelte";
import Favorites from "./o-marketlisting/pages/Favorites.svelte";
import ListComponent from "../shared/molecules/NextNav/Components/List.svelte";
import { Link } from "@o-platform/o-interfaces/dist/routables/link";
import MyStore from "./o-marketlisting/pages/MyStore.svelte";

const externalChat: Link<any, DappState> = {
  type: "link",
  title: "common.support",
  icon: "whatsapp",
  routeParts: ["=chat"],
  openInNewTab: true,
  url: () => "https://wa.me/6281337303696",
};

const listing: Page<any, ContactsDappState> = {
  routeParts: ["=listing"],
  component: Marketlisting,
  title: "dapps.o-dashboard.pages.home.marketlisting",
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
  title: "common.favorites",
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

const myStore: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=mystore", ":circlesAddress"],
  component: MyStore,
  title: "common.myStore",

  type: "page",
  navigation: {
    leftSlot: {
      component: ListComponent,
      props: {
        icon: "marketlisting",
        backgroundColorClass: "market",
        // action: () => processNavigation.back(),
      },
    },
  },
};

export interface DappState {
  // put state here
}

export const marketlisting: DappManifest<DappState> = {
  type: "dapp",
  dappId: "market:1",
  icon: "check",
  title: "dapps.o-dashboard.pages.home.marketlisting",
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
  routables: [listing, detailPage, favorites, externalChat, myStore],
};
