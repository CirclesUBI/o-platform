import Home from "./o-notifications/pages/Home.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import Trusts from "./o-notifications/pages/Trusts.svelte";
import Transactions from "./o-notifications/pages/Transactions.svelte";
import RedeemedInvitations from "./o-notifications/pages/RedeemedInvitations.svelte";
import { Link } from "@o-platform/o-interfaces/dist/routables/link";
import ListComponent from "../shared/molecules/NextNav/Components/List.svelte";
import { DappState } from "./o-passport.manifest";

export class NotificationDappState {}

const externalChat: Link<any, DappState> = {
  type: "link",
  title: "common.support",
  icon: "whatsapp",
  routeParts: ["=chat"],
  openInNewTab: true,
  url: () => "https://wa.me/6281337303696",
};

export const index: Page<any, NotificationDappState> = {
  type: "page",
  position: "main",
  routeParts: ["=all"],
  title: "common.all",
  icon: "allnotificationbubble",
  navigation: {
    leftSlot: {
      component: ListComponent,
      props: {
        icon: "bell",
        backgroundColorClass: "notifications",
        // action: () => processNavigation.back(),
      },
    },
  },
  component: Home,
};
export const trusts: Page<any, NotificationDappState> = {
  type: "page",
  position: "main",
  routeParts: ["=trusts"],
  icon: "trust",
  title: "common.trustEvents",
  component: Trusts,
};
export const transactions: Page<any, NotificationDappState> = {
  type: "page",
  position: "main",
  routeParts: ["=transactions"],
  title: "common.transactions",
  icon: "transactions",
  component: Transactions,
};
export const redeemedInvitations: Page<any, NotificationDappState> = {
  type: "page",
  position: "main",
  routeParts: ["=invitations"],
  title: "common.invitations",
  icon: "invitations",
  component: RedeemedInvitations,
};

export const notifications: DappManifest<NotificationDappState> = {
  type: "dapp",
  dappId: "notifications:1",
  icon: "group",
  title: "common.notifications",
  routeParts: ["=notifications"],
  defaultRoute: ["all"],
  tag: Promise.resolve("alpha"),
  routables: [index, transactions, trusts, redeemedInvitations, externalChat],
};
