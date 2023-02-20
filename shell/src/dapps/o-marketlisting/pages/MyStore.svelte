<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import Label from "../../../shared/atoms/Label.svelte";
import OpeningHours from "../molecules/OpeningHoursEditor.svelte";
import StandardHeaderBox from "../../../shared/atoms/StandardHeaderBox.svelte";
// import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
// import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import {
  BusinessCategory,
  Businesses,
  UpsertOrganisationDocument,
  UpsertOrganisationMutation,
  UpsertOrganisationMutationVariables,
  // ProfilesByCirclesAddressDocument,
  // ProfilesByCirclesAddressQueryVariables,
  Profile,
} from "../../../shared/api/data/types";

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

import AutoComplete from "simple-svelte-autocomplete";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let circlesAddress: string;

export let business: Businesses;
let allCategories: BusinessCategory[];
let allCategoriesLookup;
let _state: Readable<any>;

let placeholder = `${$_("dapps.o-passport.pages.upsertOrganization.locationInputPlaceholder")}`;

let showModal = false;
let editImage = false;
let error = null;

export let location: Location | null = null;

let week: OpeningHourWeek;

onMount(async () => {
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
    location = business.location ? JSON.parse(business.location) : null;
    week = OpeningHourWeek.parseOpeningHours(business);
  }
});

async function save() {
  error = null;
  if (!business.picture || !business.name) {
    error = $_("dapps.o-marketlisting.pages.mystore.error.no-name-or-picture");
  } else {
    const result = await ApiClient.mutate<UpsertOrganisationMutation, UpsertOrganisationMutationVariables>(
      UpsertOrganisationDocument,
      {
        organisation: {
          id: business.id <= 0 ? 0 : business.id,
          circlesAddress: business.circlesAddress,
          name: business.name,
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
          description: business.description,
          location: location ? JSON.stringify(location) : null,
          phoneNumber: business.phoneNumber,
          businessCategoryId: business.businessCategoryId,
        },
      }
    );

    showToast("success", `${$_("dapps.o-marketlisting.pages.mystore.settingsSaved")}`);

    me.reload();
  }
}

function onPlaceChanged(e) {
  getGeo(e.id);
  if (e.detail) {
    location = e.detail;
    business.location = JSON.stringify(location);
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
        appId: "wurst",
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
}

async function getGeo(locationId) {
  if (locationId) {
    const url = "https://lookup.search.hereapi.com/v1/lookup?id=" + locationId + "&apiKey=" + Environment.hereApiKey;

    const response = await fetch(url);

    const json = await response.json();
    const lat = json.position.lat;
    const lng = json.position.lng;

    business.locationName = json.title;
    business.location = json.title;
    business.lat = lat;
    business.lon = lng;
  }
}

async function getItems(keyword) {
  if (keyword) {
    const url =
      "https://autocomplete.search.hereapi.com/v1/autocomplete?q=" +
      encodeURIComponent(keyword) +
      "&apiKey=" +
      Environment.hereApiKey;

    const response = await fetch(url);
    const json = await response.json();
    return json.items;
  }
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

{#if !business}
  <div class="pb-20 mx-auto md:w-2/3 xl:w-1/2">
    <section class="justify-center mb-6 align-middle">
      <LoadingSpinner />
    </section>
  </div>
{:else}
  <div class="p-4 pt-10 pb-20 mx-auto md:w-2/3 xl:w-1/2">
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
                <div class="flex flex-col mb-5 text-sm ">
                  <Label key="dapps.o-passport.pages.upsertOrganization.picture" />
                  <div
                    class="flex justify-center w-full mt-2"
                    role="presentation"
                    on:click="{() => imageEditor(false)}">
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
                    <input class="w-full input input-bordered" bind:value="{business.name}" type="text" />
                  </div>
                </div>
              </div>
              <div class="flex flex-col">
                <div class="flex flex-col mb-5 text-sm">
                  <Label key="dapps.o-passport.pages.upsertOrganization.description" />
                  <div class="flex mt-2">
                    <textarea class="w-full textarea textarea-bordered" bind:value="{business.description}"></textarea>
                  </div>
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
                    <AutoComplete
                      inputClassName="select input w-full"
                      selectName="text-primary"
                      searchFunction="{getItems}"
                      delay="200"
                      localFiltering="{false}"
                      labelFieldName="title"
                      valueFieldName="id"
                      hideArrow="{true}"
                      onChange="{onPlaceChanged}"
                      bind:selectedItem="{location}">
                      <div
                        slot="item"
                        let:item
                        let:label
                        class="text-sm text-base bg-transparent selection:bg-transparent">
                        <section class="flex items-center justify-center mb-4 mr-1 border rounded-lg customItem ">
                          <div class="flex items-center w-full p-0 space-x-2 sm:space-x-6 item-body ">
                            <div class="relative flex-grow p-3 text-left ">
                              <div class="max-w-full -mt-1 leading-8 cursor-pointer ">
                                {@html label}
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>

                      <div slot="no-results" let:noResultsText>
                        <strong>NO RESULTS - {noResultsText}</strong>
                      </div>
                    </AutoComplete>
                  </div>
                </div>
              </div>
              <div class="flex flex-col">
                <div class="flex flex-col mb-5 text-sm">
                  <Label key="dapps.o-passport.pages.upsertOrganization.phone" />
                  <div class="flex mt-2">
                    <input class="w-full input input-bordered" bind:value="{business.phoneNumber}" type="text" />
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
                      selected="{business.businessCategory
                        ? business.businessCategory
                        : $_('dapps.o-marketlisting.pages.mystore.select-category')}"
                      items="{allCategories}"
                      id="filters"
                      key="id"
                      value="name"
                      dropDownClass="mt-1 select input w-full"
                      on:dropDownChange="{(event) => {
                        const selectedItems = event.detail;
                        business.businessCategoryId = parseInt(selectedItems?.value);
                        business.businessCategory = allCategoriesLookup[selectedItems?.value];
                      }}" />
                  {/if}
                </div>
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
        <!-- <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.upsertOrganization.owners">
          <div slot="standardHeaderBoxContent">
            <div class="flex flex-col space-y-2">
              <div class="flex flex-col">
                <div class="flex flex-col mb-5 text-sm">
                  {#if ownerProfiles}
                    {#each ownerProfiles as ownerProfile}
                      {ownerProfile.firstName}
                    {/each}
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </StandardHeaderBox> -->
        {#if error}
          <span class="text-sm text-center text-alert">{error}</span>
        {/if}
        <button class="btn btn-primary" on:click="{() => save()}"><Label key="common.save" /></button>
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
