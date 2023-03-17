<script type="ts">
import { onDestroy, onMount } from "svelte";
import { inviteUrl } from "../../o-survey/stores/surveyStore";
import Label from "../../../shared/atoms/Label.svelte";
import { Html5Qrcode } from "html5-qrcode";

import { error } from "../../../shared/stores/error";
import { _ } from "svelte-i18n";

let scanning = false;

let html5Qrcode;

onMount(init);

onDestroy(() => {
  stop();
});

function init() {
  html5Qrcode = new Html5Qrcode("reader");
  start();
}

function start() {
  html5Qrcode.start(
    { facingMode: "environment" },
    {
      fps: 5,
      qrbox: { width: 250, height: 250 },
    },
    onScanSuccess,
    onScanFailure
  );
  scanning = true;
}

async function stop() {
  await html5Qrcode.stop();
  scanning = false;
}

function onScanSuccess(decodedText, decodedResult) {
  stop();

  $inviteUrl = decodedText;
  sessionStorage.setItem("inviteUrl", decodedText);
  window.o.publishEvent({ type: "shell.requestCloseModal" });
}

function onScanFailure(error) {
  console.warn(`Waiting for QR Code...`);
}
</script>

<section class="flex flex-col items-center justify-center p-6 space-y-4">
  <div class="w-full text-center">
    <h1 class="text-3xl uppercase font-heading">
      <Label key="dapps.o-homepage.molecules.scanInvite.heading" />
    </h1>
  </div>

  <div class="w-full">
    <div id="video-container" class="default-style">
      <main>
        <reader id="reader"></reader>
      </main>
    </div>
  </div>
</section>

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  @apply rounded-lg;
}
reader {
  width: 100%;
  min-height: 250px;
  background-color: black;
  @apply rounded-lg;
}
</style>
