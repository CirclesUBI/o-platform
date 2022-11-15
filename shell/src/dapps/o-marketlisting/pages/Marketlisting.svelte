<script lang="ts">
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";

  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import BusinessCard from "../atoms/BusinessCard.svelte";
  import Icon from "@krowten/svelte-heroicons/Icon.svelte";
  import {myLocation} from "src/shared/stores/myLocation";
  import {businesses} from "src/shared/stores/businesses";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
</script>

<div style="visibility: hidden;" class="bg-market"></div>
<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<section class="justify-center align-middle">
  <div class="flex self-center justify-center content-between">
    <button class="btn mr-2 ml-2 text-black bg-white border-1"
      ><span><Icon name="adjustments" class="h-6 w-6" /></span>Filter by type</button>
    <button class="btn mr-2 ml-2 text-black bg-white border-1" on:click={() => {
      myLocation.reload();
    }}
      ><span><Icon name="chevron-down" class="h-6 w-6" /></span>Sort by closest</button>
  </div>

  <div class="p-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2 flex flex-wrap justify-evenly content-center">
    {#if $myLocation}
      <!-- Sort nearest first -->
      <p>Nearest first:</p>
      {#each $businesses as business}
        <BusinessCard
                on:toggleFavorite={e => businesses.toggleFavorite(e.detail)}
                business={business}
        />
      {/each}
    {:else}
      {#each $businesses as business(business.circlesAddress)}
        <BusinessCard
                on:toggleFavorite={e => businesses.toggleFavorite(e.detail)}
                business={business}
        />
      {/each}
    {/if}
  </div>
</section>
