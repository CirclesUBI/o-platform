<script lang="ts">
import { onMount } from "svelte";

import Icon from "@krowten/svelte-heroicons/Icon.svelte";

export let image: string;
export let description: string;
export let name: string;
export let id: number;

let outlineState: boolean = false;



onMount(async () => {});
</script>

<section class="flex-row w-[50%] h-[50%] p-1">
  <div class="relative">
    <img src="{image}" alt="picture of the business" class="rounded-3xl h-full w-full" />
    <div
      on:click="{() => {
        outlineState = !outlineState;
        console.log(outlineState);
      }}">
      {#if outlineState}
        <Icon name="heart" class="w-10 h-10 absolute top-[10%] right-[10%] text-yellow" solid />
      {:else}
        <Icon name="heart" class="w-10 h-10 absolute top-[10%] right-[10%] text-yellow" outline />
      {/if}
    </div>
  </div>
  <div class="font-bold">{name}</div>
  <div class="flex-wrap">{description}</div>
</section>
