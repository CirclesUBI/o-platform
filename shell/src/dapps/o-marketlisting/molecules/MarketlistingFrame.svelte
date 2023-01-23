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

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let dropdownItems: string[] = [
  "Sort by most popular",
  "Sort by nearest",
  "Sort by newest",
  "Sort by oldest",
  "Sort by name",
];

type SortedByTypes = "Most popular" | "Nearest" | "Newest" | "Oldest" | "Alphabetical";
let sortedBy: SortedByTypes = "Most popular";

function filterCategoriesChange(event: any & { detail: BusinessCategory[] }) {
  $marketFilterStore = event.detail.map((o) => o.id);
  marketStore.reload($marketStore.orderBy, $marketFilterStore);
  console.log("MAR", marketStore);
}
</script>

<div style="visibility: hidden;" class="bg-market"></div>
<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<section class="justify-center p-4 pt-0 mx-auto text-base align-middle md:w-2/3 xl:w-1/2">
  <div class="mb-4">
    Filter:
    <div class="mr-2 text-xs badge badge-outline">
      Farm/Garden <span class="pl-2 text-cpurple"><Icons icon="closex" size="{2}" /></span>
    </div>
    <div class="mr-2 text-xs badge badge-outline whitespace-nowrap">
      Health Services <span class="pl-2 text-cpurple"><Icons icon="closex" size="{2}" /></span>
    </div>
    <button class="btn btn-xs btn-circle btn-outline">+</button>
  </div>
  <div class="text-right whitespace-nowrap">
    Sort by: <span class="pl-2 text-black">nearest</span>
    <span class=""><Icons icon="chevron-down" size="{4}" customClass="inline" /></span>
  </div>

  <div class="flex flex-wrap content-center p-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2 justify-evenly">
    {#if $marketStore.messages.length > 0}
      {#each $marketStore.messages as message}
        <p>{message}</p>
      {/each}
    {/if}
    <slot />
  </div>
</section>
