<script lang="ts">
import { createEventDispatcher } from "svelte";
import { push } from "svelte-spa-router";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import { Businesses } from "../../../shared/api/data/types";
import { marketFavoritesStore } from "../stores/marketFavoritesStore";
import { isMobile } from "../../../shared/functions/isMobile";

export let business: Businesses & { isFavorite: boolean };

const eventDispatcher = createEventDispatcher();

function loadDetailPage(circlesAddress) {
  push(`/market/detail/${circlesAddress}`);
}

let textCutoff = isMobile() ? 12 : 35;
</script>

<section class="flex-row w-[50%] h-[50%] p-1 mb-2">
  <div class="relative">
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img
      src="{business.picture}"
      alt="picture of the business"
      class="w-full h-full rounded-3xl"
      role="presentation"
      on:click="{() => {
        loadDetailPage(business.circlesAddress);
      }}" />
    <div
      role="presentation"
      on:click="{() => {
        eventDispatcher('toggleFavorite', business.circlesAddress);
      }}">
      {#if $marketFavoritesStore[business.circlesAddress]}
        <Icon name="heart" class="w-10 h-10 absolute top-[10%] right-[10%] text-yellow" solid />
      {:else}
        <Icon name="heart" class="w-10 h-10 absolute top-[10%] right-[10%] text-yellow" outline />
      {/if}
    </div>
  </div>
  <div class="container">
    {#if business.name}
      <div class="pl-2 text-2xl font-bold font-heading text-heading truncateText">
        {business.name ? (business.name.length >= textCutoff ? business.name.slice(0, textCutoff) + "..." : business.name) : ""}
      </div>
    {/if}
    {#if business.locationName}
      <div class="pl-2 text-sm truncateText">
        {business.locationName ? (business.locationName.length >= textCutoff ? business.locationName.slice(0, textCutoff) + "..." : business.locationName) : ""}
      </div>
    {/if}
    {#if business.description}
      <div class="pt-2 flex-wrap pl-2 text-lg truncateText">
        {business.description ? (business.description.length >= textCutoff ? business.description.slice(0, textCutoff) + "..." : business.description) : ""}
      </div>
    {/if}
  </div>
</section>
