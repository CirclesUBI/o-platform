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
import CopyClipboard from "../../../shared/atoms/CopyClipboard.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";

export let circlesAddress: string;

let business: Businesses;

let visible: boolean = false;
let currentDayOpenHours = "";
let everythingBeforeTheCurrentDay = [];
let everythingAfterTheCurrentDay = [];
let link: string;
let showShareOptions: boolean = false;

let mapHeight = "16em";

onMount(async () => {
  shareLink();
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
  link = await ApiClient.mutate<string, ShareLinkMutationVariables>(ShareLinkDocument, {
    targetType: LinkTargetType.Business,
    targetKey: circlesAddress,
  });
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
    <h1 class="mt-3 font-bold font-heading">{business.name}</h1>
    <p>{business.description ? business.description : ""}</p>

    <div class="flex flex-row w-full mt-3">
      <p class="flex-grow text-gray-400">{business.businessCategory ? business.businessCategory : ""}</p>
      <button
        class="self-end -mt-1 btn btn-outline btn-sm border-gray-500 text-gray-500"
        on:click="{() => {
          showShareOptions = !showShareOptions;
        }}">
        {#if !showShareOptions}
          <span><Icons icon="share" customClass="w-6 h-6" /></span><p class="pl-1">Share</p>
        {:else}
          <span>X </span>
        {/if}
      </button>
    </div>

    {#if showShareOptions}
      <div class="flex flex-row w-full mt-6 justify-between pr-6 pl-4">
        <div class="w-7 h-7 text-center cursor-pointer copylink rounded-full bg-light-light">
          <CopyClipboard text="{link}" let:copy>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div on:click="{copy}">
              <Icon name="link" class="inline self-center w-6 h-6 heroicon smallicon" />
            </div>
          </CopyClipboard>
        </div>
        <div class="w-7 h-7 text-center cursor-pointer copylink rounded-full bg-light-light">
          <a
            href="mailto:?subject=Invitation%20to%20Circlesland&body=Hey, i'd like to show you this cool market. Check it out: {link}"
            target="_blank"
            rel="noreferrer">
            <Icon name="mail" class="inline w-6 h-6 heroicon smallicon" />
          </a>
        </div>
        <div class="-mt-1 text-center cursor-pointer whatsapp">
          <a
            href="https://api.whatsapp.com/send?text=Hey, i'd like to show you this cool market. Check it out: {link}"
            target="_blank"
            rel="noreferrer">
            <Icons icon="whatsapp" customClass="inline" size="{8}" />
          </a>
        </div>
        <div class="text-center cursor-pointer telegram">
          <a
            href="https://telegram.me/share/url?url={link}&text=Hey, i'd like to show you this cool market. Check it out: {link}"
            target="_blank"
            rel="noreferrer">
            <Icons icon="telegram" customClass="inline" size="{6}" />
          </a>
        </div>
      </div>
    {/if}

    {#if business.businessHoursSunday}
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
    {/if}

    {#if business.phoneNumber}
      <div class="flex pt-4 mt-4 border-t-2">
        <Icon name="phone" class="w-6 h-6" />
        <p class="pl-4">{business.phoneNumber}</p>
      </div>
    {/if}

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
