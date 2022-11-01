import Home from "./o-notifications/pages/Home.svelte"
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import Trusts from "./o-notifications/pages/Trusts.svelte";
import Transactions from "./o-notifications/pages/Transactions.svelte";
import RedeemedInvitations from "./o-notifications/pages/RedeemedInvitations.svelte";

export class NotificationDappState {
}

export const index: Page<any, NotificationDappState> = {
  type: "page",
  position: "main",
  routeParts: ["=all"],
  title: "All",
  component: Home,
};
export const trusts: Page<any, NotificationDappState> = {
  type: "page",
  position: "main",
  routeParts: ["=trusts"],
  title: "Trust events",
  component: Trusts,
};
export const transactions: Page<any, NotificationDappState> = {
  type: "page",
  position: "main",
  routeParts: ["=transactions"],
  title: "Transactions",
  component: Transactions,
};
export const redeemedInvitations: Page<any, NotificationDappState> = {
  type: "page",
  position: "main",
  routeParts: ["=invitations"],
  title: "Invitations",
  component: RedeemedInvitations,
};

export const notifications: DappManifest<NotificationDappState> = {
  type: "dapp",
  dappId: "notifications:1",
  isSingleton: true,
  icon: "group",
  title: "Notifications",
  routeParts: [],
  defaultRoute: ["all"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: true,
  routables: [index, transactions, trusts, redeemedInvitations],
};
