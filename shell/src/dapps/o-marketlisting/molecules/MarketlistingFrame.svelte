<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";

import Icons from "../../../shared/molecules/Icons.svelte";
import { QueryAllBusinessesOrderOptions } from "src/shared/api/data/types";
import { BusinessCategory } from "../../../shared/api/data/types";
import { marketStore } from "../stores/marketStore";
import { marketFilterStore } from "../stores/marketFilterStore";
import CategoryDropDown2 from "../../o-passport/molecules/CategoryDropDown.svelte";
import MarketDropdown from "./MarketDropdown.svelte";
import MarketlistingDetail from "../pages/MarketlistingDetail.svelte";
import CategoryFilter from "./CategoryFilter.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let dropdownItems = [
  {
    name: "Sort by most popular",
    sortBy: QueryAllBusinessesOrderOptions.MostPopular,
  },
  {
    name: "Sort by nearest",
    sortBy: QueryAllBusinessesOrderOptions.Nearest,
  },
  {
    name: "Sort by newest",
    sortBy: QueryAllBusinessesOrderOptions.Newest,
  },
  {
    name: "Sort by oldest",
    sortBy: QueryAllBusinessesOrderOptions.Oldest,
  },
  {
    name: "Sort by name",
    sortBy: QueryAllBusinessesOrderOptions.Alphabetical,
  },
];

type SortedByTypes = "Most popular" | "Nearest" | "Newest" | "Oldest" | "Alphabetical";
let sortedBy: SortedByTypes = "Most popular";

function filterCategoriesChange() {
  console.log("FIFIFI", $marketFilterStore);
  marketStore.reload($marketStore.orderBy, $marketFilterStore);
  console.log("MAR", marketStore);
}
</script>

<div style="visibility: hidden;" class="bg-market"></div>
<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<section class="justify-center p-2 pt-0 mx-auto text-base align-middle md:w-2/3 xl:w-1/2">
  <CategoryFilter placeholder="Filter" on:change="{filterCategoriesChange}" />
  <div class="text-right whitespace-nowrap">
    Sort by: <span class="pl-2 text-black">nearest</span>
    <span class=""><Icons icon="chevron-down" size="{4}" customClass="inline" /></span>
  </div>

  <div class="flex flex-wrap content-center mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2 justify-evenly">
    {#if $marketStore.messages.length > 0}
      {#each $marketStore.messages as message}
        <p>{message}</p>
      {/each}
    {/if}
    <slot />
  </div>
</section>
