<script lang="ts">
export let image;
export let size: number = 10;
export let transparent: boolean = false;

let displayName: string = "";
</script>

<div class="has-tooltip" role="presentation">
  <div class="self-center text-center rounded-md justify-self-center w-{size} " style="padding: {size >= 20 ? `4px` : `1px`}">
    <div class="relative rounded-md w-{size} h-{size} m-auto" class:bg-white="{!transparent}">
      <img class=" w-{size} h-{size} rounded-corners-purple-borders rounded-md" src="{image}" alt="{displayName}" />
    </div>
  </div>
</div>
