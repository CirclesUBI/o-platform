<script lang="ts">
export let heightClass: string = "h-56";
export let color: string = "";
export let largeHeader: boolean = false;
</script>

<header
  class="grid place-content-center text-white bg-cover {heightClass}
  w-full {color}"
  style="border-radius: 0px 0px 115% 118% / 70% 16% 36% 20%">
  <slot />
</header>
