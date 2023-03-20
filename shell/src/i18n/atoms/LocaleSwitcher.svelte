<script>
import { createEventDispatcher } from "svelte";
export let value = "en";
const dispatch = createEventDispatcher();
function handleLocaleChange(event) {
  event.preventDefault();
  dispatch("locale-changed", event.target.value);
}
</script>

<div class="text-base locale-selector">
  <div class="">
    <select class="-mt-1 select select-sm" value="{value}" on:change="{handleLocaleChange}">
      <option value="en">English</option>
      <option value="id">Bahasa Indonesia</option>
    </select>
  </div>
</div>
