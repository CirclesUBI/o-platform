<script lang="ts">
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";

  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import {
    AllBusinessesDocument,
    Businesses,
    MutationToggleFavoriteArgs,
    ToggleFavoriteDocument
  } from "../../../shared/api/data/types";
  import {onMount} from "svelte";
  import {ApiClient} from "../../../shared/apiConnection";
  import BusinessCard from "../atoms/BusinessCard.svelte";
  import Icon from "@krowten/svelte-heroicons/Icon.svelte";
  import {me} from "../../../shared/stores/me";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let businesses: Businesses[] = [];
  let favorites: {[circlesAddress:string]: boolean} = {};

onMount(async () => {
  await Promise.all([
          getBusinesses(),
          me.reload()
  ]);
  me.subscribe(m => {
    favorites = {};
    m.favorites.forEach(f => {
      favorites[f.favorite.circlesAddress] = true;
    });
  })
});

async function getBusinesses() {
  businesses = await ApiClient.query<[Businesses], null>(AllBusinessesDocument, null);
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
    <button class="btn mr-2 ml-2 text-black bg-white border-1"
      ><span><Icon name="chevron-down" class="h-6 w-6" /></span>Sort by closest</button>
  </div>

  <div class="p-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2 flex flex-wrap justify-evenly content-center">
    {#each businesses as business}
      <BusinessCard
          on:toggleFavorite={e => toggleFavorite(e.detail)}
          business={business}
          isFavorite={favorites[business.circlesAddress]}
      />
    {/each}
  </div>
</section>
