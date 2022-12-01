<script lang="ts">
  import {
    AllBusinessCategoriesDocument,
    AllBusinessCategoriesQueryVariables,
    BusinessCategory
  } from "../../../shared/api/data/types";
  import Icon from "@krowten/svelte-heroicons/Icon.svelte";
  import {onMount} from "svelte";
  import {ApiClient} from "../../../shared/apiConnection";
  import {marketFilterStore} from "../stores/marketFilterStore";
  import {marketStore} from "../stores/marketStore";

  export let selectedCategory: BusinessCategory;

  let categories: BusinessCategory[] = [];

  onMount(async () => {
    categories = await ApiClient.query<BusinessCategory[], AllBusinessCategoriesQueryVariables>(
      AllBusinessCategoriesDocument,
      {}
    );
  });
</script>
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
                          selectedCategory = category;
                        }}">{category.name}</button>
                {/if}
            </li>
        {/each}
    </ul>
</div>