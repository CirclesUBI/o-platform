<script lang="ts">
import Label from "./Label.svelte";

export let heading: string = "";
</script>

<header>
  <div class="w-full pt-6">
    <h1 class="text-3xl text-center uppercase text-heading font-heading">
      <Label key="{heading}" />
    </h1>
  </div>
</header>
