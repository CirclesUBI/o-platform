<script lang="ts">
import "../../../shared/css/tailwind.css";
import TopNav from "../../../shared/atoms/TopNav.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";

import WelcomeHeader from "../components/WelcomeHeader.svelte";

export let runtimeDapp: RuntimeDapp<any>;

export let inviteCode: any;

if (inviteCode) {
  localStorage.setItem("circlesInvite", inviteCode);
  window.runInitMachine();
}
</script>

<div class="flex flex-col overflow-hidden">
  <main class="h-screen overflow-hidden">
    <TopNav runtimeDapp="{runtimeDapp}" />

    <WelcomeHeader />

    <div
      id="video-overlay"
      class="relative flex items-center content-center justify-center h-screen overflow-hidden"
      style=" background-position: center; background:
  url('/images/homepage/circles-home.jpg') no-repeat top center fixed;
  -webkit-background-size: cover; -moz-background-size: cover;
  -o-background-size: cover; background-size: cover; ">
    </div>
  </main>
</div>
