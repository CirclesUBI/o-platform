<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { _ } from "svelte-i18n";
import BusinessCard from "../atoms/BusinessCard.svelte";
import { marketFavoritesStore } from "../stores/marketFavoritesStore";
import marketStore from "../stores/marketStore";
import MarketlistingFrame from "../molecules/MarketlistingFrame.svelte";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import { infiniteScroll } from "../../../shared/functions/infiniteScroll";

export let runtimeDapp: RuntimeDapp<any>;
let loading = false;
let entries = [];
let endOfList: boolean = false;

const fetchData = async () => {
  try {
    loading = true;
    endOfList = !(await marketStore.fetchNext());
    loading = false;
  } catch (error) {
    console.log(error);
  }
};

let elementRef = null;

const load = () => {
  if (!endOfList) {
    setTimeout(() => {
      fetchData();
    }, 300);
  }
};

$: $marketStore.businesses, (endOfList = false);

$: {
  if (elementRef) {
    infiniteScroll({ fetch: load, element: elementRef });
  }
}
</script>

<div style="visibility: hidden;" class="bg-market"></div>
<SimpleHeader runtimeDapp="{runtimeDapp}" />

<div id="markelisting" class="mx-auto md:w-2/3 xl:w-1/2">
  <img src="images/market-banner.svg" alt="Marketplace" class="w-full" />

  <MarketlistingFrame>
    <main>
      {#if entries}
        <div class="grid grid-cols-2 businessList">
          {#each $marketStore.businesses as business}
            <div>
              <BusinessCard on:toggleFavorite="{(e) => marketFavoritesStore.toggleFavorite(e.detail)}" business="{business}" />
            </div>
          {/each}
          {#if loading === false}
            <div bind:this="{elementRef}"><!--intersection observer element--></div>
          {/if}
        </div>
      {/if}
    </main>
  </MarketlistingFrame>
</div>
