<script lang="ts">
import { createEventDispatcher } from "svelte";
import { clickOutside } from "./../functions/clickOutside";
export let items: any;
export let key: string;
export let value: string;
export let id: string;
export let selected: string;
export let dropDownClass: string = "";
export let isButton: boolean = false;
export let isChevron: boolean = false;
export let notFull: boolean = false;
export let hideDefault: boolean = false;

const eventDispatcher = createEventDispatcher();

function handleOnChange(e) {
  eventDispatcher("dropDownChange", { target: id, value: e.target.value });
  if (isButton) {
    var elements = document.getElementsByTagName("select");
    for (var i = 0; i < elements.length; i++) {
      elements[i].selectedIndex = 0;
    }
  }
}
</script>

<select
  class="{dropDownClass}"
  class:select="{!isButton && !isChevron}"
  class:w-full="{!isButton && !isChevron && !notFull}"
  class:btn="{isButton || isChevron}"
  class:btn-xs="{isButton || isChevron}"
  class:btn-circle="{isButton || isChevron}"
  class:btn-outline="{isButton}"
  class:selectAsButton="{isButton}"
  class:border-secondary="{isButton}"
  class:selectAsChevron="{isChevron}"
  on:change="{handleOnChange}"
  use:clickOutside
  on:click_outside="{() => eventDispatcher('dropDownClickedOutside')}">
  {#if hideDefault}
    {#each items as item}
      <option class="text" value="{item[key]}">{item[value]}</option>
    {/each}
  {:else}
    <option class="text" value="{undefined}" selected>{selected}</option>

    {#each items as item}
      <option class="text" value="{item[key]}">{item[value]}</option>
    {/each}
  {/if}
</select>

<style>
.selectAsButton {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  color: transparent;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-6 h-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M12 6v12m6-6H6' /%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 1rem auto;
}
.selectAsChevron {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  color: transparent;
  background-color: transparent;
  border-color: transparent;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-6 h-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 1rem auto;
}
</style>
