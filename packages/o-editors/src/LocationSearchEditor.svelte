<script lang="ts">
import ProcessNavigation from "./ProcessNavigation.svelte";
import { EditorContext } from "./editorContext";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { onMount } from "svelte";

import GoogleMapSearch from "../../../shell/src/shared/molecules/GoogleMaps/GoogleMapSearch.svelte";
import { Environment } from "../../../shell/src/shared/environment";
import { error } from "../../../shell/src/shared/stores/error";
import { DropdownSelectorContext } from "./DropdownSelectEditorContext";
/*
 * allow arbitrary values in dropdownselecteditor
 * allow to add new tags in dropdownselecteditor
 * add a "most-recent" list to the dropdownselecteditor
 */

// export let context: EditorContext;

export let context: DropdownSelectorContext<any, any, any>;

let disableSubmit: boolean = true;

type Location = {
  place_id: string;
  address: string;
  lat: string;
  lng: string;
};

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

let validAddress: boolean = false;
$: {
  _context = context;
}

onMount(async () => {
  center = { lat: -8.670458, lng: 115.212631 };
  // TODO ADD $mylocation Navigator geolocation and set center to that. only works in https.
});

$: if (location && $error !== null) {
  validAddress = true;
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

<div class="flex flex-col items-end w-full m-auto form-control justify-self-center sm:w-3/4">
  <div class="w-full mb-8 section-txt h-80" id="map">
    <div class="map-wrap">
      <GoogleMapSearch apiKey="{Environment.placesApiKey}" on:recenter="{(e) => mapRecenter(e.detail)}" zoom="{17}" options="{options}" center="{center}" />
    </div>
  </div>

  <!--   
  {#if context.messages[context.field]}
    <label class="text-right label" for="form-error">
      <span id="form-error" class="label-text-alt text-error">{context.messages[context.field]}</span>
    </label>
  {/if} -->

  <ProcessNavigation on:buttonClick="{submitHandler}" context="{context}" isDisabled="{disableSubmit}" />
</div>

<style>
.map-wrap {
  width: 100%;
  height: 300px;
}
</style>
