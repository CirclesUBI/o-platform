<script lang="ts">
import Icons from "./Icons.svelte";
import { createEventDispatcher } from "svelte";
import ActionListItem from "../atoms/ActionListItem.svelte";
import { Environment } from "../environment";
import Label from "../atoms/Label.svelte";
export let actions: {
  key: string;
  icon: string;
  title: string;
  colorClass: string;
  action: () => void;
}[];

const dispatch = createEventDispatcher();

function handleClick(action) {
  if (action.event) {
    window.o.publishEvent(action.event);
  }
  if (action.action) {
    action.action();
  }
}
</script>

{#if actions}
  {#each actions as action}
    <ActionListItem icon="{action.icon}" title="{action.title}" colorClass="{action.colorClass}" on:click="{() => handleClick(action)}" />
  {/each}

  {#if Environment.showLanguageSwitcher}
    <div class="text-center align-top list-none cursor-pointer inline-table text-secondary" role="presentation" on:click="{() => dispatch('siwtchEvent')}">
      <span>
        <span class="table-cell w-12 h-12 align-middle rounded-full bg-light-light">
          <Icons icon="settings" size="{8}" customClass="heroicon smallicon inline" />
        </span>

        <span class="block w-24 mt-1 text-xs text-center break-normal sm:text-sm">
          <Label key="dapps.common.quickactions.changeLanguage" />
        </span>
      </span>
    </div>
  {/if}
{/if}
