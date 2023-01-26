<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { _ } from "svelte-i18n";
import Label from "../../../shared/atoms/Label.svelte";
import BusinessCard from "../atoms/BusinessCard.svelte";
import { marketFavoritesStore } from "../stores/marketFavoritesStore";
import { marketStore } from "../stores/marketStore";
import MarketlistingFrame from "../molecules/MarketlistingFrame.svelte";

import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
</script>

<div style="visibility: hidden;" class="bg-market"></div>
<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<div class="mx-auto md:w-2/3 xl:w-1/2">
  <img src="images/market-banner.svg" alt="Marketplace" class="w-full" />

  <MarketlistingFrame runtimeDapp="{runtimeDapp}" routable="{routable}">
    {#if $marketStore.businesses.length == 0}
      <p><Label key="dapps.o-marketlisting.pages.marketlisting.noentries" /></p>
    {/if}
    {#each $marketStore.businesses as business}
      <BusinessCard on:toggleFavorite="{(e) => marketFavoritesStore.toggleFavorite(e.detail)}" business="{business}" />
    {/each}
  </MarketlistingFrame>
</div>
