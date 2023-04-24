<script lang="ts">
import { me } from "../stores/me";
import Icons from "./Icons.svelte";
import { createEventDispatcher } from "svelte";
import { Environment } from "../environment";
import UserImage from "../atoms/UserImage.svelte";
import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
import Label from "../atoms/Label.svelte";
export let actions: JumplistItem[] = [];

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
    {#if action.profile}
      {#if action.profile.id !== ($me ? $me.id : 0)}
        <div class="text-center align-top list-none cursor-pointer text-dark inline-table" role="presentation" on:click="{() => handleClick(action)}">
          <center>
            <UserImage profile="{action.profile}" size="{12}" profileLink="{false}" />
          </center>
          <span class="block w-24 mt-1 text-xs text-center break-normal sm:text-sm">
            <Label key="shared.molecules.profileSwitcherBar.switchTo" /><br />
            {action.title ? (action.title.length >= 18 ? action.title.slice(0, 18) + "..." : action.title) : ""}
          </span>
        </div>
      {/if}
    {/if}
  {/each}
{/if}
