<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { me } from "../stores/me";
import { Profile } from "../api/data/types";
import { push } from "svelte-spa-router";
import Icons from "../../../shell/src/shared/molecules/Icons.svelte";
import LangSwitcher from "./LangSwitcher.svelte";
export let runtimeDapp: RuntimeDapp<any>;
let profile: Profile;
let showSwitcher = true;
$: name = profile?.circlesAddress ? profile.circlesAddress : "";
$: {
  if ($me) {
    profile = $me;
  } else {
    profile = undefined;
  }
}
</script>

<div class="fixed top-0 left-0 z-50 w-full">
  <div class="grid w-full grid-cols-3 p-2 mx-auto text-white navbar bg-dark-dark justify-items-stretch">
    <div class="justify-self-start whitespace-nowrap">
      <img src="/logos/circles.png" class="w-8 h-8" alt="Circles Land" />
      <span class="ml-2 text-2xl uppercase font-heading text-light">
        {runtimeDapp ? runtimeDapp.title : "<<No dapp>>"}
      </span>
    </div>

    <div class="justify-self-center">
      <span class="text-md text-primary text-secondary">Beta</span>
    </div>

    <div class="col-start-3 pr-1 place-self-center justify-self-end">
      {#if profile}
        {#if profile.__typename === "Organisation"}
          <div class="mr-4 text-white cursor-pointer" on:click="{() => push(`#/marketplace/scan-purchase`)}">
            <Icons icon="qrcode" class="w-6 h-6 heroicon smallicon" />
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>
