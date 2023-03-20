<script>
import { createEventDispatcher } from "svelte";
import { Environment } from "../../shared/environment";

export let value = Environment.userLanguage || "en";

const dispatch = createEventDispatcher();
function handleLocaleChange(event) {
  event.preventDefault();
  localStorage.setItem("userLanguage", event.target.value);
  Environment.userLanguage = event.target.value;
  dispatch("locale-changed", event.target.value);
}
</script>

<div class="text-base locale-selector">
  <div class="">
    <select class="relative -top-3 sm:-top-1 select select-sm" value="{value}" on:change="{handleLocaleChange}">
      <option value="en">English</option>
      <option value="id">Bahasa Indonesia</option>
    </select>
  </div>
</div>
