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

  const currentDateIndex = new Date().getDay();
  const businessHours = [
    business[0].businessHoursSunday + " Sunday",
    business[0].businessHoursMonday + " Monday",
    business[0].businessHoursTuesday + " Tuesday",
    business[0].businessHoursWednesday + " Wednesday",
    business[0].businessHoursThursday + " Thursday",
    business[0].businessHoursFriday + " Friday",
    business[0].businessHoursSaturday + " Saturday",
  ];

  currentDayOpenHours = businessHours[currentDateIndex];
  everythingBeforeTheCurrentDay = businessHours.slice(0, currentDateIndex);
  if (currentDateIndex < businessHours.length) {
    everythingAfterTheCurrentDay = businessHours.slice(currentDateIndex + 1, businessHours.length);
  }

  console.log("before", everythingBeforeTheCurrentDay);
  console.log("today", currentDayOpenHours);
  console.log("after", everythingAfterTheCurrentDay);
  console.log("current day index", new Date().getDay());
});

async function getBusiness(id: string) {
  let queryResult = await ApiClient.query<Businesses[], AllBusinessesQueryVariables>(AllBusinessesDocument, {
    id: parseInt(id),
  });

  return queryResult;
}
</script>

<section class="p-4">
  {#if business.length}
    <div class="relative">
      <img src="{business[0].picture}" alt="picture of the business" class="h-full w-full rounded-2xl" />

      <!-- svelte-ignore a11y-click-events-have-key-events -->
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
        {#if visible}
          {#each everythingBeforeTheCurrentDay as day}
            <p transition:fade>{day}</p>
          {/each}
        {/if}

        <p>{currentDayOpenHours}</p>
        {#if visible}
          {#each everythingAfterTheCurrentDay as after}
            <p transition:fade>{after}</p>
          {/each}
        {/if}
      </div>
      {#if !visible}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          on:click="{() => {
            visible = !visible;
            console.log(visible);
          }}">
          <Icon name="chevron-down" class="h-6 w-6" />
        </div>
      {/if}
    </div>
    <div class="flex border-t-2 mt-4 pt-4">
      <Icon name="phone" class="h-6 w-6" />
      <p class="pl-4">{business[0].phoneNumber}</p>
    </div>
  {:else}
    <p>loading details...</p>
  {/if}
</section>
