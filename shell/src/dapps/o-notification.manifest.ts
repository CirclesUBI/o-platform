import Home from "./o-notifications/pages/Home.svelte"
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { me } from "../shared/stores/me";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { init } from "./o-banking/init";
import { Profile } from "../shared/api/data/types";

export class NotificationDappState {
}

export const index: Page<any, NotificationDappState> = {
  type: "page",
  position: "main",
  routeParts: [],
  title: "Notifications",
  component: Home,
};

export const notifications: DappManifest<NotificationDappState> = {
  type: "dapp",
  dappId: "notifications:1",
  isSingleton: true,
  icon: "group",
  title: "Notifications",
  routeParts: ["notifications"],
  defaultRoute: [],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    const myProfileResult = await new Promise<Profile>((resolve) => {
      const unsub = me.subscribe((myProfile) => {
        resolve(myProfile);
      });
      unsub();
    });

    if (myProfileResult) {
      await init();
    }

    return {
      initialRoutable: notifications,
      cancelDependencyLoading: false,
    };
  },
  routables: [index],
};
