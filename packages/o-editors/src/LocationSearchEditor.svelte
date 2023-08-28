<script lang="ts">
import ProcessNavigation from "./ProcessNavigation.svelte";
import { EditorContext } from "./editorContext";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { onMount } from "svelte";

import GoogleMapSearch from "../../../shell/src/shared/molecules/GoogleMaps/GoogleMapSearch.svelte";
import { Environment } from "../../../shell/src/shared/environment";
import { error } from "../../../shell/src/shared/stores/error";
import LoadingSpinner from "../../../shell/src/shared/atoms/LoadingSpinner.svelte";
import { DropdownSelectorContext } from "./DropdownSelectEditorContext";
import Geolocation from "svelte-geolocation";
import { mapsLoading } from "@o-platform/shell/src/shared/stores/googleMaps";
import Label from "@o-platform/shell/src/shared/atoms/Label.svelte";

export let context: DropdownSelectorContext<any, any, any>;

let disableSubmit: boolean = true;

type Location = {
  place_id: string;
  address: string;
  lat: string;
  lng: string;
};

let geolocation;
let geoLocationOptions = {
  enableHighAccuracy: true,
};
let placeholder: string = null;

let _context: EditorContext;

const options = {
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
};

let location: Location = null;
let center = {};
let locationAllowed: boolean = null;

let validAddress: boolean = false;

onMount(async () => {
  center = { lat: -8.670458, lng: 115.212631 };
  _context = context;

  if (_context && _context.data.lat) {
    placeholder = _context.data.locationName;
    center = { lat: _context.data.lat, lng: _context.data.lon };
  } else {
    if (geolocation) {
      center = { lat: geolocation.coords.latitude, lng: geolocation.coords.longitude };
    }
  }
});

$: if (location && $error !== null) {
  validAddress = true;
}

$: if (geolocation) {
  center = { lat: geolocation.coords.latitude, lng: geolocation.coords.longitude };
}

function mapRecenter({ place }) {
  location = {
    place_id: place.place_id,
    address: place.formatted_address,
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
  };

  context.editorDirtyFlags[context.field] = true;
  _context.data[context.field] = location;
  disableSubmit = false;
}

const submitHandler = () => {
  const answer = new Continue();
  answer.data = context.data;
  context.process.sendAnswer(answer);
};
</script>

{#if _context}
  <div class="flex flex-col items-end w-full m-auto text-center form-control justify-self-center sm:w-3/4">
    {#if _context.data.lat}
      <div class="w-full mb-8 section-txt h-80" id="map">
        <div class="map-wrap" data-cy="googleMap">
          <GoogleMapSearch
            apiKey="{Environment.placesApiKey}"
            on:recenter="{(e) => mapRecenter(e.detail)}"
            zoom="{17}"
            options="{options}"
            bind:center="{center}"
            placeholder="{placeholder}" />
        </div>
      </div>
    {:else}
      <Geolocation
        options="{geoLocationOptions}"
        watch="{false}"
        getPosition
        let:coords
        let:loading
        let:success
        let:error
        let:notSupported
        on:position="{(e) => {
          geolocation = e.detail;
        }}"
        on:error="{(e) => {
          console.log('POS ERROR', e.detail); // GeolocationError
        }}">
        {#if notSupported}
          <Label key="common.googlemaps.locationService.noLocationSupport" />
        {:else}
          {#if loading}
            <div class="w-full text-center">
              <span class="text-sm text-info">
                <Label key="common.googlemaps.locationService.loadingLocation" />
              </span>
              <center class="mt-4">
                <LoadingSpinner />
              </center>
            </div>
          {/if}
          {#if success}
            <div class="w-full mb-8 section-txt h-80" id="map">
              <div class="map-wrap" data-cy="googleMap">
                <GoogleMapSearch
                  apiKey="{Environment.placesApiKey}"
                  on:recenter="{(e) => mapRecenter(e.detail)}"
                  zoom="{17}"
                  options="{options}"
                  bind:center="{center}"
                  placeholder="{placeholder}" />
              </div>
            </div>
          {/if}
          {#if error}
            {#if error.code == error.PERMISSION_DENIED}
              <span class="text-sm text-center text-info">
                <Label key="common.googlemaps.locationService.locationDenied" />
              </span>
            {/if}

            <div class="w-full mb-8 section-txt h-80" id="map">
              <div class="map-wrap" data-cy="googleMap">
                <GoogleMapSearch
                  apiKey="{Environment.placesApiKey}"
                  on:recenter="{(e) => mapRecenter(e.detail)}"
                  zoom="{17}"
                  options="{options}"
                  bind:center="{center}"
                  placeholder="{placeholder}" />
              </div>
            </div>
          {/if}
        {/if}
      </Geolocation>
    {/if}
    <!-- 
  {#if locationAllowed === null}
    Please allow
  {:else if locationAllowed === false}
    <div class="w-full mb-8 section-txt h-80" id="map">
      <div class="map-wrap">
        <GoogleMapSearch
          apiKey="{Environment.placesApiKey}"
          on:recenter="{(e) => mapRecenter(e.detail)}"
          zoom="{17}"
          options="{options}"
          bind:center="{center}"
          placeholder="{placeholder}" />
      </div>
    </div>
  {:else if locationAllowed === true}
    {#if geolocation}
      <div class="w-full mb-8 section-txt h-80" id="map">
        <div class="map-wrap">
          <GoogleMapSearch
            apiKey="{Environment.placesApiKey}"
            on:recenter="{(e) => mapRecenter(e.detail)}"
            zoom="{17}"
            options="{options}"
            bind:center="{center}"
            placeholder="{placeholder}" />
        </div>
      </div>
    {:else}
      Loading...
    {/if}
  {/if} -->

    <!--   
  {#if context.messages[context.field]}
    <label class="text-right label" for="form-error">
      <span id="form-error" class="label-text-alt text-error">{context.messages[context.field]}</span>
    </label>
  {/if} -->

    <ProcessNavigation on:buttonClick="{submitHandler}" context="{context}" isDisabled="{disableSubmit}" />
  </div>
{/if}

<style>
.map-wrap {
  width: 100%;
  height: 300px;
}
</style>
