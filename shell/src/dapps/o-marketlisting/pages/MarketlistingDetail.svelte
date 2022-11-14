<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { onMount } from "svelte";
import { ApiClient } from "../../../shared/apiConnection";
import { AllBusinessesDocument, AllBusinessesQueryVariables, Businesses } from "../../../shared/api/data/types";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import { fade } from "svelte/transition";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let id: string;

let business: Businesses[] = [];
let outlineState: boolean = false;
let visible: boolean = false;
let currentDayOpenHours = "";
let everythingBeforeTheCurrentDay = [];
let everythingAfterTheCurrentDay = [];

onMount(async () => {
  business = await getBusiness(id);
  console.log(business);

  const currentDay = new Date().getDay();
  const businessHours = [
    business[0].businessHoursMonday,
    business[0].businessHoursTuesday,
    business[0].businessHoursWednesday,
    business[0].businessHoursThursday,
    business[0].businessHoursFriday,
    business[0].businessHoursSaturday,
    business[0].businessHoursSunday,
  ];

  currentDayOpenHours = businessHours[currentDay - 1];
  everythingBeforeTheCurrentDay = businessHours.slice(0, currentDay - 1);
  let everythingAfterTheCurrentDay = [];
  if (currentDay < businessHours.length) {
    everythingAfterTheCurrentDay = businessHours.slice(currentDay, businessHours.length);
  }

  console.log("before", everythingBeforeTheCurrentDay);
  console.log("today", currentDayOpenHours);
  console.log("after", everythingAfterTheCurrentDay);
});

async function getBusiness(id: string) {
  let queryResult = await ApiClient.query<Businesses[], AllBusinessesQueryVariables>(AllBusinessesDocument, {
    id: parseInt(id),
  });

  return queryResult;
}
</script>

<div class="bg-marketlisting" style="display: none;"></div>
<section class="p-4">
  {#if business.length}
    <div class="relative">
      <img src="{business[0].picture}" alt="picture of the business" class="h-full w-full rounded-2xl" />

      <div
        on:click="{() => {
          outlineState = !outlineState;
          console.log(outlineState);
        }}">
        {#if outlineState}
          <Icon name="heart" class="w-10 h-10 absolute top-[10%] right-[10%] text-yellow" solid />
        {:else}
          <Icon name="heart" class="w-10 h-10 absolute top-[10%] right-[10%] text-yellow" outline />
        {/if}
      </div>
    </div>
    <h1 class="font-bold">{business[0].name}</h1>
    <p>{business[0].description}</p>
    <p class="text-gray-400">{business[0].businessCategory}</p>

    <button class="btn mr-2 ml-2 text-black bg-white border-1"
      ><span><Icon name="share" class="h-6 w-6" /></span>Share</button>

    <div class="flex border-t-2 mt-4 pt-4">
      <Icon name="location-marker" class="h-6 w-6" />
      <p class="pl-4">{business[0].location}</p>
    </div>
    <div class="flex border-t-2 mt-4 pt-4">
      <Icon name="clock" class="h-6 w-6" />
      <p class="pr-4 pl-4">Opening Hours</p>
      <div>
        {#each everythingBeforeTheCurrentDay as day}
          <p>{day}</p>
        {/each}
        <p>{currentDayOpenHours}</p>
          {#each everythingAfterTheCurrentDay as day}
            <p>{day}</p>
          {/each}
      </div>
      {#if !visible}
        <div
          on:click="{() => {
            visible = !visible;
            console.log(visible);
          }}">
          <Icon name="chevron-down" class="h-6 w-6" />
        </div>
      {/if}
    </div>
  {:else}
    <p>loading details...</p>
  {/if}
</section>
