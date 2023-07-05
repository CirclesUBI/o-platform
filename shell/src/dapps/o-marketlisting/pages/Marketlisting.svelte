<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { _ } from "svelte-i18n";
import BusinessCard from "../atoms/BusinessCard.svelte";
import { marketFavoritesStore } from "../stores/marketFavoritesStore";
import marketStore from "../stores/marketStore";
import MarketlistingFrame from "../molecules/MarketlistingFrame.svelte";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import IntersectionObserver from "../../../shared/molecules/IntersectionObserver.svelte";
import { onMount } from "svelte";

export let runtimeDapp: RuntimeDapp<any>;
let loading = true;
let endOfList: boolean = false;

let element;
let intersecting = false;

onMount(async () => {
  loading = false;
  intersecting = false;
});

const fetchData = async () => {
  console.log("Fetching...");
  try {
    loading = true;
    endOfList = !(await marketStore.fetchNext());
    loading = false;
  } catch (error) {
    console.log(error);
  }
};

const load = async () => {
  console.log("In view");
  if (!endOfList && !loading) {
    setTimeout(() => {
      fetchData();
    }, 300);
  }
};
</script>

<div style="visibility: hidden;" class="bg-market"></div>
<SimpleHeader runtimeDapp="{runtimeDapp}" />

<div id="markelisting" class="mx-auto md:w-2/3 xl:w-1/2">
  <img src="images/market-banner.svg" alt="Marketplace" class="w-full" />

  <MarketlistingFrame>
    <div class="grid grid-cols-2 businessList">
      {#each $marketStore.businesses as business}
        <div>
          <BusinessCard on:toggleFavorite="{(e) => marketFavoritesStore.toggleFavorite(e.detail)}" business="{business}" />
        </div>
      {/each}

      <IntersectionObserver
        element="{element}"
        bind:intersecting="{intersecting}"
        on:intersect="{(e) => {
          if ($marketStore.businesses.at(-1)?.cursor !== undefined) {
            load();
          }
        }}">
        <div bind:this="{element}"></div>
      </IntersectionObserver>
    </div>
  </MarketlistingFrame>
</div>
