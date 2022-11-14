<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import { push } from "svelte-spa-router";
  import Icon from "@krowten/svelte-heroicons/Icon.svelte";
  import {Businesses} from "../../../shared/api/data/types";

  export let business: Businesses;
  export let isFavorite: boolean = false;

  const eventDispatcher = createEventDispatcher();

  function loadDetailPage(circlesAddress) {
    push(`/market/detail/${circlesAddress}`);
  }
</script>

<section class="flex-row w-[50%] h-[50%] p-1">
  <div class="relative">
    <img src={business.picture} alt="picture of the business" class="rounded-3xl h-full w-full" on:click={() => {
      loadDetailPage(business.circlesAddress);
    }}/>
    <div
      on:click="{() => {
        isFavorite = !isFavorite;
        eventDispatcher('toggleFavorite', business.circlesAddress);
      }}">
      {#if isFavorite}
        <Icon name="heart" class="w-10 h-10 absolute top-[10%] right-[10%] text-yellow" solid />
      {:else}
        <Icon name="heart" class="w-10 h-10 absolute top-[10%] right-[10%] text-yellow" outline />
      {/if}
    </div>
  </div>
  <div class="font-bold">{business.name}</div>
  <div class="flex-wrap">{business.description}</div>
</section>
