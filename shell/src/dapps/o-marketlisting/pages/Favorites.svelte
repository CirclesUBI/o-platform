<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { _ } from "svelte-i18n";
import Label from "../../../shared/atoms/Label.svelte";
import BusinessCard from "../atoms/BusinessCard.svelte";
import { marketFavoritesStore } from "../stores/marketFavoritesStore";
import { marketStore } from "../stores/marketStore";
import MarketlistingFrame from "../molecules/MarketlistingFrame.svelte";
import { marketFilterStore } from "../stores/marketFilterStore";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
</script>

<div style="visibility: hidden;" class="bg-market"></div>

<div class="px-4 mx-auto mt-20 text-center md:w-2/3 xl:w-1/2 font-heading text-marketplace">
  <h1 class="text-5xl">
    <Label key="dapps.o-marketplace.pages.favorites.title" />
  </h1>
</div>

<MarketlistingFrame runtimeDapp="{runtimeDapp}" routable="{routable}">
  {#if $marketStore.businesses.filter((o) => $marketFavoritesStore[o.circlesAddress]).length == 0}
    <p>No entries</p>
  {/if}
  {#each $marketStore.businesses.filter((o) => $marketFavoritesStore[o.circlesAddress]) as business}
    <BusinessCard on:toggleFavorite="{(e) => marketFavoritesStore.toggleFavorite(e.detail)}" business="{business}" />
  {/each}
</MarketlistingFrame>
