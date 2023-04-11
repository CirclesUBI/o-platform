<script lang="ts">
import { clickOutside } from "../functions/clickOutside";
import { createEventDispatcher, onMount } from "svelte";

import { dapps } from "../../loader";
import DetailActionBar from "./DetailActionBar.svelte";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
import ProfileSwitcherBar from "./ProfileSwitcherBar.svelte";
import LangSwitcher from "../atoms/LangSwitcher.svelte";
import { loadProfile } from "../functions/loadProfile";
import { me } from "../stores/me";

export let runtimeDapp: RuntimeDapp<any>;

let categories: {
  manifest: DappManifest<any>;
  items: {
    ["action"]: JumplistItem[];
    ["profile"]: JumplistItem[];
  };
}[] = [];

let actions: JumplistItem[] = [];
let profiles: JumplistItem[] = [];

let promise;
let showSwitcher: boolean = false;

onMount(async () => {
  const manifestsWithJumplist = dapps.filter((o) => o.jumplist);
  categories = await Promise.all(
    manifestsWithJumplist.map(async (o) => {
      const jumplistItems = await o.jumplist.items({}, runtimeDapp);
      return <
        {
          manifest: DappManifest<any>;
          items: {
            ["action"]: JumplistItem[];
            ["profile"]: JumplistItem[];
          };
        }
      >{
        manifest: o,
        items: jumplistItems.groupBy((c) => c.type ?? "action"),
      };
    })
  );
  actions = categories.filter((o) => o.items["action"]).flatMap((o) => o.items["action"]);
  profiles = categories.filter((o) => o.items["profile"]).flatMap((o) => o.items["profile"]);

  promise = await fetchProfiles();
  // Attach actual Profiles to the object.
});

async function fetchProfiles() {
  for (const action of profiles) {
    if (action.key.startsWith("0x")) {
      action.profile = (await loadProfile(action.key, $me))?.profile;
    }
  }
  return profiles;
}

const eventDispatcher = createEventDispatcher();
</script>

{#if profiles}
  <div class="z-10 flex flex-col flex-1" use:clickOutside on:click_outside="{() => eventDispatcher('clickedOutside')}">
    {#if showSwitcher}
      <div class="w-full p-6">
        <LangSwitcher />
      </div>
    {/if}
    <div class="w-full text-center">
      <h1 class="pt-4 text-3xl uppercase font-heading">My Profiles</h1>
    </div>

    <div class="relative flex-shrink-0 w-full pt-2 space-y-2">
      <div class="">
        {#await promise}
          <p>loading Profiles...</p>
        {:then theProfiles}
          <ProfileSwitcherBar actions="{theProfiles}" />
        {/await}
      </div>
    </div>
    <div class="w-full text-center">
      <h1 class="pt-4 text-3xl uppercase font-heading">Quick Actions</h1>
    </div>
    <div class="py-6">
      <DetailActionBar
        actions="{actions}"
        on:siwtchEvent="{() => {
          showSwitcher = !showSwitcher;
        }}" />
    </div>
  </div>
{/if}
