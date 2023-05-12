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
  window.location.reload();
}
</script>

<div class="locale-selector">
  <div class="">
    <select class="relative bg-transparent -top-3 sm:-top-1 select select-xs" value="{value}" on:change="{handleLocaleChange}">
      <option value="en">EN</option>
      <option value="id">ID</option>
    </select>
  </div>
</div>
