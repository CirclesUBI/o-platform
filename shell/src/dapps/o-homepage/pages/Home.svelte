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

<div class="flex flex-col overflow-hidden bg-home">
  <main class="h-screen overflow-hidden">
    <TopNav runtimeDapp="{runtimeDapp}" />

    <div class="flex flex-col items-center justify-center font-heading p-8 mt-40">
      <div class="flex flex-col items-center justify-center">
        <div class="text-xl text-center uppercase text-white">Halo Komunitas Circles!</div>
        <div class="text-xl text-center uppercase text-primary mt-8 mb-8">Aplikasi Circles sekarang sedang diperbaiki!</div>
        <div class="text-xl text-center uppercase text-white">
          Jika Anda memiliki pertanyaan tentang akun CirclesUBI Anda, jangan ragu untuk menghubungi <span class="text-primary underline">community@circles.org.</span>
        </div>
      </div>
      <div class="mt-10 mb-10 border-t-2 border-white w-full"></div>
      <div class="flex flex-col items-center justify-center">
        <div class="text-xl text-center uppercase text-white">Hi Circles Community!</div>
        <div class="text-xl text-center uppercase text-primary mt-8 mb-8">The Circles App is now being improved!</div>
        <div class="text-xl text-center uppercase text-white">
          If you have any questions about your CirclesUBI account, please feel free to contact
          <span class="text-primary underline">community@circles.org.</span>
        </div>
      </div>
    </div>

    <!-- <WelcomeHeader /> -->

    <!-- <div
      id="video-overlay"
      class="relative flex items-center content-center justify-center h-screen overflow-hidden"
      style=" background-position: center; background:
  url('/images/homepage/circles-home.jpg') no-repeat top center fixed;
  -webkit-background-size: cover; -moz-background-size: cover;
  -o-background-size: cover; background-size: cover; ">
    </div> -->
  </main>
</div>
