<script type="ts">
import GoogleSdk from "./GoogleSdk.svelte";
import { createEventDispatcher, setContext } from "svelte";
import { key } from "./context";
import Label from "../../atoms/Label.svelte";

setContext(key, {
  getMap: () => map,
  getGoogleMap: () => mapElement,
});

const dispatch = createEventDispatcher();

export let apiKey;
export let center = null;
export let zoom = 8;
export let options = {};
export let placeName = null;
export let placeId: string = null;

let mapElement;
let map;
let infowindowContent: HTMLElement = null;
let location: any;
let infowindow = null;
let currentPlaceName: string = "";
let currentPlaceAddress: string = "";

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

function initialise() {
  setTimeout(() => {
    const google = window.google;
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

    infowindow = new google.maps.InfoWindow();
    infowindow.setContent(infowindowContent);

    google.maps.event.addListener(map, "dragend", () => {
      location = map.getCenter();
      center = location;
      dispatch("recenter", { location });
    });
    if (placeId) {
      addMarker(map, placeId);
    }
    dispatch("ready");
  }, 1);
}

function addMarker(map: google.maps.Map, place_id: string) {
  const placesService = new google.maps.places.PlacesService(map);
  placesService.getDetails(
    {
      placeId: placeId,
    },
    function (place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (place) {
          const marker = new google.maps.Marker({
            map,
          });

          marker.addListener("click", () => {
            infowindow.close();
            infowindow.open(map, marker);
          });

          // Set the position of the marker using the place ID and location.
          // @ts-ignore This should be in @typings/googlemaps.
          marker.setPlace({
            placeId: place_id,
            location: center,
          });

          marker.setVisible(true);

          currentPlaceName = placeName || place.name;
          let addressArray = place.formatted_address.split(",");
          if (currentPlaceName) {
            addressArray.pop();
          }
          currentPlaceAddress = addressArray.join("<br/>");

          infowindow.open(map, marker);
        }
      }
    }
  );
}
</script>

<GoogleSdk apiKey="{apiKey}" on:ready="{initialise}" />
<div class="map" bind:this="{mapElement}">
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
      <div>
        <a href="https://www.google.com/maps/search/?api=1&query={center.lat},{center.lng}" class="gmapsLink" target="_blank" rel="noreferrer">
          <Label key="dapps.common.googlemaps.viewonGoogleMaps" /></a>
      </div>
    {/if}
  </div>
</div>

<style>
.gmapsLink {
  text-decoration: none;
  color: #1a73e8;
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
