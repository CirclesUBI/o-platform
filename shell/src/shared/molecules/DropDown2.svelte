<script context="module" lang="ts">
    export interface DropDownBehavior<TITem> {
      isRequired: boolean
      clearSelectionLabel?: string
      getItems:() => Promise<TITem[]>
      getLabel:() => string
      getItemLabel:(item:TITem) => string
      getItemKey:(item:TITem) => string
      isSelected:(item:TITem) => boolean
      select:(item:TITem) => boolean
    }
</script>
<script lang="ts">
  import {onMount} from "svelte";
  import {_} from "svelte-i18n";

  export let behavior:DropDownBehavior<any>;
  export let width: number = 36;

  let items: any[] = undefined;

  onMount(async () => {
    items = await behavior.getItems();
  });
</script>
<div class="w-{width} dropdown">
    <button class="text-black bg-white btn w-{width} border-1">
        {!items ? $_("common.loading") : behavior.getLabel()}
    </button>
    <ul class="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52">
        {#if items}
            {#if !behavior.isRequired}
                <li>
                    <button class="block w-full" on:click="{() => behavior.select(undefined)}">
                        {behavior.clearSelectionLabel ?? $_("common.none")}
                    </button>
                </li>
                <li class="border-t"></li>
            {/if}
            {#each items as item}
                <li>
                    {#if behavior.isSelected(item)}
                        <button class="block w-full" on:click="{() => behavior.select(item)}">
                            ✓ {behavior.getItemLabel(item)}
                        </button>
                    {:else}
                        <button class="block w-full" on:click="{() => behavior.select(item)}">
                            {behavior.getItemLabel(item)}
                        </button>
                    {/if}
                </li>
            {/each}
        {:else}
            <li>
                {$_("common.loading")}
            </li>
        {/if}
    </ul>
</div>