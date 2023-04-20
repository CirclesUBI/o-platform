<script type="ts">
import GoogleSdk from "./GoogleSdk.svelte";
import { createEventDispatcher, setContext, onMount } from "svelte";
import { error } from "../../../shared/stores/error";
import { key } from "./context";

setContext(key, {
  getMap: () => map,
  getGoogleMap: () => mapElement,
});
const dispatch = createEventDispatcher();
export let apiKey;
export let center = null;
export let zoom = 8;
export let options = {};
export let placeholder: string;

export function getDomBounds() {
  return mapElement.getBoundingClientRect();
}

export function getDefaultView() {
  return mapElement.ownerDocument.defaultView;
}

export function setHeight(height) {
  mapElement.style.height = height;
}

export function setMaxHeight(height) {
  mapElement.style.maxHeight = height;
}

export function setCentre(location) {
  map.setCenter(location);
}

$: {
  if (center && map) {
    map.setCenter(center);
  }
}
let mapElement;
let map;
let markers: any[] = [];
let infowindow = null;
let infowindowContent: HTMLElement = null;
let input: HTMLInputElement = null;
let google: any = null;
let currentPlaceName: string = null;
let currentPlaceAddress: string = null;
let inputText = "";

onMount(() => {
  input = document.getElementById("pacInput") as HTMLInputElement;

  placeholder = placeholder ? placeholder : "Enter a location or drop Pin";
});

// Adds a marker to the map and push to the array.
function addMarker(map: google.maps.Map, place: google.maps.Place, customInfoWindow: boolean = true) {
  deleteMarkers();

  const marker = new google.maps.Marker({
    map,
    animation: google.maps.Animation.DROP,
  });

  marker.addListener("click", () => {
    infowindow.close();
    infowindow.open(map, marker);
  });

  // Set the position of the marker using the place ID and location.
  // @ts-ignore This should be in @typings/googlemaps.
  marker.setPlace({
    placeId: place.place_id,
    location: place.geometry.location,
  });

  marker.setVisible(true);
  markers.push(marker);
  currentPlaceName = place.name;
  let addressArray = place.formatted_address.split(",");

  if (currentPlaceName) {
    addressArray.pop();
  }

  currentPlaceAddress = addressArray.join("<br/>");

  if (customInfoWindow) {
    infowindow.open(map, marker);
  }
}

// Sets the map on all markers in the array.
function setMapOnAll(map: google.maps.Map | null) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function hideMarkers(): void {
  setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers(): void {
  hideMarkers();
  markers = [];
}

function placeChanged(map, place, customInfoWindow = true) {
  error.set(null);

  if (!place.geometry || !place.geometry.location) {
    error.set("Invalid location.");
    return;
  }

  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
  } else {
    map.setCenter(place.geometry.location);
    map.setZoom(17);
  }

  // Replace Plus code...

  if (place.address_components) {
    let plusCode = place.address_components.find((o) => o.types[0] === "plus_code")?.long_name;

    place.formatted_address = place.formatted_address.replace(plusCode, "");
  }
  placeholder = place.formatted_address;

  addMarker(map, place, customInfoWindow);

  dispatch("recenter", { place });
}

function initialise() {
  setTimeout(() => {
    google = window.google;

    map = new google.maps.Map(
      mapElement,
      Object.assign(
        {
          center,
          zoom,
        },
        options
      )
    );
    const geocoderService = new google.maps.Geocoder();
    const placesService = new google.maps.places.PlacesService(map);

    setPlaceByCoords(map.center, geocoderService);
    // placeChanged(map, placesService.place);

    google.maps.event.addListener(map, "click", function (event) {
      if (!event.placeId) {
        // ONLY FIRE THIS IF NO PLACE IS SELECTED. This is important otherwise we will generate unneccessary cost in calling the geocoding api....
        setPlaceByCoords(event.latLng, geocoderService);
      } else {
        // This is triggered when the user clicks on a POI Marker. then we have to get the details from the placesService.
        placesService.getDetails(
          {
            placeId: event.placeId,
          },
          function (place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              if (place) {
                placeChanged(map, place, false);
              }
            }
          }
        );
      }
    });

    const autocomplete = new google.maps.places.Autocomplete(input, {
      fields: ["place_id", "geometry", "formatted_address", "name"],
      types: ["establishment"],
    });

    autocomplete.bindTo("bounds", map);

    // We have to set this manually in this case.
    infowindow = new google.maps.InfoWindow({
      maxWidth: 420,
    });
    infowindow.setContent(infowindowContent);

    autocomplete.addListener("place_changed", () => {
      infowindow.close();

      // TODO: IF THERE IS NO PLACE, GET IT VIA PLACES SERVICE....
      const place = autocomplete.getPlace();

      placeChanged(map, place);
    });

    dispatch("ready");
  }, 1);
}

function setPlaceByCoords(latLng, geocoderService) {
  geocoderService.geocode(
    {
      latLng: latLng,
    },
    function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          placeChanged(map, results[0]);
        }
      } else {
        error.set("Invalid location.");
      }
    }
  );
}
</script>

<GoogleSdk apiKey="{apiKey}" on:ready="{initialise}" />
<div style="">
  <input
    id="pacInput"
    class="w-full text-sm controls form-control input input-bordered"
    type="text"
    bind:value="{inputText}"
    on:focus="{() => (inputText = '')}"
    placeholder="{placeholder}" />
</div>
<div class="mt-2 rounded-md map" bind:this="{mapElement}">
  {#if map}
    <slot />
  {/if}
</div>
<div class="infowindowWrapper">
  <div id="infowindowContent" class="address" bind:this="{infowindowContent}">
    {#if currentPlaceName}
      <div id="placeName" class="font-bold address-line title">{currentPlaceName}</div>
    {/if}
    {#if currentPlaceAddress}
      <div id="placeAddress" class="address-line">{@html currentPlaceAddress}</div>
    {/if}
  </div>
</div>

<style>
:global(.gm-style .gm-style-iw-c) {
  max-width: 320px !important;
}
.infowindowWrapper {
  display: none;
}
.address {
  color: #333;
  font-family: Arial;
  font-size: 13px;
}
.address-line {
  color: #333;
  font-family: Arial;
  line-height: normal;
}
.map {
  height: 100%;
  width: 100%;
}
</style>
