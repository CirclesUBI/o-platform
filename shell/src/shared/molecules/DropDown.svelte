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

const eventDispatcher = createEventDispatcher();

function handleOnChange(e) {
  eventDispatcher("dropDownChange", { target: id, value: e.target.value });
}
</script>

<select
  class="text-base {dropDownClass}"
  class:select="{!isButton}"
  class:btn="{isButton}"
  class:btn-xs="{isButton}"
  class:btn-circle="{isButton}"
  class:btn-outline="{isButton}"
  class:selectAsButton="{isButton}"
  class:border-secondary="{isButton}"
  on:change="{handleOnChange}"
  use:clickOutside
  on:click_outside="{() => eventDispatcher('dropDownClickedOutside')}">
  <option value="{undefined}" selected>{selected}</option>
  {#each items as item}
    <option value="{item[key]}">{item[value]}</option>
  {/each}
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
</style>
