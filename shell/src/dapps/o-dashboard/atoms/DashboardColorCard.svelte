<script lang="ts">
import Icons from "../../../shared/molecules/Icons.svelte";
import { push } from "svelte-spa-router";
import { _ } from "src/i18n/i18n";
import { isMobile } from "../../../shared/functions/isMobile";

export let color: string;
export let link: string;
export let blobshape: string;
export let icon: string;
export let title: string;

let textCutoff = isMobile() ? 20 : 30;

function loadLink(alink, external = false) {
  if (external) {
    window.open(alink, "_blank").focus();
  } else {
    push(alink);
  }
}

let titleString = $_(title);
if (titleString.length > textCutoff) {
  titleString = titleString.slice(0, textCutoff) + "...";
}
</script>

<section
  class="relative items-center justify-center h-20 overflow-hidden rounded-xl shadow-md cursor-pointer bg-{color} dashboard-card"
  role="presentation"
  on:click="{() => loadLink(link)}">
  <div class="absolute z-50 flex flex-row items-center h-20 pl-4">
    <div class="text-2xl text-white sm:text-3xl font-heading">
      {titleString}
    </div>
  </div>
  <div class="blob bg-{color}-light z-10" style="border-radius: {blobshape}">
    <div class="text-white ">
      <!-- <Icons icon="dashpassport" /> -->
      <Icons icon="{icon}" customClass="relative w-12 h-12 left-32 heroicon top-12" solid="{true}" />
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
