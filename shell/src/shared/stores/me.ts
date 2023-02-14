import { readable } from "svelte/store";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { InitDocument, InitQueryVariables, Profile, ProfileType, SessionInfo } from "../api/data/types";
import { Subscriber } from "svelte/types/runtime/store";
import { getSessionInfo } from "../../dapps/o-passport/processes/identify/services/getSessionInfo";
import { ApiClient } from "../apiConnection";

let sessionInfo: SessionInfo | undefined = undefined;

export const me = {
  subscribe: (subscriber: Subscriber<Profile | null>) => _me.subscribe(subscriber),
  getSessionInfo: async (reload: boolean = false) => {
    if (!sessionInfo || reload) {
      sessionInfo = await getSessionInfo();
    }
    return sessionInfo;
  },
  reload: async () => {
    const freshSessionInfo = await ApiClient.query<SessionInfo, InitQueryVariables>(InitDocument, {});
    if (freshSessionInfo.profile) {
      console.log("HERE WE ARE NOW", freshSessionInfo);

      window.o.publishEvent(<PlatformEvent>{
        type: "shell.authenticated",
        profile: freshSessionInfo.profile,
      });
    }

    return freshSessionInfo.profile;
  },
};
const _me = readable<Profile | null>(null, function start(set) {
  const subscription = window.o.events.subscribe(
    (
      event: PlatformEvent & {
        profile: Profile;
        sessionInfo: SessionInfo | undefined;
      }
    ) => {
      if (event.type == "shell.loggedOut") {
        const notMe = <Profile>{
          id: 0,
          circlesAddress: "",
          displayCurrency: "EURS",
          circlesSafeOwner: "",
          successorOfCirclesAddress: null,
          displayName: "",
          firstName: "",
          lastName: "",
          emailAddress: "",
          askedForEmailAddress: true,
          dream: null,
          country: null,
          avatarUrl: "",
          avatarCid: null,
          avatarMimeType: "image/jpeg",
          newsletter: true,
          displayTimeCircles: true,
          memberships: [],
          verifications: [],
          circlesTokenAddress: "",
          __typename: "Profile",
        };
        localStorage.setItem("me", JSON.stringify(notMe));
        set(notMe);
        return;
      }
      if (event.type == "shell.authenticated" && event.profile) {
        sessionInfo = event.sessionInfo;
        set(event.profile);
        console.log("me.ts new $me: ", event.profile);
        localStorage.setItem("me", JSON.stringify(event.profile));
      }
    }
  );

  const cachedProfile = localStorage.getItem("me");
  if (cachedProfile) {
    try {
      const profile = JSON.parse(cachedProfile);
      set(profile);
    } catch (e) {
      console.warn(`Parsing of the cached profile from localStorage(me) failed:`, e);
      localStorage.removeItem("me");
      localStorage.removeItem("safe");
    }
  }

  return function stop() {
    subscription.unsubscribe();
  };
});
