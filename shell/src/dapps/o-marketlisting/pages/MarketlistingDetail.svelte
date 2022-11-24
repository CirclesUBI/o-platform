<script lang="ts">
import { onMount } from "svelte";
import { ApiClient } from "../../../shared/apiConnection";
import { Businesses, LinkTargetType } from "../../../shared/api/data/types";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import { fade } from "svelte/transition";
import Map from "../../../dapps/o-marketlisting/atoms/Map.svelte";
import { ShareLinkDocument, ShareLinkMutationVariables } from "../../../shared/api/data/types";
import { myLocation } from "../../../shared/stores/myLocation";
import { marketFavoritesStore } from "../stores/marketFavoritesStore";
import { marketStore } from "../stores/marketStore";

export let circlesAddress: string;

let business: Businesses;

let visible: boolean = false;
let currentDayOpenHours = "";
let everythingBeforeTheCurrentDay = [];
let everythingAfterTheCurrentDay = [];

let mapHeight = "16em";

onMount(async () => {
  return marketStore.subscribe((data) => {
    if (!data || data.businesses.length == 0) {
      return;
    }

    business = data.businesses.find((o) => o.circlesAddress == circlesAddress);
    if (!business) return;

    const currentDateIndex = new Date().getDay();
    const businessHours = [
      business.businessHoursSunday + " Sunday",
      business.businessHoursMonday + " Monday",
      business.businessHoursTuesday + " Tuesday",
      business.businessHoursWednesday + " Wednesday",
      business.businessHoursThursday + " Thursday",
      business.businessHoursFriday + " Friday",
      business.businessHoursSaturday + " Saturday",
    ];

    currentDayOpenHours = businessHours[currentDateIndex];
    everythingBeforeTheCurrentDay = businessHours.slice(0, currentDateIndex);
    if (currentDateIndex < businessHours.length) {
      everythingAfterTheCurrentDay = businessHours.slice(currentDateIndex + 1, businessHours.length);
    }
  });
});

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
  {#if business}
    <div class="relative">
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <img src="{business.picture}" alt="picture of the business" class="w-full h-full rounded-2xl" />

      <div
        role="presentation"
        on:click="{() => {
          marketFavoritesStore.toggleFavorite(business.circlesAddress);
        }}">
        {#if $marketFavoritesStore[business.circlesAddress]}
          <Icon name="heart" class="w-10 h-10 absolute top-[10%] right-[10%] text-yellow" solid />
        {:else}
          <Icon name="heart" class="w-10 h-10 absolute top-[10%] right-[10%] text-yellow" outline />
        {/if}
      </div>
    </div>
    <h1 class="mt-1 font-bold">{business.name}</h1>
    <p>{business.description ? business.description : ""}</p>

    <div class="flex flex-row w-full mt-1">
      <p class="flex-grow text-gray-400">{business.businessCategory}</p>
      <button class="self-end -mt-1 btn btn-outline btn-sm" on:click="{shareLink}">
        <span><Icon name="share" class="w-6 h-6" /></span>Share
      </button>
    </div>

    <div class="flex pt-4 mt-4 border-t-2">
      <Icon name="clock" class="w-6 h-6" />
      <p class="pl-4 pr-4">Opening Hours</p>
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
          <Icon name="chevron-down" class="w-6 h-6" />
        </div>
      {/if}
    </div>
    <div class="flex pt-4 mt-4 border-t-2">
      <Icon name="phone" class="w-6 h-6" />
      <p class="pl-4">{business.phoneNumber}</p>
    </div>

    <div class="flex pt-4 mt-4 border-t-2" style="height: {mapHeight};">
      {#if business.lat && business.lon}
        {#if $myLocation instanceof GeolocationPosition}
          <Map
            height="{mapHeight}"
            position="{{ lat: business.lat, long: business.lon }}"
            bubbletext="{business.name}" />
        {:else}
          <Map
            height="{mapHeight}"
            position="{{ lat: business.lat, long: business.lon }}"
            bubbletext="{business.name}" />
        {/if}
      {/if}
    </div>
  {:else}
    <p>loading details...</p>
  {/if}
</section>
