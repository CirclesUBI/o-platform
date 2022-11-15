<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { onMount } from "svelte";
import { ApiClient } from "../../../shared/apiConnection";
import {
  AllBusinessesDocument,
  AllBusinessesQueryVariables,
  Businesses,
  LinkTargetType,
  MutationToggleFavoriteArgs,
  ToggleFavoriteDocument,
} from "../../../shared/api/data/types";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import { fade } from "svelte/transition";
import { me } from "../../../shared/stores/me";
import { ShareLinkDocument, ShareLinkMutationVariables } from "../../../shared/api/data/types";
import { favoriteBusinesses } from "../../../shared/stores/businesses";
import Map from "../atoms/Map.svelte";

//export let runtimeDapp: RuntimeDapp<any>;
//export let routable: Routable;
export let circlesAddress: string;

let business: Businesses[] = [];
let favorites: { [circlesAddress: string]: boolean } = {};

let visible: boolean = false;
let currentDayOpenHours = "";
let allHoursBeforeTheCurrentDay = [];
let allHoursAfterTheCurrentDay = [];
let allHoursStartingFromCurrentDay = [];
let currentDay = "";
let daysBeforeCurrent = [];
let daysAfterCurrent = [];
let allDaysStartingFromCurrenDay = [];
let isOpen: boolean = false;
let allOpeningHoursAndDays = [];
let opensAt = "";
let closesAt = "";

onMount(async () => {
  business = await favoriteBusinesses.getBusiness(circlesAddress);

  me.subscribe((m) => {
    favorites = {};
    m.favorites.forEach((f) => {
      favorites[f.favorite.circlesAddress] = true;
    });
    favorites = favorites;
  });

  console.log(business);

  const currentDateIndex = new Date().getDay();
  const businessHours = [
    business[0].businessHoursSunday,
    business[0].businessHoursMonday,
    business[0].businessHoursTuesday,
    business[0].businessHoursWednesday,
    business[0].businessHoursThursday,
    business[0].businessHoursFriday,
    business[0].businessHoursSaturday,
  ];

  const days = ["Sunday ", "Monday ", "Tuesday ", "Wednesday ", "Thursday ", "Friday ", "Saturday "];

  currentDayOpenHours = businessHours[currentDateIndex];
  currentDay = days[currentDateIndex];
  allHoursBeforeTheCurrentDay = businessHours.slice(0, currentDateIndex);
  daysBeforeCurrent = days.slice(0, currentDateIndex);
  if (currentDateIndex < businessHours.length) {
    daysAfterCurrent = days.slice(currentDateIndex + 1, days.length);
    allHoursAfterTheCurrentDay = businessHours.slice(currentDateIndex + 1, businessHours.length);

    allDaysStartingFromCurrenDay = allDaysStartingFromCurrenDay.concat(
      currentDay,
      allHoursAfterTheCurrentDay,
      allDaysStartingFromCurrenDay
    );
    allHoursStartingFromCurrentDay = allHoursStartingFromCurrentDay.concat(
      currentDayOpenHours,
      allHoursAfterTheCurrentDay,
      allHoursBeforeTheCurrentDay
    );
  }

  function bringDaysAndHuorsTogether(openingHours: string[], days: string[]) {
    for (let i = 0; i < openingHours.length; i++) {
      allOpeningHoursAndDays[i] = days[i] + openingHours[i];
    }
    console.log(allOpeningHoursAndDays);
  }

  bringDaysAndHuorsTogether(businessHours, days);
  checkIfOpen();
});

function checkIfOpen() {
  let currentTime = new Date().getHours();
  let hours = currentDayOpenHours.split("-");

  if (currentTime < parseInt(hours[0]) || currentTime >= parseInt(hours[1])) {
    isOpen = false;
    opensAt = hours[0];
  } else {
    isOpen = true;
    closesAt = hours[1];
  }
}

async function toggleFavorite(circlesAddress: string) {
  favorites[circlesAddress] = !favorites[circlesAddress];
  ApiClient.mutate<boolean, MutationToggleFavoriteArgs>(ToggleFavoriteDocument, {
    circlesAddress: circlesAddress,
  }).then((_isFavorite) => {
    favorites[circlesAddress] = _isFavorite;
  });
}

async function getBusiness(circlesAddress: string) {
  return await ApiClient.query<Businesses[], AllBusinessesQueryVariables>(AllBusinessesDocument, {
    circlesAddress: circlesAddress,
  });
}

async function shareLink() {
  const link = await ApiClient.mutate<string, ShareLinkMutationVariables>(ShareLinkDocument, {
    targetType: LinkTargetType.Business,
    targetKey: circlesAddress,
  });
  alert(link);
}
</script>

<div class="bg-marketlisting" style="display: none;"></div>
<section class="p-4">
  {#if business.length}
    <div class="relative">
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <img src="{business[0].picture}" alt="picture of the business" class="h-full w-full rounded-2xl" />
      <div
        role="presentation"
        on:click="{async () => {
          await toggleFavorite(circlesAddress);
          business = await favoriteBusinesses.getBusiness(circlesAddress);
        }}">
        {#if favorites[business[0].circlesAddress]}
          <Icon name="heart" class="w-10 h-10 absolute top-[10%] right-[10%] text-yellow" solid />
        {:else}
          <Icon name="heart" class="w-10 h-10 absolute top-[10%] right-[10%] text-yellow" outline />
        {/if}
      </div>
    </div>
    <h1 class="font-bold">{business[0].name}</h1>
    <p>{business[0].description}</p>
    <p class="text-gray-400">{business[0].businessCategory}</p>

    <button class="btn mr-2 ml-2 text-black bg-white border-1" on:click="{shareLink}">
      <span><Icon name="share" class="h-6 w-6" /></span>Share
    </button>

    <div class="flex border-t-2 mt-4 pt-4">
      <Icon name="clock" class="h-6 w-6" />
      <p class="pr-4 pl-4">Opening Hours</p>
      <div class="pr-2">
        {#if !visible}
          {#if isOpen}
            <div class="inline-flex">
              <p class="text-green-500">open</p>
              <p class="pl-1">- closes at: {closesAt}</p>
            </div>
          {:else}
            <div class="inline-flex">
              <p class="text-red-500">closed</p>
              <p class="pl-1">- opens at: {opensAt}</p>
            </div>
          {/if}
        {/if}
        {#if visible}
          {#each allOpeningHoursAndDays as openingHours}
            <p in:fade>{openingHours}</p>
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
    <div class="flex border-t-2 mt-4 pt-4">
      <Icon style="position: absolute;" name="location-marker" class="h-6 w-6" />
      <Map width="{'100%'}" height="{'8em'}" />
    </div>
  {:else}
    <p>loading details...</p>
  {/if}
</section>
