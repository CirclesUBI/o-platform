import { Subscription } from "rxjs";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Profile } from "../../shared/api/data/types";

let profile: Profile | undefined;
let shellEventSubscription: Subscription | undefined;

export async function init() {
  if (shellEventSubscription) {
    shellEventSubscription.unsubscribe();
  }

  shellEventSubscription = window.o.events.subscribe(
    async (
      event: PlatformEvent & {
        profile: Profile;
      }
    ) => {
      if (event.type == "shell.loggedOut") {
        localStorage.removeItem("safe");
        localStorage.removeItem("circlesAddress");
        localStorage.removeItem("circlesKey");
        localStorage.removeItem("lastUBI");
        profile = null;
        return;
      }
    }
  );

  return function stop() {
    shellEventSubscription.unsubscribe();
  };
}
