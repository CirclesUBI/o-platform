<script lang="ts">
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";

  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import {
    AllBusinessesDocument,
    Businesses, Maybe,
    MutationToggleFavoriteArgs, Profile,
    ToggleFavoriteDocument
  } from "../../../shared/api/data/types";
  import {onMount} from "svelte";
  import {ApiClient} from "../../../shared/apiConnection";
  import BusinessCard from "../atoms/BusinessCard.svelte";
  import Icon from "@krowten/svelte-heroicons/Icon.svelte";
  import {me} from "../../../shared/stores/me";
  import {myLocation} from "src/shared/stores/myLocation";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let businesses: Businesses[] = [];
  let favorites: {[circlesAddress:string]: boolean} = {};
  let currentLocation: GeolocationPosition|GeolocationPositionError|Error|null;

onMount(async () => {
  const results = await Promise.all([
          getBusinesses(),
          me.reload()
  ]);
  businesses = <any>results[0];
  const profile:Maybe<Profile> = <any>results[1];

  if (profile) {
    profile.favorites.forEach(f => {
      favorites[f.favorite.circlesAddress] = true;
    });
  }
});

async function getBusinesses() : Promise<Businesses[]> {
  if (currentLocation) {
    console.log("Sorting result by 'closest first' for location: ", currentLocation);
    return await ApiClient.query<Businesses[], null>(AllBusinessesDocument, null);
  } else {
    return await ApiClient.query<Businesses[], null>(AllBusinessesDocument, null);
  }
}

async function toggleFavorite(circlesAddress:string) {
  favorites[circlesAddress] = await ApiClient.mutate<boolean, MutationToggleFavoriteArgs>(ToggleFavoriteDocument, {
    circlesAddress: circlesAddress
  });
  return favorites[circlesAddress];
}
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
      {#each businesses as business}
        <BusinessCard
                on:toggleFavorite={e => toggleFavorite(e.detail)}
                business={business}
                isFavorite={favorites[business.circlesAddress]}
        />
      {/each}
    {:else}
      {#each businesses as business}
        <BusinessCard
                on:toggleFavorite={e => toggleFavorite(e.detail)}
                business={business}
                isFavorite={favorites[business.circlesAddress]}
        />
      {/each}
    {/if}
  </div>
</section>
