<script lang="ts">
import NavItem from "../atoms/NavItem.svelte";

export let isOpen: boolean;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  on:click="{() => {
    isOpen = false;
  }}">
  <NavItem />
</div>
