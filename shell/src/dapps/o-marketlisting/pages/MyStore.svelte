<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import Label from "../../../shared/atoms/Label.svelte";
import OpeningHours from "../molecules/OpeningHoursEditor.svelte";
import StandardHeaderBox from "../../../shared/atoms/StandardHeaderBox.svelte";
import {
  BusinessCategory,
  Businesses,
  UpsertOrganisationDocument,
  UpsertOrganisationMutation,
  UpsertOrganisationMutationVariables,
} from "../../../shared/api/data/types";
import { onMount } from "svelte";
import { Environment } from "../../../shared/environment";
import LoadingSpinner from "../../../shared/atoms/LoadingSpinner.svelte";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import { OpeningHourWeek } from "../models/openingHourWeek";
import { ApiClient } from "../../../shared/apiConnection";
import GooglePlacesAutocomplete from "@silintl/svelte-google-places-autocomplete";
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

export let location: Location | null = null;

let week: OpeningHourWeek;

onMount(async () => {
  allCategories = (await Environment.api.allBusinessCategories()).allBusinessCategories;

  allCategoriesLookup = allCategories.toLookup(
    (o) => o.id,
    (o) => o
  );
  if (circlesAddress) {
    const businesses = await Environment.api.allBusinesses({
      queryParams: {
        where: {
          inCirclesAddress: [circlesAddress.toLowerCase()],
        },
      },
    });

    business = businesses.allBusinesses[0];
    if (business) {
      location = business.location ? <Location>JSON.parse(business.location) : null;
      week = OpeningHourWeek.parseOpeningHours(business);
      placeholder = location?.text;
    }
  } else {
    business = {
      id: -1,
      circlesAddress: "",
      name: "",
      description: "",
    };
    week = OpeningHourWeek.parseOpeningHours({
      businessHoursMonday: "",
      businessHoursTuesday: "",
      businessHoursWednesday: "",
      businessHoursThursday: "",
      businessHoursFriday: "",
      businessHoursSaturday: "",
      businessHoursSunday: "",
    });
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
  if (e.detail) {
    location = e.detail;
    business.location = JSON.stringify(location);
    if (
      typeof location.place?.geometry?.location?.lat === "function" &&
      typeof location.place?.geometry?.location?.lng === "function"
    ) {
      business.lat = location.place.geometry.location.lat();
      business.lon = location.place.geometry.location.lng();
    } else if (
      typeof location.place?.geometry?.location?.lat === "number" &&
      typeof location.place?.geometry?.location?.lng === "number"
    ) {
      business.lat = location.place?.geometry?.location?.lat;
      business.lon = location.place?.geometry?.location?.lng;
    }
  }
}
// Apparently the Google Api _needs_ a callback in order to even load...
function onReady(e) {
  console.log("onReady", e.detail, locationName);
}

const options = {
  fields: ["address_components", "geometry"],
  types: ["address"],
};

let locationName = "";

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
