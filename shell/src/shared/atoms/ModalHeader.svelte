<script lang="ts">
import { createEventDispatcher } from "svelte";
import Label from "./Label.svelte";

export let heading: string = "";

const dispatch = createEventDispatcher();
const onClose = () => window.o.publishEvent({ type: "shell.closeModal" });
</script>

<header>
  <div class="h-1 m-auto mt-2 rounded-full cursor-pointer w-14 bg-slate-500" on:click="{onClose}"></div>
  <div class="w-full pt-6">
    <h1 class="text-3xl text-center uppercase font-heading">
      <Label key="{heading}" />
    </h1>
  </div>
</header>
