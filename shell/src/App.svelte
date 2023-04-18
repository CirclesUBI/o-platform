<script context="module" lang="ts">
import { FollowTrust } from "./shared/followTrust";

const followTrust: FollowTrust = new FollowTrust();
followTrust.start();

export const FollowTrustWorker = followTrust;
followTrust;
</script>

<script lang="ts">
import "./shared/css/tailwind.css";

import Router from "svelte-spa-router";

import DappFrame from "src/shared/molecules/DappFrame.svelte";
import NotFound from "src/shared/pages/NotFound.svelte";
import { interpret } from "xstate";
import { initMachine } from "./dapps/o-onboarding/processes/init";
import { ubiMachine } from "./shared/ubiTimer2";
import { InitContext } from "./dapps/o-onboarding/processes/initContext";
import { LogoutDocument } from "./shared/api/data/types";
import { me } from "./shared/stores/me";
import { setupI18n, isLocaleLoaded, locale, _ } from "./i18n/i18nDictionary";

import { Environment } from "./shared/environment";
import LocaleSwitcher from "./i18n/atoms/LocaleSwitcher.svelte";
import { onMount } from "svelte";
import InApp from "detect-inapp";
import { showToast } from "./shared/toast";

const inapp = new InApp(navigator.userAgent);

let isLoading: boolean = true;

onMount(async () => {
  if (inapp.isInApp) {
    showToast("error", `${$_("common.inAppError")}`);
  }

  const foo = await setupI18n({ withLocale: Environment.userLanguage.slice(0, 2) });
  isLoading = false;
});

let ubiMachineInterpreter: any;
const v = 1;
const currentLocalStorageSchemaVersion = localStorage.getItem("localStorageSchemaVersion");
if (!currentLocalStorageSchemaVersion || parseInt(currentLocalStorageSchemaVersion) < v) {
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem("localStorageSchemaVersion", v.toString());

  window.o.apiClient.client.subscribeToResult().then((apiClient) => {
    apiClient.mutate({
      mutation: LogoutDocument,
    });
  });
}

window.runInitMachine = (context?: InitContext) => {
  if (context) {
    interpret(initMachine.withContext(context)).start();
  } else {
    interpret(initMachine).start();
  }
};
let _routes = {
  "/:dappId?/:1?/:2?/:3?/:4?/:5?/:6?": DappFrame,
  "*": NotFound,
};
</script>

{#if !isLoading}
  <Router
    routes="{_routes}"
    on:routeLoaded="{(e) => {
      window.o.posthog?.capture('routeLoaded', {
        route: e.detail.route,
      });
      if (!ubiMachineInterpreter && $me && $me.circlesAddress) {
        ubiMachineInterpreter = interpret(ubiMachine)
          .onEvent((event) => {
            console.log('UBI machine event:', event);
          })
          .onTransition((state) => {
            console.log('UBI machine transition:', state.value);
          })
          .start();
      }
    }}" />
{:else}
  <p>Loading...</p>
{/if}
