<script lang="ts">
import Icons from "../molecules/Icons.svelte";
import Label from "./Label.svelte";
import { media } from "../stores/media";
export let title: string = null;
export let icon: string = null;
export let size: number = 8;
export let colorClass: string = "";
export let customClass: string = "inline";
export let isListItem: boolean = false;

let iconsize: number = size;
if ($media.small) {
  iconsize = 6;
}
</script>

{#if !isListItem}
  <div class="h-12 text-center align-top list-none cursor-pointer text-secondary inline-table" role="presentation" on:click>
    <span>
      <span class="table-cell w-12 h-12 align-middle rounded-full {colorClass} {customClass} bg-light-light">
        <Icons icon="{icon}" customClass="w-{size} h-{size} heroicon smallicon inline" />
      </span>
      <span class="block w-20 text-xs sm:text-sm mt-1 text-center break-normal {colorClass}">
        <Label key="{title}" />
        <!-- {title} -->
      </span>
    </span>
  </div>
{:else}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <span class="flex content-center justify-start space-x-2 cursor-pointer" on:click>
    <div class="flex flex-row items-center mt-2 rounded-full" class:text-lg="{$media.small}" class:text-md="{!$media.small}">
      {#if icon}
        <span class="pl-1 {colorClass} {customClass}">
          <Icons icon="{icon}" size="{iconsize}" />
        </span>
      {/if}
      <span class="px-2">
        <Label key="{title}" />
      </span>
    </div>
  </span>
{/if}
