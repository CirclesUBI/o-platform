<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import Label from "../../../shared/atoms/Label.svelte";
import OpeningHours from "../molecules/OpeningHoursEditor.svelte";
import StandardHeaderBox from "../../../shared/atoms/StandardHeaderBox.svelte";

import { BusinessCategory, Businesses, UpsertOrganisationDocument, UpsertOrganisationMutation, UpsertOrganisationMutationVariables } from "../../../shared/api/data/types";

import { onMount } from "svelte";
import { Environment } from "../../../shared/environment";
import LoadingSpinner from "../../../shared/atoms/LoadingSpinner.svelte";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import { OpeningHourWeek } from "../models/openingHourWeek";
import { ApiClient } from "../../../shared/apiConnection";

import { _ } from "svelte-i18n";
import DropDown from "../../../shared/molecules/DropDown.svelte";
import { push } from "svelte-spa-router";
import { showToast } from "../../../shared/toast";
import { me } from "../../../shared/stores/me";
import Center from "../../../shared/layouts/Center.svelte";
import ImageUpload from "../../../shared/molecules/ImageUpload/ImageUpload.svelte";
import { uploadFile } from "../../../shared/api/uploadFile";
import { useMachine } from "@xstate/svelte";
import { Readable } from "svelte/store";
import { getGeoDataFromHereId } from "../../../shared/functions/locationHandler";
import AutoComplete from "simple-svelte-autocomplete";
import { buildAddressString } from "../../../shared/functions/locationHandler";
import GooglePlacesAutocomplete from "@silintl/svelte-google-places-autocomplete";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

type Location = {
  place: {
    html_attributions: any[];
    geometry: {
      viewport: {
        Ia: {
          hi: number;
          lo: number;
        };
        Wa: {
          hi: number;
          lo: number;
        };
      };
      location: {
        lat?: number | (() => number);
        lng?: number | (() => number);
      };
    };
    address_components: {
      types: string[];
      short_name: string;
      long_name: string;
    }[];
  };
  text: string;
};

const options = {
  fields: ["address_components", "geometry"],
  types: ["establishment"],
};

const options2 = {
  fields: ["address_components", "geometry"],
  types: ["address"],
};

function onReady(e) {
  console.log("onReady", e.detail, locationName);
}

let locationName = "";

export let business: Businesses;
let allCategories: BusinessCategory[];
let allCategoriesLookup;
let _state: Readable<any>;

let placeholder = `${$_("dapps.o-passport.pages.upsertOrganization.locationInputPlaceholder")}`;

let showModal = false;
let editImage = false;
let error = null;

let week: OpeningHourWeek;

onMount(async () => {});

/* Filter out non street-level results */
function isViableResult(item) {
  return item.resultType == "street" || item.resultType == "houseNumber";
}

async function attachGeoData(locationId) {
  if (locationId) {
    const geoData = await getGeoDataFromHereId(locationId);
    business.locationName = buildAddressString(geoData.address);
    business.location = geoData.id;
    business.lat = geoData.position.lat;
    business.lon = geoData.position.lng;
  }
}

function onPlaceChanged(e) {
  if (e && e.id) {
    attachGeoData(e.id);

    // We have to manipulate this a little bit in order to display the just Selected Value in the dropdown correctly
    // When just selecting a new value, for some reason the title has the city/street etc.. in reverse order, but the address.label is correct.
    e.title = e.address.label;
  }
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="p-4 pt-10 pb-20 mx-auto md:w-2/3 xl:w-1/2">
  <section class="justify-left">
    <div class="flex flex-col -mt-6 space-y-6 overflow-hidden whitespace-pre-line xs:p-3 xs:-mt-2">
      <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.upsertOrganization.contactInformation">
        <div slot="standardHeaderBoxContent">
          <div class="flex flex-col space-y-2">
            <div class="flex flex-col">
              <div class="flex flex-col mb-5 text-sm">
                Google Places with type Establishement
                <div class="flex mt-2">
                  <GooglePlacesAutocomplete
                    class="w-full form-control input input-bordered"
                    apiKey="{Environment.placesApiKey}"
                    on:place_changed="{onPlaceChanged}"
                    options="{options}"
                    on:ready="{onReady}"
                    placeholder="{placeholder}"
                    value="{locationName}" />
                </div>
              </div>
              <div class="flex flex-col mb-5 text-sm">
                Google Places with type address
                <div class="flex mt-2">
                  <GooglePlacesAutocomplete
                    class="w-full form-control input input-bordered"
                    apiKey="{Environment.placesApiKey}"
                    on:place_changed="{onPlaceChanged}"
                    options="{options2}"
                    on:ready="{onReady}"
                    placeholder="{placeholder}"
                    value="{locationName}" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </StandardHeaderBox>
    </div>
  </section>
</div>

<style>
:global(.autocomplete) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
:global(.autocomplete input) {
  padding-right: 2rem !important;
}
:global(.autocomplete-list-item) {
  padding: 0.5rem !important;
  width: 100%;
  height: auto;
}
:global(.autocomplete-list-item.selected) {
  background-color: #fff !important;
  color: #ffcc33;
}
:global(.hide-arrow) {
  display: none;
}
.customItem {
  display: flex;
  align-items: center;
  cursor: default;
  padding: 0;
  overflow: hidden;
  @apply bg-white;
  @apply border-light;
}
:global(.autocomplete-list-item.selected .customItem) {
  @apply border-primary;
}
</style>
