<script lang="ts">
import Label from "./Label.svelte";
import { _ } from "svelte-i18n";

export let data: {
  error: Error;
};
export let message: string;
export let allowReload: boolean = false;
let error: any;

$: {
  console.error(`An error occurred during the execution of a workflow:`, data);
  if (data && data.error) {
    console.error(data.error);
    error = data.error;
  } else {
    console.error(window.o.lastError);
    error = window.o.lastError;
  }
}
</script>

<div class="w-full p-4 my-2 text-white rounded-xl bg">
  <div class="mt-2 mb-2">
    <div>
      <div class="text-2xl font-bold text-center text-alert">
        <Label key="shared.atoms.error.processEncounteredAnError" />
      </div>
      <div class="mt-4 font-bold">{error ? error.message : ""}{message ? message : ""}</div>
    </div>
  </div>
  {#if allowReload}
    <div class="mt-4">
      <center>
        <a href="/"><button class="btn btn-primary">{$_("shared.atoms.error.reloadPage")}</button></a>
      </center>
    </div>
  {/if}
</div>
