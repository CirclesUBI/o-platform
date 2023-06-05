<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { _ } from "svelte-i18n";
import Label from "../../../shared/atoms/Label.svelte";
import BusinessCard from "../atoms/BusinessCard.svelte";
import { marketFavoritesStore } from "../stores/marketFavoritesStore";
import marketStore from "../stores/marketStore";
import MarketlistingFrame from "../molecules/MarketlistingFrame.svelte";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import InfiniteScroll from "../../../shared/molecules/InfiniteScroll.svelte";
import { onMount } from "svelte";

export let runtimeDapp: RuntimeDapp<any>;
let container = null;

onMount(() => {
  container = document.getElementById("markelisting");
});
</script>

<div style="visibility: hidden;" class="bg-market"></div>
<SimpleHeader runtimeDapp="{runtimeDapp}" />

<div id="markelisting" class="mx-auto md:w-2/3 xl:w-1/2">
  <img src="images/market-banner.svg" alt="Marketplace" class="w-full" />

  <MarketlistingFrame>
    {#if $marketStore.businesses.length == 0}
      <p><Label key="dapps.o-marketlisting.pages.marketlisting.noentries" /></p>
    {/if}
    <div class="grid grid-cols-2 businessList">
      {#each $marketStore.businesses as business}
        <BusinessCard on:toggleFavorite="{(e) => marketFavoritesStore.toggleFavorite(e.detail)}" business="{business}" />
      {/each}
      <InfiniteScroll
        elementScroll="{container}"
        hasMore="{true}"
        threshold="{100}"
        on:loadMore="{() => {
          console.log('JAJAJ');
          marketStore.fetchNext;
        }}" />
    </div>
  </MarketlistingFrame>
  <button class="btn btn-primary" on:click="{marketStore.fetchNext}">MACH MAL WAS</button>
</div>

<style>
.businessList {
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  width: 100%;
  max-width: 400px;
  /*     max-height: 400px; */
  /* 		background-color: white; */
  overflow-x: scroll;
  list-style: none;
  padding: 0;
}
</style>
