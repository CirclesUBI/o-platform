<script lang="ts">
import { createEventDispatcher } from "svelte";
import { push } from "svelte-spa-router";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import { Businesses } from "../../../shared/api/data/types";
import { marketFavoritesStore } from "../stores/marketFavoritesStore";

export let business: Businesses & { isFavorite: boolean };

const eventDispatcher = createEventDispatcher();

function loadDetailPage(circlesAddress) {
  push(`/market/detail/${circlesAddress}`);
}
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
  {#if business.name}
    <div class="pt-2 pl-2 text-2xl font-bold font-heading text-heading">{business.name ? (business.name.length >= 38 ? business.name.slice(0, 38) + "..." : business.name) : ""}</div>
  {/if}
  {#if business.description}
    <div class="flex-wrap pl-2 text-grey">{business.description ? (business.description.length >= 70 ? business.description.slice(0, 70) + "..." : business.description) : ""}</div>
  {/if}
</section>
