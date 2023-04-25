<script lang="ts">
import { clickOutside } from "../functions/clickOutside";
import { createEventDispatcher, onMount } from "svelte";

import { dapps } from "../../loader";
import DetailActionBar from "./DetailActionBar.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
import ProfileSwitcherBar from "./ProfileSwitcherBar.svelte";
import LangSwitcher from "../atoms/LangSwitcher.svelte";
import Label from "../atoms/Label.svelte";
import getJumplistItems from "../functions/getJumplistItemsFromManifests";

export let runtimeDapp: RuntimeDapp<any>;

let actions: JumplistItem[] = [];
let profiles: JumplistItem[] = [];
let showSwitcher: boolean = false;

onMount(async () => {
  const manifestsWithJumplist = dapps.filter((o) => o.jumplist);

  const jumplistitems = await getJumplistItems(manifestsWithJumplist, runtimeDapp);
  actions = jumplistitems && jumplistitems.actions ? jumplistitems.actions : null;
  profiles = jumplistitems && jumplistitems.profiles ? jumplistitems.profiles : null;
});

function compareOrder(a, b) {
  if (a.order < b.order) {
    return -1;
  }
  if (a.order > b.order) {
    return 1;
  }
  return 0;
}

const eventDispatcher = createEventDispatcher();
</script>

{#if profiles && actions}
  <div class="z-10 flex flex-col flex-1" use:clickOutside on:click_outside="{() => eventDispatcher('clickedOutside')}">
    {#if showSwitcher}
      <div class="w-full p-6">
        <LangSwitcher />
      </div>
    {/if}

    <div class="w-full text-center">
      <h1 class="pt-4 text-3xl tracking-normal uppercase font-heading text-heading"><Label key="shared.actionMenu.quickactions" /></h1>
    </div>
    <div class="inline p-6">
      <div class="flex flex-row flex-wrap items-stretch mt-2 -mr-2 space-y-4 space-y-reverse justify-evenly justify-items-start">
        <ProfileSwitcherBar actions="{profiles}" />

        <DetailActionBar
          actions="{actions}"
          on:siwtchEvent="{() => {
            showSwitcher = !showSwitcher;
          }}" />
      </div>
    </div>
  </div>
{/if}
