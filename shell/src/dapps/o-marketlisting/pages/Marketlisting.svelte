<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import BusinessCard from "../atoms/BusinessCard.svelte";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import { myLocation } from "src/shared/stores/myLocation";
import { businesses } from "src/shared/stores/businesses";
import { QueryAllBusinessesOrderOptions } from "src/shared/api/data/types";
import { onMount } from "svelte";
import {
  AllBusinessCategoriesDocument,
  AllBusinessCategoriesQueryVariables,
  BusinessCategory,
} from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

type SortedByTypes = "popular" | "Nearest" | "Newest" | "Oldest" | "Alphabetical";

let categories: BusinessCategory[] = [];
let sortedBy: SortedByTypes = "popular";

onMount(async () => {
  categories = await ApiClient.query<BusinessCategory[], AllBusinessCategoriesQueryVariables>(
    AllBusinessCategoriesDocument,
    {}
  );
});
</script>

<div style="visibility: hidden;" class="bg-market"></div>
<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<section class="justify-center align-middle">
  <div class="flex justify-around p-4 pt-0 mx-auto -mt-6 md:w-2/3 xl:w-1/2">
    <div class="w-36 dropdown">
      <button class="text-black bg-white btn w-36 border-1"
        ><span><Icon name="adjustments" class="w-6 h-6" /></span>Filter</button>
      <ul class="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52">
        {#each categories as category}
          <li>
            <button
              class="block w-full"
              on:click="{() => {
                businesses.reload();
              }}">{category.name}</button>
          </li>
        {/each}
      </ul>
    </div>
    <div class="w-36 dropdown dropdown-end">
      <button class="text-black bg-white btn w-36 border-1 whitespace-nowrap"
        ><span><Icon name="chevron-down" class="w-6 h-6" /></span>{sortedBy}</button>
      <ul class="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52">
        <li>
          <button
            class="block w-full"
            on:click="{() => {
              sortedBy = 'popular';
              businesses.reload(QueryAllBusinessesOrderOptions.MostPopular);
            }}">Sort by most popular</button>
        </li>
        <li>
          <button
            class="block w-full"
            on:click="{() => {
              sortedBy = 'Nearest';
              if ($myLocation instanceof GeolocationPosition) {
                businesses.reload(QueryAllBusinessesOrderOptions.Nearest, $myLocation);
              } else {
                myLocation.reload();
                let unsub = null;
                unsub = myLocation.subscribe((o) => {
                  if (unsub) {
                    unsub();
                  }
                  if (o instanceof GeolocationPositionError) {
                    alert(`Couldn't get the location`);
                  } else {
                    businesses.reload(QueryAllBusinessesOrderOptions.Nearest, $myLocation);
                  }
                });
              }
            }}">Sort by nearest</button>
        </li>
        <li>
          <button
            class="block w-full"
            on:click="{() => {
              sortedBy = 'Newest';
              businesses.reload(QueryAllBusinessesOrderOptions.Newest);
            }}">Sort by newest</button>
        </li>
        <li>
          <button
            class="block w-full"
            on:click="{() => {
              sortedBy = 'Oldest';
              businesses.reload(QueryAllBusinessesOrderOptions.Oldest);
            }}">Sort by oldest</button>
        </li>
        <li>
          <button
            class="block w-full"
            on:click="{() => {
              sortedBy = 'Alphabetical';
              businesses.reload(QueryAllBusinessesOrderOptions.Alphabetical);
            }}">Sort by name</button>
        </li>
      </ul>
    </div>
  </div>

  <div class="flex flex-wrap content-center p-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2 justify-evenly">
    {#each $businesses.sort((a, b) => (a.index > b.index ? 1 : a.index < b.index ? -1 : 0)) as business}
      <BusinessCard on:toggleFavorite="{(e) => businesses.toggleFavorite(e.detail)}" business="{business}" />
    {/each}
  </div>
</section>
