<script lang="ts">
import { createEventDispatcher } from "svelte";
import { push } from "svelte-spa-router";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import { Businesses } from "../../../shared/api/data/types";

export let business: Businesses & { isFavorite: boolean };

const eventDispatcher = createEventDispatcher();

function loadDetailPage(circlesAddress) {
  push(`/market/detail/${circlesAddress}`);
}
</script>

<section class="flex-row w-[50%] h-[50%] p-2">
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
      {#if business.isFavorite}
        <Icon name="heart" class="w-10 h-10 absolute top-[10%] right-[10%] text-yellow" solid />
      {:else}
        <Icon name="heart" class="w-10 h-10 absolute top-[10%] right-[10%] text-yellow" outline />
      {/if}
    </div>
  </div>
  <div class="p-4">
    <div class="text-sm font-bold">{business.name}</div>
    <div class="flex-wrap text-sm">{business.description}</div>
  </div>
</section>
