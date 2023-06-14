<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
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
import { _ } from "../../../i18n/i18nDictionary";
import DropDown from "../../../shared/molecules/DropDown.svelte";
import { push } from "svelte-spa-router";
import { showToast } from "../../../shared/toast";
import Center from "../../../shared/layouts/Center.svelte";
import ImageUpload from "../../../shared/molecules/ImageUpload/ImageUpload.svelte";
import { uploadFile } from "../../../shared/api/uploadFile";
import { useMachine } from "@xstate/svelte";
import { Readable } from "svelte/store";
import { form, field } from "svelte-forms";
import { required, max } from "svelte-forms/validators";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import GoogleMapSearch from "../../../shared/molecules/GoogleMaps/GoogleMapSearch.svelte";
import Geolocation from "svelte-geolocation";

import CountrySelect from "../../../shared/molecules/CountrySelect/CountrySelect.svelte";
import { TelInput, normalizedCountries } from "svelte-tel-input";
import type { DetailedValue, CountryCode, E164Number, CountrySelectEvents } from "svelte-tel-input/types";
import "../../../../../node_modules/flag-icons/css/flag-icons.min.css";

// Any Country Code Alpha-2 (ISO 3166)
let selectedCountry: CountryCode | null = "ID";

let value: E164Number | null = "+62301234567";

let valid = true;

let detailedValue: DetailedValue | null = null;

const name = field("name", "", [required(), max(50)], {
  validateOnChange: true,
});

const description = field("description", "", [required(), max(250)], {
  validateOnChange: true,
});

const category = field("category", null, [required()], {
  validateOnChange: true,
});

const myForm = form(name, description, category);

export let runtimeDapp: RuntimeDapp<any>;
export let circlesAddress: string;

export let business: Businesses;
let allCategories: BusinessCategory[];
let allCategoriesLookup;
let _state: Readable<any>;

let showModal = false;
let editImage = false;
let error = null;
let geolocation;
let geoLocationOptions = {
  enableHighAccuracy: true,
};

type Location = {
  place_id: string;
  address: string;
  lat: string;
  lng: string;
};

let location: Location = null;

let week: OpeningHourWeek;

const mapOptions = {
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
};

let center = {};

myForm.validate();
let isValid: boolean = true;

$: isValid = detailedValue?.isValid ?? false;

onMount(async () => {
  center = { lat: -8.670458, lng: 115.212631 };

  allCategories = (await Environment.api.allBusinessCategories()).allBusinessCategories;

  allCategoriesLookup = allCategories.toLookup(
    (o) => o.id,
    (o) => o
  );

  const businesses = await Environment.api.allBusinesses({
    queryParams: {
      where: {
        inCirclesAddress: [circlesAddress.toLowerCase()],
      },
    },
  });

  business = businesses.allBusinesses[0];

  if (business) {
    week = OpeningHourWeek.parseOpeningHours(business);
    $description.value = business.description;
    $name.value = business.name;
    $category.value = business.businessCategoryId;
    value = business.phoneNumber;
    console.log("ASDASD", business.phoneNumber);
  }
});

async function save() {
  error = null;
  if (!business.picture || !business.name) {
    error = $_("dapps.o-marketlisting.pages.mystore.error.no-name-or-picture");
  } else {
    const result = await ApiClient.mutate<UpsertOrganisationMutation, UpsertOrganisationMutationVariables>(UpsertOrganisationDocument, {
      organisation: {
        id: business.id <= 0 ? 0 : business.id,
        circlesAddress: business.circlesAddress,
        firstName: $name.value,
        location: business.location,
        locationName: business.locationName,
        lat: business.lat,
        lon: business.lon,
        avatarUrl: business.picture,
        businessHoursMonday: business.businessHoursMonday,
        businessHoursTuesday: business.businessHoursTuesday,
        businessHoursWednesday: business.businessHoursWednesday,
        businessHoursThursday: business.businessHoursThursday,
        businessHoursFriday: business.businessHoursFriday,
        businessHoursSaturday: business.businessHoursSaturday,
        businessHoursSunday: business.businessHoursSunday,
        description: $description.value,
        phoneNumber: value,
        businessCategoryId: business.businessCategoryId,
      },
    });

    showToast("success", `${$_("dapps.o-marketlisting.pages.mystore.settingsSaved")}`);

    window.o.publishEvent(<PlatformEvent>{
      type: "shell.authenticated",
      profile: result.organisation,
    });
    push("#/passport/profile");
  }
}

function imageEditor(type) {
  showModal = true;
  editImage = false;
  if (business.picture) {
    editImage = true;
  }
}

function handleClickOutside(event) {
  showModal = false;
}

function handleImageUpload(event) {
  const machine = (<any>uploadFile).stateMachine("123");
  const machineOptions = {
    context: {
      data: {
        appId: "circlesUbi",
        mimeType: "image/jpeg",
        bytes: event.detail.croppedImage,
      },
    },
  };
  const { service, state, send } = useMachine(machine, machineOptions);
  service.start();
  _state = state;
  showModal = false;
}
$: {
  if (_state) {
    if ($_state.value == "success") {
      business.picture = $_state.context.data.url;
      _state = null;
    }
  }

  if (business && business.lat) {
    center = { lat: business.lat, lng: business.lon };
  } else {
    if (geolocation) {
      center = { lat: geolocation.coords.latitude, lng: geolocation.coords.longitude };
    }
  }
}

function mapRecenter({ place }) {
  location = place;

  business.locationName = place.formatted_address;
  business.location = place.place_id;
  business.lat = place.geometry.location.lat();
  business.lon = place.geometry.location.lng();
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" />

{#if !business}
  <div class="pb-20 mx-auto md:w-2/3 xl:w-1/2">
    <section class="justify-center mb-6 align-middle">
      <LoadingSpinner />
    </section>
  </div>
{:else}
  <div class="p-4 pt-10 pb-24 mx-auto md:w-2/3 xl:w-1/2">
    <section class="justify-center mb-6 align-middle">
      <div class="flex flex-col justify-around p-4 pt-0 mx-auto -mt-6">
        <h1 class="text-center">{business.name}</h1>
      </div>
    </section>
    <pre></pre>
    <section class="justify-left">
      <div class="flex flex-col -mt-6 space-y-6 overflow-hidden whitespace-pre-line xs:p-3 xs:-mt-2">
        <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.upsertOrganization.generalInformation">
          <div slot="standardHeaderBoxContent">
            <div class="flex flex-col space-y-2">
              <div class="flex flex-col">
                <div class="flex flex-col mb-5 text-sm">
                  <Label key="dapps.o-passport.pages.upsertOrganization.picture" />
                  <div class="flex justify-center w-full mt-2" role="presentation" on:click="{() => imageEditor(false)}">
                    <UserImage
                      profile="{{
                        circlesAddress: business.circlesAddress,
                        avatarUrl: business.picture,
                      }}"
                      size="{36}"
                      editable="{true}"
                      profileLink="{false}" />
                  </div>
                </div>
              </div>
              <div class="flex flex-col">
                <div class="flex flex-col mb-5 text-sm">
                  <Label key="dapps.o-passport.pages.upsertOrganization.name" />
                  <div class="flex mt-2">
                    <input class="w-full input input-bordered" bind:value="{$name.value}" type="text" />
                  </div>
                  {#if $myForm.hasError("name.max")}
                    <div class="text-sm text-right text-alert"><Label key="dapps.o-marketlisting.pages.mystore.error.nameMaxLength" /></div>
                  {/if}
                  {#if $myForm.hasError("name.required")}
                    <div class="text-sm text-right text-alert"><Label key="dapps.o-marketlisting.pages.mystore.error.nameRequired" /></div>
                  {/if}
                </div>
              </div>
              <div class="flex flex-col">
                <div class="flex flex-col mb-5 text-sm">
                  <Label key="dapps.o-passport.pages.upsertOrganization.description" />
                  <div class="flex mt-2">
                    <textarea class="w-full textarea textarea-bordered" bind:value="{$description.value}"></textarea>
                  </div>
                  {#if $myForm.hasError("description.max")}
                    <div class="text-sm text-right text-alert"><Label key="dapps.o-marketlisting.pages.mystore.error.descriptionMaxLength" /></div>
                  {/if}
                  {#if $myForm.hasError("description.required")}
                    <div class="text-sm text-right text-alert"><Label key="dapps.o-marketlisting.pages.mystore.error.descriptionRequired" /></div>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </StandardHeaderBox>
        <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.upsertOrganization.contactInformation">
          <div slot="standardHeaderBoxContent">
            <div class="flex flex-col space-y-2">
              <div class="flex flex-col">
                <div class="flex flex-col mb-5 text-sm">
                  <Label key="dapps.o-passport.pages.upsertOrganization.location" />
                  <div class="flex mt-2">
                    {#if business && business.lat}
                      <div class="w-full mb-8 section-txt h-80" id="map">
                        <div class="map-wrap">
                          <GoogleMapSearch
                            apiKey="{Environment.placesApiKey}"
                            on:recenter="{(e) => mapRecenter(e.detail)}"
                            zoom="{17}"
                            options="{mapOptions}"
                            placeholder="{business.locationName ? business.locationName : null}"
                            bind:center="{center}" />
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
                              <div class="map-wrap">
                                <GoogleMapSearch
                                  apiKey="{Environment.placesApiKey}"
                                  on:recenter="{(e) => mapRecenter(e.detail)}"
                                  zoom="{17}"
                                  options="{mapOptions}"
                                  placeholder="{business.locationName ? business.locationName : null}"
                                  bind:center="{center}" />
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
                              <div class="map-wrap">
                                <GoogleMapSearch
                                  apiKey="{Environment.placesApiKey}"
                                  on:recenter="{(e) => mapRecenter(e.detail)}"
                                  zoom="{17}"
                                  options="{mapOptions}"
                                  placeholder="{business.locationName ? business.locationName : null}"
                                  bind:center="{center}" />
                              </div>
                            </div>
                          {/if}
                        {/if}
                      </Geolocation>
                    {/if}
                  </div>
                </div>
              </div>
              <div class="flex flex-col">
                <div class="flex flex-col mb-5 text-sm">
                  <Label key="dapps.o-passport.pages.upsertOrganization.phone" />

                  <div class="w-full mt-2">
                    <!-- <div class="flex flex-row w-full space-x-2 wrapper">
                      <CountrySelect
                        value="{business.phoneNumber}"
                        selectedCountry="{selectedCountry}"
                        searchTextPlaceholder="{$_('dapps.o-marketlisting.molecules.marketlistingframe.search')}"
                        on:change="{(e) => console.log('EE', e)}" />
                      <div class="flex-grow">
                        <input class="w-full input input-bordered" bind:value="{business.phoneNumber}" type="text" />
                      </div>
                    </div> -->

                    <div class="flex flex-row w-full space-x-2 wrapper">
                      <CountrySelect
                        selectedCountry="{selectedCountry}"
                        searchTextPlaceholder="{$_('dapps.o-marketlisting.molecules.marketlistingframe.search')}"
                        on:change="{(e) => (selectedCountry = e.detail.option)}" />
                      <div class="flex-grow">
                        <TelInput
                          bind:country="{selectedCountry}"
                          bind:value="{value}"
                          bind:valid="{valid}"
                          bind:detailedValue="{detailedValue}"
                          placeholder="enter your phone number"
                          class="w-full basic-tel-input input input-bordered " />
                      </div>
                    </div>
                    {#if value !== "" && !isValid}
                      <div class="text-sm text-right text-info"><Label key="dapps.o-marketlisting.pages.mystore.error.validPhoneNumber" /></div>
                    {/if}
                    <!-- <input class="w-full input input-bordered" bind:value="{business.phoneNumber}" type="text" /> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StandardHeaderBox>

        <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.upsertOrganization.business">
          <div slot="standardHeaderBoxContent">
            <div class="flex flex-col">
              <div class="flex flex-col mb-5 text-sm">
                <Label key="dapps.o-passport.pages.upsertOrganization.category" />
                <div class="flex mt-2">
                  {#if allCategories}
                    <DropDown
                      selected="{business.businessCategory ? business.businessCategory : $_('dapps.o-marketlisting.pages.mystore.select-category')}"
                      items="{allCategories}"
                      id="filters"
                      key="id"
                      i18nKeys="{true}"
                      value="name"
                      dropDownClass="mt-1 select input w-full"
                      on:dropDownChange="{(event) => {
                        const selectedItems = event.detail;
                        business.businessCategoryId = parseInt(selectedItems.value);
                        $category.value = business.businessCategoryId;
                      }}" />
                  {/if}
                </div>
                {#if $myForm.hasError("category.required")}
                  <div class="text-sm text-right text-alert"><Label key="dapps.o-marketlisting.pages.mystore.error.categoryRequired" /></div>
                {/if}
              </div>
            </div>
            <div class="flex flex-col mb-5 text-sm">
              <Label key="dapps.o-passport.pages.upsertOrganization.businessHours" />
              <div class="flex mt-2">
                <OpeningHours
                  week="{week}"
                  on:change="{() => {
                    business = {
                      ...business,
                      ...(week?.serializeWeek() ?? {}),
                    };
                  }}" />
              </div>
            </div>
          </div>
        </StandardHeaderBox>

        {#if error}
          <span class="text-sm text-center text-alert">{error}</span>
        {/if}
        {#if !$myForm.valid}
          <div class="text-sm text-center text-alert"><Label key="dapps.o-marketlisting.pages.mystore.error.correctErrorsAbove" /></div>
        {/if}
        <button class="btn btn-primary" disabled="{!$myForm.valid}" on:click="{() => save()}"><Label key="common.save" /></button>
      </div>
    </section>
  </div>
  {#if showModal}
    <Center blur="{true}" on:clickedOutside="{handleClickOutside}">
      <ImageUpload on:submit="{handleImageUpload}" maxWidth="{700}" />
    </Center>
  {/if}
{/if}

<style>
.map-wrap {
  width: 100%;
  height: 300px;
}

.wrapper :global(.basic-tel-input) {
  padding-left: 12px;
  padding-right: 12px;

  outline: none;
}

.wrapper :global(.country-select) {
  padding-left: 12px;
  padding-right: 12px;

  outline: none;
}

.wrapper :global(.invalid) {
  border-color: red;
}
</style>
