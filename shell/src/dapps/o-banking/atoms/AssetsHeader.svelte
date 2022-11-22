<script lang="ts">
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";

  export let runtimeDapp:RuntimeDapp<any>;
  export let routable:Routable;
</script>

<TopNav {runtimeDapp} {routable} />

<div
  class="flex flex-col items-stretch h-24 text-white bg-cover navbar bg-primary-dark"
  style="background-image: url(/images/common/nice-bg.jpg);"></div>
