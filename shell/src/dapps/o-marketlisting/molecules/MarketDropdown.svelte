<script lang="ts">
import { marketStore } from "../stores/marketStore";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import { fade } from "svelte/transition";

export let dropdownItems: string[];

let opened: boolean = false;
</script>

<div class="w-40 flex">
  <div class="relative">
    <button class="text-black bg-white btn w-40 border-1 peer">Dropdown</button>
    <div
      class="w-52 absolute top-5 z-10
		after:content-[''] after:inline-block after:absolute after:top-0 after:bg-white
		after:w-full after:h-full after:-z-20 after:rounded-lg
    peer-focus:top-12 peer-focus:opacity-100 peer-focus:visible 
    transition-all duration-20 invisible  opacity-0 
    ">
      <ul class="p-2 shadow menu bg-base-100 rounded-box w-52">
        <li class="cursor-pointer p-3 rounded-md hover:bg-gray-400">Eat an apple a day</li>
        <li class="cursor-pointer p-3 rounded-md hover:bg-gray-400">Eat an apple a day</li>
        <li class="cursor-pointer p-3 rounded-md hover:bg-gray-400">Eat an apple a day</li>
        <li class="cursor-pointer p-3 rounded-md hover:bg-gray-400">Eat an apple a day</li>
        <li class="cursor-pointer p-3 rounded-md hover:bg-gray-400">Eat an apple a day</li>
      </ul>
    </div>
  </div>
</div>

<!--<div class="w-40">
  <button class="text-black bg-white btn w-40 border-1"
    ><span><Icon name="chevron-down" class="w-6 h-6" /></span>{$marketStore.orderBy}</button>

  <ul in:fade="{{ duration: 80 }}" class="p-2 shadow absolute z-50 menu bg-base-100 rounded-box w-52">
    {#each dropdownItems as item}
      <li>
        <button class="block w-full">
          {item}
        </button>
      </li>
    {/each}
    <li>
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
      </li>
  </ul>
</div>-->
