<script lang="ts">
import Label from "./Label.svelte";
export let headerTextStringKey: string = "";
</script>

<section role="presentation">
  <div class="w-full bg-white border cardborder">
    <div class="w-full h-10 px-4 py-2 text-center text-white bg-cpurple rounded-t-xl border-bordergray">
      <Label key="{headerTextStringKey}" />
    </div>
    <div class="p-4">
      <slot name="standardHeaderBoxContent" />
    </div>
  </div>
</section>
