<script lang="ts">
import { createEventDispatcher } from "svelte";

export let items: any;
export let key: string;
export let value: string;
export let id: string;
export let selected: string;

const dispatch = createEventDispatcher();

function handleOnChange(e) {
  console.log(e.target.value);
  dispatch("dropDownChange", { target: id, value: e.target.value });
}
</script>

<select class="w-full max-w-xs mt-2 text-base select" on:change="{handleOnChange}">
  <option value="{undefined}" selected>{selected}</option>
  {#each items as item}
    <option value="{item[key]}">{item[value]}</option>
  {/each}
</select>
