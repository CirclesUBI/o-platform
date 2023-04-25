<script lang="ts">
import TopNav from "src/shared/atoms/TopNav.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";

export let runtimeDapp: RuntimeDapp<any>;
</script>

<TopNav runtimeDapp="{runtimeDapp}" />

<div class="flex flex-col items-stretch h-24 text-white bg-cover navbar bg-primary-dark" style="background-image: url(/images/common/nice-bg.jpg);"></div>
