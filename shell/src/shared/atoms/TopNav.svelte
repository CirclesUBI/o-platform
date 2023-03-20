<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { me } from "../stores/me";
import { Profile } from "../api/data/types";
import { push } from "svelte-spa-router";

import { SvelteToast } from "../molecules/Toast";

import { setupI18n, isLocaleLoaded, locale } from "src/i18n/i18nDictionary";

import LocaleSwitcher from "src/i18n/atoms/LocaleSwitcher.svelte";
import { Environment } from "../environment";

$: if (!$isLocaleLoaded) {
  setupI18n({ withLocale: Environment.userLanguage.slice(0, 2) });
}

export let runtimeDapp: RuntimeDapp<any>;
let profile: Profile;
let showSwitcher = true;
let cleanRoute = "";
let dappHomeLink = "/#/home";

$: name = profile?.circlesAddress ? profile.circlesAddress : "";
$: {
  if ($me) {
    profile = $me;
  } else {
    profile = undefined;
  }
}

if (runtimeDapp.routeParts.length && runtimeDapp.routeParts[0]) {
  cleanRoute = runtimeDapp.routeParts[0].replace("=", "");

  if (runtimeDapp.defaultRoute[0] && runtimeDapp.routables[0].routeParts[0]) {
    dappHomeLink = `/#/${cleanRoute}/${runtimeDapp.routables[0].routeParts[0].replace("=", "")}`;
  }
}
</script>

{#if $isLocaleLoaded}
  <!-- bg-home bg-cpurple bg-marketplace bg-contact bg-passport -->
  <div class="fixed top-0 left-0 z-50 w-full">
    <SvelteToast />
    <div class="flex flex-row justify-between w-full text-white navbar">
      <div class="p-1 xs:p-3 pr-6 xs:pr-12 -mt-8 xs:-mt-2 whitespace-nowrap {cleanRoute ? 'bg-' + cleanRoute : 'bg-cpurple'} navbarHomeElement">
        <img src="/logos/circles.svg" class="w-6 h-6 xs:w-8 xs:h-8" alt="Circles Land" />

        <span class="ml-2 text-xl text-white uppercase xs:text-4xl font-heading ">
          <a href="{dappHomeLink}" alt="{cleanRoute}" class="cursor-pointer">
            {@html runtimeDapp ? runtimeDapp.title : "<<No dapp>>"}
          </a>
        </span>
      </div>

      <div class="self-center pr-1 ">
        <LocaleSwitcher value="{$locale}" on:locale-changed="{(e) => setupI18n({ withLocale: e.detail })}" />

        <span
          class="p-1 -mt-6 text-2xl uppercase xs:p-3 xs:-mt-2 whitespace-nowrap font-heading xs:text-4xl"
          class:text-white="{cleanRoute != 'home'}"
          class:text-passport="{cleanRoute === 'home' || cleanRoute === 'contacts'}">Beta</span>
        <!-- {#if runtimeDapp && runtimeDapp.dappId !== "homepage:1" && !runtimeDapp.anonymous}
        <div class="relative mr-4 cursor-pointer justify-self-center" on:click="{() => push(`#/marketplace/cart`)}">
          {#if $cartContents && $cartContents.length > 0}
            <div class="absolute left-0 w-full text-center text-secondary -top-4 font-heading">
              {$cartContents.length}
            </div>
          {/if}
          <Icons icon="shopping-cart" class="w-6 h-6 heroicon smallicon" />
        </div>
      {/if}
      {#if profile}
        {#if profile.__typename === "Organisation"}
          <div class="mr-4 text-white cursor-pointer" on:click="{() => push(`#/marketplace/scan-purchase`)}">
            <Icons icon="qrcode" customClass="w-6 h-6 heroicon smallicon" />
          </div>
        {/if}
      {/if} -->
      </div>
    </div>
  </div>
{/if}
