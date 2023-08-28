<script type="ts">
import loader from "@beyonk/async-script-loader";
import { onMount, createEventDispatcher } from "svelte";
import { mapsLoaded, mapsLoading } from "../../stores/googleMaps";

const dispatch = createEventDispatcher();
export let apiKey;

$: $mapsLoaded && dispatch("ready");
onMount(() => {
  window.byGmapsReady = () => {
    mapsLoaded.set(true);
    delete window.byGmapsReady;
  };
  if ($mapsLoaded) {
    dispatch("ready");
  }
  if (!$mapsLoading) {
    const url = ["//maps.googleapis.com/maps/api/js?", apiKey ? `key=${apiKey}&` : "", "libraries=places&callback=byGmapsReady"].join("");
    mapsLoading.set(true);
    loader(
      [{ type: "script", url }],
      () => {
        return $mapsLoaded;
      },
      () => {}
    );
  }
});
</script>

{#if $mapsLoaded}
  <span data-cy="googleMap"></span>
{/if}
