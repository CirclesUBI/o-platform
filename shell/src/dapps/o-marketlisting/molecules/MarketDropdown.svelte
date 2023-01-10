<script lang="ts">
import { marketStore } from "../stores/marketStore";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";

export let dropdownItems: string[];

let opened: boolean = false;
</script>

<div class="w-40 dropdown">
  <button
    class="text-black bg-white btn w-40 border-1"
    on:click="{() => {
      opened = !opened;
    }}"><span><Icon name="chevron-down" class="w-6 h-6" /></span>{$marketStore.orderBy}</button>
  {#if opened}
    <ul class="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52">
      {#each dropdownItems as item}
        <li>
          <button class="block w-full">
            {item}
          </button>
        </li>
      {/each}
      <!--<li>
      <button
        class="block w-full"
        on:click="{() => {
          sortedBy = 'Most popular';
          marketStore.reload(QueryAllBusinessesOrderOptions.MostPopular, $marketFilterStore);
        }}"
        >Sort by most popular
      </button>
    </li>
    <li>
      <button
        class="block w-full"
        on:click="{() => {
          sortedBy = 'Nearest';
          marketStore.reload(QueryAllBusinessesOrderOptions.Nearest, $marketFilterStore);
        }}"
        >Sort by nearest
      </button>
    </li>
    <li>
      <button
        class="block w-full"
        on:click="{() => {
          sortedBy = 'Newest';
          marketStore.reload(QueryAllBusinessesOrderOptions.Newest, $marketFilterStore);
        }}"
        >Sort by newest
      </button>
    </li>
    <li>
      <button
        class="block w-full"
        on:click="{() => {
          sortedBy = 'Oldest';
          marketStore.reload(QueryAllBusinessesOrderOptions.Oldest, $marketFilterStore);
        }}"
        >Sort by oldest
      </button>
    </li>
    <li>
      <button
        class="block w-full"
        on:click="{() => {
          sortedBy = 'Alphabetical';
          marketStore.reload(QueryAllBusinessesOrderOptions.Alphabetical, $marketFilterStore);
        }}"
        >Sort by name
      </button>
    </li>-->
    </ul>
  {/if}
</div>
