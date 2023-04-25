<script lang="ts">
import TopNav from "src/shared/atoms/TopNav.svelte";
import PageHeader from "src/shared/atoms/PageHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";

export let runtimeDapp: RuntimeDapp<any>;
</script>

<TopNav runtimeDapp="{runtimeDapp}" />

<PageHeader heightClass="h-8 " />
