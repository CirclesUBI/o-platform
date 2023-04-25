<script lang="ts">
import { _ } from "svelte-i18n";
import Label from "../../../shared/atoms/Label.svelte";

import { QueryAllBusinessesOrderOptions } from "../../../shared/api/data/types";
import marketStore from "../stores/marketStore";
import { marketFilterStore } from "../stores/marketFilterStore";
import CategoryFilter from "./CategoryFilter.svelte";
import DropDown from "../../../shared/molecules/DropDown.svelte";
import Geolocation from "svelte-geolocation";
import { onMount } from "svelte";
let geolocation;
let geoLocationOptions = {
  enableHighAccuracy: true,
};
let ownLocation: GeolocationPosition = null;

onMount(async () => {
  if (geolocation) {
    marketStore.init(geolocation);
  }
});

let dropdownItems = [
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
  {
    identifier: "MostPopular",
    name: $_("dapps.o-marketlisting.molecules.marketlistingframe.sortoptions.mostpopular"),
    sortBy: QueryAllBusinessesOrderOptions.MostPopular,
  },
];

type SortedByTypes = "Most popular" | "Nearest" | "Newest" | "Oldest" | "Alphabetical";
let sortedBy: SortedByTypes = "Most popular";
let currentSort: string = dropdownItems.find((o) => o.identifier == $marketStore.orderBy).name;

$: {
  if (geolocation) {
    if (currentSort == QueryAllBusinessesOrderOptions.Nearest) {
      ownLocation = geolocation;
      marketStore.init(geolocation);
      marketStore.reload(QueryAllBusinessesOrderOptions.Nearest, $marketFilterStore);
    }
  }
}

function filterCategoriesChange() {
  marketStore.reload($marketStore.orderBy, $marketFilterStore);
}

function SortChange(event) {
  marketStore.reload(event.detail.value, $marketFilterStore);
  currentSort = dropdownItems.find((o) => o.identifier == event.detail.value).name;
}
</script>

<Geolocation
  options="{geoLocationOptions}"
  watch="{false}"
  getPosition
  on:position="{(e) => {
    geolocation = e.detail;
  }}"
  on:error="{(e) => {
    console.log('POS ERROR', e.detail); // GeolocationError
  }}" />
<section class="justify-center p-4 pt-0 mx-auto text-base align-middle">
  <div class="py-2 text-left border-2 border-t-0 border-l-0 border-r-0 whitespace-nowrap border-b-marketplace">
    <Label key="dapps.o-marketlisting.molecules.marketlistingframe.sortby" />
    <span class="pl-2">{currentSort}</span>
    <DropDown
      selected="{dropdownItems[0].identifier}"
      hideDefault="{true}"
      items="{dropdownItems}"
      id="sort"
      key="sortBy"
      isChevron="{true}"
      value="name"
      dropDownClass="mt-1"
      on:dropDownChange="{SortChange}" />
    <!-- <span class=""><Icons icon="chevron-down" size="{4}" customClass="inline" /></span> -->
  </div>
  <CategoryFilter on:change="{filterCategoriesChange}" />

  <div class="flex flex-wrap content-center w-full mb-20 justify-evenly">
    {#if $marketStore.messages.length > 0}
      {#each $marketStore.messages as message}
        <p>{@html message}</p>
      {/each}
    {/if}
    <slot />
  </div>
</section>
