<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { _ } from "svelte-i18n";
import Label from "../../../shared/atoms/Label.svelte";

import { QueryAllBusinessesOrderOptions } from "../../../shared/api/data/types";
import { marketStore } from "../stores/marketStore";
import { marketFilterStore } from "../stores/marketFilterStore";
import CategoryFilter from "./CategoryFilter.svelte";
import DropDown from "../../../shared/molecules/DropDown.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let dropdownItems = [
  {
    identifier: "MostPopular",
    name: $_("dapps.o-marketlisting.molecules.marketlistingframe.sortoptions.mostpopular"),
    sortBy: QueryAllBusinessesOrderOptions.MostPopular,
  },
  {
    identifier: "Nearest",
    name: $_("dapps.o-marketlisting.molecules.marketlistingframe.sortoptions.nearest"),
    sortBy: QueryAllBusinessesOrderOptions.Nearest,
  },
  {
    identifier: "Newest",
    name: $_("dapps.o-marketlisting.molecules.marketlistingframe.sortoptions.newest"),
    sortBy: QueryAllBusinessesOrderOptions.Newest,
  },
  {
    identifier: "Oldest",
    name: $_("dapps.o-marketlisting.molecules.marketlistingframe.sortoptions.oldest"),
    sortBy: QueryAllBusinessesOrderOptions.Oldest,
  },
  {
    identifier: "Alphabetical",
    name: $_("dapps.o-marketlisting.molecules.marketlistingframe.sortoptions.alphabetical"),
    sortBy: QueryAllBusinessesOrderOptions.Alphabetical,
  },
];

let currentSort: string = dropdownItems.find((o) => o.identifier == $marketStore.orderBy).name;

type SortedByTypes = "Most popular" | "Nearest" | "Newest" | "Oldest" | "Alphabetical";
let sortedBy: SortedByTypes = "Most popular";

function filterCategoriesChange() {
  marketStore.reload($marketStore.orderBy, $marketFilterStore);
}

function SortChange(event) {
  marketStore.reload(event.detail.value, $marketFilterStore);
  currentSort = dropdownItems.find((o) => o.identifier == event.detail.value).name;
}
</script>

<section class="justify-center p-2 pt-0 mx-auto text-base align-middle">
  <CategoryFilter on:change="{filterCategoriesChange}" />
  <div class="text-sm text-right whitespace-nowrap">
    <Label key="dapps.o-marketlisting.molecules.marketlistingframe.sortby" />
    <span class="pl-2 text-black">{currentSort}</span>
    <DropDown
      selected="Select Sort Option"
      items="{dropdownItems}"
      id="sort"
      key="sortBy"
      isShevron="{true}"
      value="name"
      dropDownClass="mt-1"
      on:dropDownChange="{SortChange}" />
    <!-- <span class=""><Icons icon="chevron-down" size="{4}" customClass="inline" /></span> -->
  </div>

  <div class="flex flex-wrap content-center w-full mb-20 justify-evenly">
    {#if $marketStore.messages.length > 0}
      {#each $marketStore.messages as message}
        <p>{message}</p>
      {/each}
    {/if}
    <slot />
  </div>
</section>
