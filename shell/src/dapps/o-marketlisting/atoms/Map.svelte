<script>
import Map from "here-maps-svelte";
import { onMount } from "svelte";
import { Environment } from "src/shared/environment";
export let width = "100%";
export let height = "400px";
export let hereId = "here:cm:namedplace:20177269"; // TODO: REMOVE HARDCODED

let position = {};
let options;

// Grab Location Info from hereId
onMount(async () => {
  fetch(`https://lookup.search.hereapi.com/v1/lookup?id=${hereId}&apiKey=${Environment.hereApiKey}`)
    .then((response) => response.json())
    .then((data) => {
      position = data.position;
      options = {
        api: Environment.hereApiKey,
        mapdata: {
          zoom: 10,
          center: position,
        },
      };
    })
    .catch((error) => {
      // TODO: HANDLE ERROR CASE
      console.log(error);
      return [];
    });
});
</script>

{#if options}
  <div id="map" style="width:{width}; height: {height};">
    <Map options="{options}" />
  </div>
{/if}
