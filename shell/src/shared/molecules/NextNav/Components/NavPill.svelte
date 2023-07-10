<script lang="ts">
import Icons from "../../Icons.svelte";
import { unreadEventInbox } from "../../../stores/inbox";

export let props;

function clickHandler() {
  if (props && props.left) {
    props.left.props.action();
  }
}
</script>

<div class="h-12 col-start-2 place-self-center">
  <div class="flex flex-row">
    <div
      class="flex justify-center flex-shrink-0 w-24 -mr-8 rounded-l-full cursor-pointer text-primary h-11"
      class:bg-cpurple="{props && props.left}"
      role="presentation"
      on:click="{clickHandler}">
      {#if props && props.left}
        {#if $unreadEventInbox.events.length > 0 && props.center.props.icon !== "close"}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div class="relative self-center mr-2 text-primary" on:click="{clickHandler}">
            <Icons icon="bell" size="{10}" solid="{true}" customClass="mt-1" />
            <div class="absolute right-0.5 w-full text-center top-1.5 text-secondary font-heading">{$unreadEventInbox.events.length}</div>
          </div>
        {:else}
          <div class="flex flex-col self-center justify-center h-full mr-3">
            <svelte:component this="{props.left.component}" {...props.left.props} on:menuButton />
          </div>
        {/if}
      {/if}
    </div>

    <div class="z-50 flex-shrink-0 w-16 col-start-2 mt-3 ml-1 cursor-pointer">
      {#if props && props.center}
        <svelte:component this="{props.center.component}" {...props.center.props} on:actionButton />
      {/if}
    </div>

    <div
      class="flex justify-center flex-shrink-0 w-20 -ml-8 rounded-r-full cursor-pointer h-11"
      class:bg-cpurple="{props && props.right}"
      role="presentation"
      on:click="{props.right ? props.right.props.action : null}">
      {#if props && props.right}
        <div class="flex flex-col self-center justify-center h-full ml-3 text-primary">
          <svelte:component this="{props.right.component}" {...props.right.props} />
        </div>
      {/if}
    </div>
  </div>
</div>
