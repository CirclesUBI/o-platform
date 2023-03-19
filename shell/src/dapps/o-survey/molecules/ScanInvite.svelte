<script type="ts">
import { onDestroy, onMount } from "svelte";
import { inviteUrl } from "../../o-survey/stores/surveyStore";
import Label from "../../../shared/atoms/Label.svelte";
import { Html5Qrcode } from "html5-qrcode";

let scanning = false;

let html5Qrcode;

onMount(init);

onDestroy(() => {
  stop();
});

function init() {
  html5Qrcode = new Html5Qrcode("reader");
  start();

  setTimeout(() => {
    console.log("I've waited too long for a QR-Code. Goodbye :)");
    stop();
    window.o.publishEvent({ type: "shell.requestCloseModal" });
  }, 10000);
}

function start() {
  html5Qrcode.start(
    { facingMode: "environment" },
    {
      fps: 1,
      qrbox: { width: 250, height: 250 },
    },
    onScanSuccess,
    onScanFailure
  );
  scanning = true;
}

async function stop() {
  if (!scanning)
    return;

  scanning = false;
  await html5Qrcode.stop();
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
      <main class="rounded-lg">
        <reader id="reader" class="rounded-lg"></reader>
      </main>
    </div>
  </div>
  <button class="btn btn-primary" on:click="{() => window.o.publishEvent({ type: 'shell.requestCloseModal' })}">
    <Label key="common.close" />
  </button>
</section>

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
reader {
  /* width: 100%;
  min-height: 250px;
  border-radius: 0.5rem;
  padding-top: 0.8rem; */
  width: 350px;
  border-radius: 10px;
  overflow: hidden;
}
</style>
