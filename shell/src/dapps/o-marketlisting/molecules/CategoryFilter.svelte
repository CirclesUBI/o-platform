<script lang="ts">
import { BusinessCategory } from "../../../shared/api/data/types";
import { Environment } from "../../../shared/environment";
import DropDown from "../../../shared/molecules/DropDown.svelte";
import { _ } from "svelte-i18n";
import Label from "../../../shared/atoms/Label.svelte";
import { createEventDispatcher, onMount } from "svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import { marketFilterStore } from "../stores/marketFilterStore";

let allCategories: BusinessCategory[];
const eventDispatcher = createEventDispatcher();
let allCategoriesLookup;

onMount(async () => {
  allCategories = (await Environment.api.allBusinessCategories()).allBusinessCategories;

  allCategoriesLookup = allCategories.toLookup(
    (o) => o.id,
    (o) => o
  );
});

function addOrRemove<T>(source: T[], candidate: T, comparator?: (a: T, b: T) => boolean): T[] {
  const c = comparator || ((a, b) => a == b);
  const e = source.find((i) => c(i, candidate));
  return e ? source.filter((i) => !c(i, candidate)) : [...source, candidate];
}
function handleOnChange(event) {
  $marketFilterStore = addOrRemove($marketFilterStore, parseInt(event.detail.value));

  eventDispatcher("change");
}
function handleRemoveFilter(filterId) {
  $marketFilterStore = addOrRemove($marketFilterStore, parseInt(filterId));
  eventDispatcher("change");
}
</script>

{#if allCategories}
  <div class="flex flex-row flex-wrap items-center space-x-2">
    <div class="text-sm"><Label key="dapps.o-marketlisting.molecules.categoryfilter.filter" /></div>
    {#each $marketFilterStore as filterId}
      <div class="text-xs badge badge-outline">
        {allCategoriesLookup[filterId].name}
        <button class="pl-2 cursor-pointer text-cpurple" on:click="{handleRemoveFilter(filterId)}"><Icons icon="closex" size="{2}" /></button>
      </div>
    {/each}
    <div class="inline">
      <DropDown selected="add Filter" items="{allCategories}" id="filters" key="id" isButton="{true}" value="name" dropDownClass="mt-1" on:dropDownChange="{handleOnChange}" />
    </div>
  </div>
{/if}
