<script lang="ts">
import Label from "./Label.svelte";

export let data: {
  error: Error;
};

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

<div class="w-full bg-white rounded-lg">
  <div class="mt-2 mb-2 alert alert-error">
    <div class="flex-1">
      <span class="text-white"
        ><h4 class="pb-2"><strong><Label key="shared.atoms.error.processEncounteredAnError" /></strong></h4>
        <span>{error?.message}</span>
      </span>
      <br />
    </div>
  </div>
  <div class="mt-4">
    <center>
      <a href="/"><button class="btn btn-primary">Reload Page</button></a>
    </center>
  </div>
</div>
