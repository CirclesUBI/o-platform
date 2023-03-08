<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";

import { onMount } from "svelte";
import { Environment } from "../../../shared/environment";

import { _ } from "svelte-i18n";

import GoogleMapSearch from "../../../shared/molecules/GoogleMaps/GoogleMapSearch.svelte";
import { myLocation } from "../../../shared/stores/myLocation";
import { error } from "../../../shared/stores/error";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

const options = {
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: false,
  fullscreenControl: false,
};

let location: any = null;
let center = {};

let validAddress: boolean = false;

onMount(async () => {
  center = { lat: -8.670458, lng: 115.212631 };
  // TODO ADD $mylocation Navigator geolocation and set center to that. only works in https.
});

$: if (location && $error !== null) {
  validAddress = true;
}

function mapRecenter({ place }) {
  location = place;
  console.log("Location: ", place);
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="p-4 pt-10 pb-20 mx-auto md:w-2/3 xl:w-1/2">
  <div class="w-full section-txt h-96" id="map">
    <div class="map-wrap">
      <GoogleMapSearch apiKey="{Environment.placesApiKey}" on:recenter="{(e) => mapRecenter(e.detail)}" zoom="{17}" options="{options}" center="{center}" />
    </div>
  </div>
  <div>
    {#if $error !== null}
      <center><div class="mb-2 text-center text-white alert alert-error">{$error}</div></center>
    {:else}
      <button class="btn btn-primary btn-block" disabled="{validAddress !== true}">Save Address</button>
    {/if}
  </div>
</div>

<style>
:global(.autocomplete-list-item.selected .customItem) {
  @apply border-primary;
}

.map-wrap {
  width: 100%;
  height: 300px;
}
</style>
