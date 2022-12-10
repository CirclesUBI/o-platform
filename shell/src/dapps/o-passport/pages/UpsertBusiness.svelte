<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import Label from "../../../shared/atoms/Label.svelte";
import OpeningHours, {week} from "../molecules/OpeningHoursEditor.svelte";
import StandardHeaderBox from "../../../shared/atoms/StandardHeaderBox.svelte";
import {Businesses} from "../../../shared/api/data/types";
import {onMount} from "svelte";
import {Environment} from "../../../shared/environment";
import CategoryDropDown from "../molecules/CategoryDropDown.svelte";
import LoadingSpinner from "../../../shared/atoms/LoadingSpinner.svelte";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import {OpeningHourWeek} from "../models/openingHourWeek";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let circlesAddress: string;

export let business: Businesses;

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
    week = OpeningHourWeek.parseOpeningHours(business);
  } else {
    business = {
      id: -1,
      circlesAddress: "",
      name: "",
      description: ""
    };
  }
})

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
                  <input class="w-full input input-bordered md:w-auto" readonly bind:value={business.locationName} type="text" />
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
                                ...week.serializeWeek()
                              }
                            }} />
            </div>
          </div>
        </div>
      </StandardHeaderBox>
    </div>
  </section>
</div>
{/if}