<script>
  import Map from "here-maps-svelte";
  import { onMount } from "svelte";
  import { Environment } from "src/shared/environment";

  export let width = "100%";
  export let height = "400px";
  export let position = {};

  let options;

  onMount(() => {
    options = {
      api: Environment.hereApiKey,
      mapdata: {
        zoom: 10,
        center: { lat: position.lat, lng: position.long },
      },
    };
  });
</script>

{#if options}
  <div id="map" style="width:{width}; height: {height};">
    <Map options="{options}" />
  </div>
{/if}
