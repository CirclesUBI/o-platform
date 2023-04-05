<script lang="ts">
import Icons from "../../../shared/molecules/Icons.svelte";
import { push } from "svelte-spa-router";
import Label from "../../../shared/atoms/Label.svelte";

export let color: string;
export let link: string;
export let blobshape: string;
export let icon: string;
export let title: string;

function loadLink(alink, external = false) {
  if (external) {
    window.open(alink, "_blank").focus();
  } else {
    push(alink);
  }
}
</script>

<section
  class="relative items-center justify-center h-20 overflow-hidden shadow-md cursor-pointer rounded-xl dashboard-card "
  class:bg-contacts="{color == 'contacts'}"
  class:bg-banking="{color == 'banking'}"
  class:bg-passport="{color == 'passport'}"
  class:bg-marketplace="{color == 'marketplace'}"
  role="presentation"
  on:click="{() => loadLink(link)}">
  <div class="absolute z-50 flex flex-row items-center h-20 pl-4">
    <div class="text-2xl text-white sm:text-3xl font-heading">
      <Label key="{title}" />
    </div>
  </div>
  <div
    class="z-10 blob "
    style="border-radius: {blobshape}"
    class:bg-contacts-light="{color == 'contacts'}"
    class:bg-banking-light="{color == 'banking'}"
    class:bg-passport-light="{color == 'passport'}"
    class:bg-marketplace-light="{color == 'marketplace'}">
    <div class="text-white ">
      <!-- <Icons icon="dashpassport" /> -->
      <Icons icon="{icon}" size="{10}" customClass="relative w-12 h-12 left-32 heroicon top-11" solid="{true}" />
    </div>
  </div>
</section>

<style>
.blob {
  position: absolute;
  right: -30px;
  top: -30px;
  width: 250px;
  height: 130px;
}
</style>
