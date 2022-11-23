<script lang="ts">
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";

  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import Icon from "@krowten/svelte-heroicons/Icon.svelte";
  import {QueryAllBusinessesOrderOptions} from "src/shared/api/data/types";
  import {onMount} from "svelte";
  import {
    AllBusinessCategoriesDocument,
    AllBusinessCategoriesQueryVariables,
    BusinessCategory,
  } from "../../../shared/api/data/types";
  import {ApiClient} from "../../../shared/apiConnection";
  import {marketStore} from "../stores/marketStore";
  import {marketFilterStore} from "../stores/marketFilterStore";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  type SortedByTypes = "Most popular" | "Nearest" | "Newest" | "Oldest" | "Alphabetical";

  let categories: BusinessCategory[] = [];
  let sortedBy: SortedByTypes = "Most popular";
  
  onMount(async () => {
    categories = await ApiClient.query<BusinessCategory[], AllBusinessCategoriesQueryVariables>(
      AllBusinessCategoriesDocument,
      {}
    );
  });
</script>

<div style="visibility: hidden;" class="bg-market"></div>
<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}"/>
<section class="justify-center align-middle">
    <div class="flex justify-around p-4 pt-0 mx-auto -mt-6 md:w-2/3 xl:w-1/2">
        <div class="w-36 dropdown">
            <button class="text-black bg-white btn w-36 border-1"
            ><span><Icon name="adjustments" class="w-6 h-6"/></span>Filter {$marketFilterStore.length > 0 ? `(${$marketFilterStore.length})` : ``}
            </button>
            <ul class="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52">
                {#if $marketFilterStore.length > 0}
                <li>
                    <button class="block w-full" on:click="{() => {
                      $marketFilterStore = [];
                      marketStore.reload($marketStore.orderBy, $marketFilterStore);
                    }}"><b>x Clear</b></button>
                </li>
                {/if}
                {#each categories as category}
                    <li>
                    {#if $marketFilterStore.indexOf(category.id) >= 0}
                        <button class="block w-full" on:click="{() => {
                          $marketFilterStore.splice($marketFilterStore.indexOf(category.id), 1);
                          $marketFilterStore = $marketFilterStore;
                          marketStore.reload($marketStore.orderBy, $marketFilterStore);
                        }}"> ✓ {category.name}</button>
                    {:else}
                        <button class="block w-full" on:click="{() => {
                          $marketFilterStore = $marketFilterStore.concat([category.id]);
                          marketStore.reload($marketStore.orderBy, $marketFilterStore);
                        }}">{category.name}</button>
                    {/if}
                    </li>
                {/each}
            </ul>
        </div>
        <div class="w-36 dropdown dropdown-end">
            <button class="text-black bg-white btn w-36 border-1 whitespace-nowrap"
            ><span><Icon name="chevron-down" class="w-6 h-6"/></span>{$marketStore.orderBy}</button>
            <ul class="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52">
                <li>
                    <button class="block w-full" on:click="{() => {
                        sortedBy = 'Most popular';
                        marketStore.reload(QueryAllBusinessesOrderOptions.MostPopular, $marketFilterStore);
          }}">Sort by most popular
                    </button>
                </li>
                <li>
                    <button class="block w-full" on:click="{() => {
              sortedBy = 'Nearest';
              marketStore.reload(QueryAllBusinessesOrderOptions.Nearest, $marketFilterStore);
            }}">Sort by nearest
                    </button>
                </li>
                <li>
                    <button class="block w-full" on:click="{() => {
              sortedBy = 'Newest';
              marketStore.reload(QueryAllBusinessesOrderOptions.Newest, $marketFilterStore);
            }}">Sort by newest
                    </button>
                </li>
                <li>
                    <button class="block w-full" on:click="{() => {
              sortedBy = 'Oldest';
              marketStore.reload(QueryAllBusinessesOrderOptions.Oldest, $marketFilterStore);
            }}">Sort by oldest
                    </button>
                </li>
                <li>
                    <button class="block w-full" on:click="{() => {
              sortedBy = 'Alphabetical';
              marketStore.reload(QueryAllBusinessesOrderOptions.Alphabetical, $marketFilterStore);
            }}">Sort by name
                    </button>
                </li>
            </ul>
        </div>
    </div>

    <div class="flex flex-wrap content-center p-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2 justify-evenly">
        {#if $marketStore.messages.length > 0}
            {#each $marketStore.messages as message}
                <p>{message}</p>
            {/each}
        {/if}
        <slot></slot>
    </div>
</section>
