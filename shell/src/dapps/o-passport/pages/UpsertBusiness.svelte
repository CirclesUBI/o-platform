<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import Label from "../../../shared/atoms/Label.svelte";
import OpeningHours from "../molecules/OpeningHoursEditor.svelte";
import StandardHeaderBox from "../../../shared/atoms/StandardHeaderBox.svelte";
import {
  Businesses, UpsertOrganisationDocument,
  UpsertOrganisationMutation,
  UpsertOrganisationMutationVariables
} from "../../../shared/api/data/types";
import {onMount} from "svelte";
import {Environment} from "../../../shared/environment";
import CategoryDropDown from "../molecules/CategoryDropDown.svelte";
import LoadingSpinner from "../../../shared/atoms/LoadingSpinner.svelte";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import {OpeningHourWeek} from "../models/openingHourWeek";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import {DropdownSelectorParams} from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import {cityByHereId} from "../../../shared/api/promptCity";
import DropDownCity from "@o-platform/o-editors/src/dropdownItems/DropDownCity.svelte";
import {GnosisSafeProxyFactory} from "@o-platform/o-circles/dist/safe/gnosisSafeProxyFactory";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {CirclesHub} from "@o-platform/o-circles/dist/circles/circlesHub";
import {ApiClient} from "../../../shared/apiConnection";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let circlesAddress: string;

export let business: Businesses;

let locationDropDownContext = {
  field: "location",
  data: {
    location: ""
  },
  messages: {},
  editorDirtyFlags: {},
  params:  <DropdownSelectorParams<any, any, string>>{
    showNavigation: false,
    submitOnBlur: true,
    view: {
      title: "",
      description: "",
      submitButtonText: "",
      placeholder: ""
    },
    itemTemplate: DropDownCity,
    getKey: (o) => o.id,
    getLabel: (o) => `${o?.title ?? ""}`,
    getHighlight: (o) => {
      if (o.highlights?.title?.length > 0) {
        return {
          start: o.highlights.title[0].start,
          end: o.highlights.title[0].end,
        };
      }
    },
    keyProperty: "id",
    choices: {
      byKey: async (key: string) => {
        return await cityByHereId(key);
      },
      find: async (filter: string) => {
        // https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics-api/code-autocomplete-result-type-filter.html
        const url = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${encodeURIComponent(filter)}&apiKey=${Environment.hereApiKey}`;

        const response = await fetch(url);
        const json = await response.json();
        return json.items.reverse().length ? json.items : [];
      },
    },
  }
};

let week: OpeningHourWeek;

onMount(async () => {
  if (circlesAddress) {
    const businesses = await Environment.api.allBusinesses({
      queryParams: {
        where: {
          inCirclesAddress: [circlesAddress]
        }
      }
    });
    business = businesses.allBusinesses[0];
    locationDropDownContext.data.location = business.location;
    week = OpeningHourWeek.parseOpeningHours(business);
  } else {
    business = {
      id: -1,
      circlesAddress: "",
      name: "",
      description: ""
    };
    week = OpeningHourWeek.parseOpeningHours({
      businessHoursMonday: "",
      businessHoursTuesday: "",
      businessHoursWednesday: "",
      businessHoursThursday: "",
      businessHoursFriday: "",
      businessHoursSaturday: "",
      businessHoursSunday: ""
    })
  }
})

async function save() {
  const loc = locationDropDownContext.data[locationDropDownContext.field];

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
  }

  if (loc) {
    const city = await cityByHereId(loc);
    business.lat = city.position.lat;
    business.lon = city.position.lng;
    business.locationName = city.title;
  }

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
          location: loc,
          phoneNumber: business.phoneNumber,
          businessCategoryId: business.businessCategoryId
        }
      }
  );

  console.log("result:", result);
}

async function validate() {

}

async function createOrga() {

}

</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<!--<PassportHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />-->
{#if !business}
  <div class="pb-20 mx-auto md:w-2/3 xl:w-1/2">
    <section class="justify-center mb-6 align-middle">
      <LoadingSpinner></LoadingSpinner>
    </section>
  </div>
{:else}
<div class="pb-20 mx-auto md:w-2/3 xl:w-1/2">
  <section class="justify-center mb-6 align-middle">
    <div class="flex flex-col justify-around p-4 pt-0 mx-auto -mt-6">
      {#if !circlesAddress}
        <h1 class="text-center">New organization</h1>
      {:else}
        <h1 class="text-center">{business.name}</h1>
      {/if}
    </div>
  </section>
  <pre>
    {JSON.stringify(business, null, 2)}
  </pre>
  <section class="justify-left">
    <div class="flex flex-col -mt-6 space-y-6 overflow-hidden whitespace-pre-line xs:p-3 xs:-mt-2">
      <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.upsertOrganization.generalInformation">
        <div slot="standardHeaderBoxContent">
          <div class="flex flex-col space-y-2">
            <div class="text-left">
              <Label key="dapps.o-passport.pages.upsertOrganization.name" />
            </div>
            <div class="flex flex-col">
              <div class="flex flex-col mb-5 text-sm">
                <Label key="dapps.o-passport.pages.upsertOrganization.picture" />
                <div class="flex mt-2">
                  <UserImage profile="{{
                    circlesAddress: business.circlesAddress,
                    avatarUrl: business.picture
                  }}" size="{36}" profileLink="{false}" />
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex flex-col mb-5 text-sm">
                <Label key="dapps.o-passport.pages.upsertOrganization.name" />
                <div class="flex mt-2">
                  <input class="w-full input input-bordered md:w-auto" bind:value={business.name} type="text" />
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex flex-col mb-5 text-sm">
                <Label key="dapps.o-passport.pages.upsertOrganization.description" />
                <div class="flex mt-2">
                  <input class="w-full input input-bordered md:w-auto" bind:value={business.description} type="text" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </StandardHeaderBox>
      <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.upsertOrganization.contactInformation">
        <div slot="standardHeaderBoxContent">
          <div class="flex flex-col space-y-2">
            <div class="text-left">
              <Label key="dapps.o-passport.pages.upsertOrganization.name" />
            </div>
            <div class="flex flex-col">
              <div class="flex flex-col mb-5 text-sm">
                <Label key="dapps.o-passport.pages.upsertOrganization.location" />
                <div class="flex mt-2">
                  <DropdownSelectEditor context={locationDropDownContext}></DropdownSelectEditor>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex flex-col mb-5 text-sm">
                <Label key="dapps.o-passport.pages.upsertOrganization.phone" />
                <div class="flex mt-2">
                  <input class="w-full input input-bordered md:w-auto" bind:value={business.phoneNumber} type="text" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </StandardHeaderBox>

      <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.upsertOrganization.business">
        <div slot="standardHeaderBoxContent">
          <div class="flex flex-col">
            <div class="text-left">
              <Label key="dapps.o-passport.pages.upsertOrganization.name" />
            </div>
            <div class="flex flex-col mb-5 text-sm">
              <Label key="dapps.o-passport.pages.upsertOrganization.category" />
              <div class="flex mt-2">
                <CategoryDropDown
                        width="64"
                        selectedKeys={business?.businessCategoryId ? [business.businessCategoryId] : undefined}
                        on:change={event => {
                          const selectedItems = event.detail[0];
                          business.businessCategoryId = selectedItems?.id;
                          business.businessCategory = selectedItems?.name;
                        }} />
              </div>
            </div>
          </div>
          <div class="flex flex-col mb-5 text-sm">
            <Label key="dapps.o-passport.pages.upsertOrganization.businessHours" />
            <div class="flex mt-2">
              <OpeningHours week={week}
                            on:change={() => {
                              business = {
                                ...business,
                                ...(week?.serializeWeek() ?? {})
                              }
                            }} />
            </div>
          </div>
        </div>
      </StandardHeaderBox>
      <button class="btn btn-primary" on:click={() => save()}>Save</button>
    </div>
  </section>
</div>
{/if}