<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { me } from "../stores/me";
import { Profile } from "../api/data/types";
import { SvelteToast } from "../molecules/Toast";
import { setupI18n, isLocaleLoaded, locale } from "../../i18n/i18nDictionary";
import LocaleSwitcher from "../../i18n/atoms/LocaleSwitcher.svelte";
import { Environment } from "../environment";
import Label from "./Label.svelte";

$: if (!$isLocaleLoaded) {
  setupI18n({ withLocale: Environment.userLanguage.slice(0, 2) });
}

export let runtimeDapp: RuntimeDapp<any>;
let profile: Profile;
let cleanRoute = "";
let dappHomeLink = "/#/home";
let textColor = "text-white";

$: {
  if ($me) {
    profile = $me;
  } else {
    profile = undefined;
  }
}

console.log("Cleanroute:", runtimeDapp);
if (runtimeDapp.routeParts.length && runtimeDapp.routeParts[0]) {
  cleanRoute = runtimeDapp.routeParts[0].replace("=", "");
  textColor = `text-${cleanRoute}-contrast`;

  if (runtimeDapp.defaultRoute[0] && runtimeDapp.routables[0].routeParts[0]) {
    dappHomeLink = `/#/${cleanRoute}/${runtimeDapp.routables[0].routeParts[0].replace("=", "")}`;
  }
}
</script>

{#if $isLocaleLoaded}
  <!-- tailwind makes this necessary, otherwise the classes won't load correctly -->
  <!-- bg-home bg-cpurple bg-marketplace bg-contact bg-passport text-home-contrast text-survey-contrast text-banking-contrast text-passport-contrast text-marketplace-contrast text-notifications-contrast -->
  <div class="fixed top-0 left-0 z-50 w-full">
    <SvelteToast />
    <div class="flex flex-row justify-between w-full {textColor} navbar">
      <div class="p-1 xs:p-3 pr-6 xs:pr-12 -mt-8 xs:-mt-2 whitespace-nowrap {cleanRoute ? 'bg-' + cleanRoute : 'bg-cpurple'} navbarHomeElement">
        <img src="/logos/circles.svg" class="w-6 h-6 xs:w-8 xs:h-8" alt="Circles Land" />

        <span class="ml-2 text-xl text-white uppercase xs:text-4xl font-heading">
          {#if runtimeDapp}
            <a href="{dappHomeLink}" class="cursor-pointer">
              <Label key="{runtimeDapp.title}" />
            </a>
          {/if}
        </span>
      </div>

      <div class="self-center pr-3">
        <LocaleSwitcher value="{$locale}" on:locale-changed="{(e) => setupI18n({ withLocale: e.detail })}" />
        <span class="p-1 -mt-6 text-2xl uppercase xs:p-3 xs:-mt-2 whitespace-nowrap font-heading xs:text-4xl">Beta</span>
      </div>
    </div>
  </div>
{/if}
