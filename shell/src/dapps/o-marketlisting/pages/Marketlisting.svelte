<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import BusinessCard from "../atoms/BusinessCard.svelte";
import { marketFavoritesStore } from "../stores/marketFavoritesStore";
import { marketStore } from "../stores/marketStore";
import MarketlistingFrame from "../molecules/MarketlistingFrame.svelte";
import { marketFilterStore } from "../stores/marketFilterStore";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

console.log($marketFilterStore);
</script>

<div style="visibility: hidden;" class="bg-market"></div>
<div class="mx-auto md:w-2/3 xl:w-1/2">
  <img src="images/market-banner.svg" alt="Marketplace" class="w-full" />
</div>
<MarketlistingFrame runtimeDapp="{runtimeDapp}" routable="{routable}">
  {#if $marketStore.businesses.length == 0}
    <p>No entries</p>
  {/if}
  {#each $marketStore.businesses as business}
    <BusinessCard on:toggleFavorite="{(e) => marketFavoritesStore.toggleFavorite(e.detail)}" business="{business}" />
  {/each}
</MarketlistingFrame>
