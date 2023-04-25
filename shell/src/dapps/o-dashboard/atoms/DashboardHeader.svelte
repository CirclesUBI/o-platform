<script lang="ts">
import { me } from "../../../shared/stores/me";
import TopNav from "../../../shared/atoms/TopNav.svelte";
import PageHeader from "../../../shared/atoms/PageHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { _ } from "svelte-i18n";
import Label from "../../../shared/atoms/Label.svelte";
$: me;

export let runtimeDapp: RuntimeDapp<any>;
let name: string = "";

$: {
  if ($me) {
    name = $me.firstName ? $me.firstName : "";
  }
}
</script>

<TopNav runtimeDapp="{runtimeDapp}" />

<PageHeader heightClass="h-28">
  <div class="self-center flex-grow text-center justify-self-start">
    <div class="text-xl">
      <h1 class="text-4xl text-white font-heading">
        <Label key="dapps.o-dashboard.atoms.dashboardHeader.welcome" />
        {name}
      </h1>
    </div>
  </div>
</PageHeader>
