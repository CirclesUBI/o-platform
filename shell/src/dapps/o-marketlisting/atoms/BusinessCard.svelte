<script lang="ts">
import { createEventDispatcher } from "svelte";
import { push } from "svelte-spa-router";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import { Businesses } from "../../../shared/api/data/types";
import { marketFavoritesStore } from "../stores/marketFavoritesStore";
import { isMobile } from "../../../shared/functions/isMobile";
import Label from "../../../shared/atoms/Label.svelte";

export let business: Businesses & { isFavorite: boolean };

const eventDispatcher = createEventDispatcher();

function loadDetailPage(circlesAddress) {
  push(`/market/detail/${circlesAddress}`);
}

let textCutoff = isMobile() ? 12 : 35;
</script>

<section class="p-1 mb-2">
  <div class="relative w-full min-w-0">
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
  <div class="container w-full">
    {#if business.name}
      <div class="pb-0 pl-2 text-2xl font-bold font-heading text-heading">
        <Label text="{business.name}" truncate="{true}" />
      </div>
    {/if}
    {#if business.locationName}
      <div class="pt-0 pl-2 text-sm">
        <Label text="{business.locationName}" truncate="{true}" />
      </div>
    {/if}
    {#if business.description}
      <div class="flex-wrap pt-1 pl-2 text-md">
        <Label text="{business.description}" truncate="{true}" />
      </div>
    {/if}
  </div>
</section>
