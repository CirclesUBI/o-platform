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
import { GnosisSafeProxyFactory } from "@o-platform/o-circles/dist/safe/gnosisSafeProxyFactory";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { CirclesHub } from "@o-platform/o-circles/dist/circles/circlesHub";
import { ApiClient } from "../../../shared/apiConnection";
import GooglePlacesAutocomplete from "@silintl/svelte-google-places-autocomplete";
import { _ } from "svelte-i18n";
import DropDown from "../../../shared/molecules/DropDown.svelte";
import { push } from "svelte-spa-router";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let circlesAddress: string;

export let business: Businesses;
let allCategories: BusinessCategory[];
let allCategoriesLookup;

let placeholder = `${$_("dapps.o-passport.pages.upsertOrganization.locationInputPlaceholder")}`;

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
    location = <Location>JSON.parse(business.location);
    week = OpeningHourWeek.parseOpeningHours(business);
    placeholder = location?.text;
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
  if (!business.circlesAddress) {
    const privateKey = sessionStorage.getItem("circlesKey");
    const proxyFactory = new GnosisSafeProxyFactory(
      RpcGateway.get(),
      Environment.safeProxyFactoryAddress,
      Environment.masterSafeAddress
    );
    const organisationSafeProxy = await proxyFactory.deployNewSafeProxy(privateKey);

    business.circlesAddress = organisationSafeProxy.address;

    const hub = new CirclesHub(RpcGateway.get(), Environment.circlesHubAddress);
    const receipt = await hub.signupOrganisation(privateKey, organisationSafeProxy);

    console.log(receipt);
    push("#/passport/profile");
  }

  console.log("Saving business", business);

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

  console.log("result:", result);
}

async function validate() {}

function onPlaceChanged(e) {
  console.log("onPlaceChanged", e.detail, locationName);
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

function onReady(e) {
  console.log("onReady", e.detail, locationName);
}

const options = {
  fields: ["address_components", "geometry"],
  types: ["address"],
};

let locationName = "";

function editProfileField(onlyThesePages: string[]) {
  // if (business.__typename == "Organisation") {
  //   window.o.runProcess(
  //     upsertOrganisation,
  //     {
  //       ...profile,
  //       successAction: (data) => {
  //         window.o.publishEvent(<PlatformEvent>{
  //           type: "shell.authenticated",
  //           profile: data,
  //         });
  //       },
  //     },
  //     {},
  //     onlyThesePages
  //   );
  // } else {
  //   window.o.runProcess(upsertIdentity, profile, {}, onlyThesePages);
  // }
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<!--<PassportHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />-->
{#if !business}
  <div class="pb-20 mx-auto md:w-2/3 xl:w-1/2">
    <section class="justify-center mb-6 align-middle">
      <LoadingSpinner />
    </section>
  </div>
{:else}
  <div class="p-4 pb-20 mx-auto md:w-2/3 xl:w-1/2">
    <section class="justify-center mb-6 align-middle">
      <div class="flex flex-col justify-around p-4 pt-0 mx-auto -mt-6">
        {#if !circlesAddress}
          <h1 class="text-center">New organization</h1>
        {:else}
          <h1 class="text-center">{business.name}</h1>
        {/if}
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
                    on:click="{() => editProfileField(['file', 'avatarUrl'])}">
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
                      selected="{business.businessCategory ? business.businessCategory : 'Select Category'}"
                      items="{allCategories}"
                      id="filters"
                      key="id"
                      value="name"
                      dropDownClass="mt-1 select input w-full"
                      on:dropDownChange="{(event) => {
                        const selectedItems = event.detail[0];
                        business.businessCategoryId = selectedItems?.id;
                        business.businessCategory = selectedItems?.name;
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
        <button class="btn btn-primary" on:click="{() => save()}">Save</button>
      </div>
    </section>
  </div>
{/if}
