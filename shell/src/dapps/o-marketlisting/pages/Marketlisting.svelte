<script lang="ts">
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";

  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import BusinessCard from "../atoms/BusinessCard.svelte";
  import Icon from "@krowten/svelte-heroicons/Icon.svelte";
  import {myLocation} from "src/shared/stores/myLocation";
  import {businesses} from "src/shared/stores/businesses";
  import {QueryAllBusinessesOrderOptions} from "src/shared/api/data/types";
  import {onMount} from "svelte";
  import {
    AllBusinessCategoriesDocument,
    AllBusinessCategoriesQueryVariables,
    BusinessCategory
  } from "../../../shared/api/data/types";
  import {ApiClient} from "../../../shared/apiConnection";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let categories: BusinessCategory[] = [];

  onMount(async () => {
    categories = await ApiClient.query<BusinessCategory[], AllBusinessCategoriesQueryVariables>(AllBusinessCategoriesDocument, {});
  });
</script>

<div style="visibility: hidden;" class="bg-market"></div>
<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<section class="justify-center align-middle">
  <div class="p-4 pt-0 mx-auto -mt-6 md:w-2/3 xl:w-1/2 flex justify-around">
    <div class="w-36 dropdown">
      <button class="btn w-36 text-black bg-white border-1"
      ><span><Icon name="adjustments" class="h-6 w-6" /></span>Filter</button>
      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">

        {#each categories as category}
          <li on:click={() => {
            businesses.reload();
          }}><a>{category.name}</a></li>
        {/each}
      </ul>
    </div>
    <!--
      myLocation.reload(); -->
      <div class="w-36 dropdown dropdown-end">
      <button class="btn w-36 text-black bg-white border-1"
      ><span><Icon name="adjustments" class="h-6 w-6" /></span>Sort</button>
      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
        <li on:click={() => {
        businesses.reload(QueryAllBusinessesOrderOptions.MostPopular);
      }}><a>Sort by most popular</a></li>
        <li><a on:click={() => {
          if ($myLocation instanceof GeolocationPosition) {
            businesses.reload(QueryAllBusinessesOrderOptions.Nearest, $myLocation);
          } else {
            myLocation.reload();
            let unsub = null;
            unsub = myLocation.subscribe(o => {
              if (unsub){
                unsub();
              }
              if (o instanceof GeolocationPositionError) {
                alert(`Couldn't get the location`)
              } else {
                businesses.reload(QueryAllBusinessesOrderOptions.Nearest, $myLocation);
              }
            })
          }
        }}>Sort by nearest</a></li>
        <li><a on:click={() => {
          businesses.reload(QueryAllBusinessesOrderOptions.Newest);
        }}>Sort by newest</a></li>
        <li><a on:click={() => {
          businesses.reload(QueryAllBusinessesOrderOptions.Oldest);
        }}>Sort by oldest</a></li>
        <li><a on:click={() => {
          businesses.reload(QueryAllBusinessesOrderOptions.Alphabetical);
        }}>Sort by name</a></li>
      </ul>
    </div>
  </div>

  <div class="p-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2 flex flex-wrap justify-evenly content-center">
    {#if $myLocation}
      <!-- Sort nearest first -->
      <p>Nearest first:</p>
      {#each $businesses.sort((a,b) => a.index > b.index ? 1: a.index < b.index ? -1 : 0) as business}
        <BusinessCard
                on:toggleFavorite={e => businesses.toggleFavorite(e.detail)}
                business={business}
        />
      {/each}
    {:else}
      {#each $businesses.sort((a,b) => a.index > b.index ? 1: a.index < b.index ? -1 : 0) as business}
        <BusinessCard
                on:toggleFavorite={e => businesses.toggleFavorite(e.detail)}
                business={business}
        />
      {/each}
    {/if}
  </div>
</section>
