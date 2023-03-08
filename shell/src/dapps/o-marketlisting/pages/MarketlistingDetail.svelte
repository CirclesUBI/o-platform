<script lang="ts">
import { onMount } from "svelte";
import { ApiClient } from "../../../shared/apiConnection";
import { Businesses, LinkTargetType, Profile } from "../../../shared/api/data/types";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import { fade } from "svelte/transition";
import Map from "../../../dapps/o-marketlisting/atoms/Map.svelte";
import { ShareLinkDocument, ShareLinkMutationVariables } from "../../../shared/api/data/types";
import { myLocation } from "../../../shared/stores/myLocation";
import { marketFavoritesStore } from "../stores/marketFavoritesStore";
import { marketStore } from "../stores/marketStore";
import CopyClipboard from "../../../shared/atoms/CopyClipboard.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import { log } from "xstate/lib/actions";
import { UserActionItem, UserActions } from "../../../shared/userActions";
import { transfer } from "../../o-banking/processes/transfer";
import DetailActionBar from "../../../shared/molecules/DetailActionBar.svelte";
import { me } from "../../../shared/stores/me";

export let circlesAddress: string;

let business: Businesses;

let visible: boolean = false;
let currentDayOpenHours = "";
let everythingBeforeTheCurrentDay = [];
let everythingAfterTheCurrentDay = [];
let link: string;
let showShareOptions: boolean = false;

let hasOpeningHours: boolean = false;

let mapHeight = "16em";

let detailActions: UserActionItem[];
let availableActions = [];

onMount(async () => {
  detailActions = [];

  let $me: Profile | null = null;
  let actions: UserActionItem[] = [];

  const unsub = me.subscribe((o) => {
    $me = o;
  });
  unsub();
  if (!$me) throw new Error(window.o.i18n("shared.userActions.errors.couldNotLoadYourProfile"));

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

    hasOpeningHours = checkIfOpeningHoursExists(businessHours);

    availableActions.push({
      key: "transfer",
      icon: "cash",
      title: window.o.i18n("shared.userActions.sendMoney"),
      action: async () => {
        window.o.runProcess(transfer, {
          safeAddress: $me.circlesAddress,
          recipientAddress: business.circlesAddress,
          privateKey: sessionStorage.getItem("circlesKey"),
        });
      },
    });
  });
});

function parseTimeString(timeString, type) {
  const [timeRange, weekdays] = timeString.split(" ");
  const hoursArray = timeRange.split(";");

  if (type === "weekday") {
    return weekdays;
  }
  if (type === "hours") {
    return hoursArray[0] !== "" ? hoursArray : false;
  }
}

function checkIfOpeningHoursExists(businessHours: string[]) {
  for (let i = 0; i < businessHours.length; i++) {
    let day = businessHours[i];
    for (let y = 0; y < businessHours[i].length; y++) {
      if (day[y].match(/[0-9]/g)) {
        return true;
      }
    }
  }
}

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
    <div class="flex w-full justify-center">
      <div class="relative xl:w-2/3 xl:h-2/3">
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
    </div>
    <div class="flex justify-between">
      <div class="flex flex-col">
        <h1 class="mt-3 font-bold font-heading text-heading">{business.name}</h1>
        <p class="text-black">{business.description ? business.description : ""}</p>
      </div>
      <div class="mr-12">
        <DetailActionBar actions="{availableActions}" />
      </div>
    </div>

    <div class="flex flex-row w-full mt-3">
      <p class="flex-grow text-xl text-grey font-heading">
        {business.businessCategory ? business.businessCategory : ""}
      </p>
    </div>

    {#if !showShareOptions}
      <button
        class=" mt-3 text-base font-heading btn btn-outline btn-sm rounded-full"
        on:click="{() => {
          showShareOptions = !showShareOptions;
        }}">
        <span><Icons icon="share" customClass="w-4 h-4" /></span>
        <p class="pl-1">Share</p>
      </button>
    {/if}

    {#if showShareOptions}
      <div class="flex flex-row justify-between w-full pl-4 pr-6 mt-3">
        <div class="text-center rounded-full cursor-pointer w-10 h-10 copylink bg-light-light">
          <CopyClipboard text="{link}" let:copy>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div on:click="{copy}">
              <Icon name="link" class="self-center inline w-10 h-10 heroicon smallicon p-2" />
            </div>
          </CopyClipboard>
        </div>
        <div class="text-center rounded-full cursor-pointer w-10 h-10 copylink bg-light-light">
          <a href="mailto:?subject=Invitation%20to%20Circlesland&body=Hey, i'd like to show you this cool market. Check it out: {link}" target="_blank" rel="noreferrer">
            <Icon name="mail" class="inline w-10 h-10 heroicon smallicon p-2" />
          </a>
        </div>
        <div class="-mt-1 text-center cursor-pointer whatsapp">
          <a href="https://api.whatsapp.com/send?text=Hey, i'd like to show you this cool market. Check it out: {link}" target="_blank" rel="noreferrer">
            <Icons icon="whatsapp" customClass="inline" size="{12}" />
          </a>
        </div>
        <div class="text-center cursor-pointer telegram">
          <a href="https://telegram.me/share/url?url={link}&text=Hey, i'd like to show you this cool market. Check it out: {link}" target="_blank" rel="noreferrer">
            <Icons icon="telegram" customClass="inline" size="{10}" />
          </a>
        </div>
      </div>
    {/if}

    {#if hasOpeningHours}
      <div class="flex pt-4 mt-4 border-t-2 text-black">
        <div>
          <div class="flex mb-5 ml-2">
            <Icon name="clock" class="w-6 h-6" />
            <div class="pl-4 pr-4">Opening Hours</div>
            <div
              role="presentation"
              on:click="{() => {
                visible = !visible;
              }}">
              <Icon name="chevron-down" class="w-6 h-6" />
            </div>
          </div>
          <div class="opening-hours-container">
            {#if visible}
              {#each everythingBeforeTheCurrentDay as day}
                <div class="flex mb-3 flex-col">
                  {#if parseTimeString(day, "weekday")}
                    <div class="flex table-cell pl-2 font-semibold mb-1">
                      {parseTimeString(day, "weekday")}
                    </div>
                  {/if}
                  {#if parseTimeString(day, "hours")}
                    <div class="flex ml-2 flex-wrap">
                      {#each parseTimeString(day, "hours") as hours}
                        <div class="flex badge whitespace-nowrap badge-success badge-outline mr-2">{hours}</div>
                      {/each}
                    </div>
                  {:else}
                    <div class="badge badge-error badge-outline ml-2">Closed</div>
                  {/if}
                </div>
              {/each}
            {/if}

            {#if currentDayOpenHours}
              <div class="flex mb-3 flex-col">
                {#if parseTimeString(currentDayOpenHours, "weekday")}
                  <div class="flex table-cell pl-2 font-semibold mb-1">
                    {parseTimeString(currentDayOpenHours, "weekday")}
                  </div>
                {/if}
                {#if parseTimeString(currentDayOpenHours, "hours")}
                  <div class="flex ml-2 flex-wrap">
                    {#each parseTimeString(currentDayOpenHours, "hours") as hours}
                      <div class="flex badge whitespace-nowrap badge-success badge-outline mr-2">{hours}</div>
                    {/each}
                  </div>
                {:else}
                  <div class="badge badge-error badge-outline ml-2">Closed</div>
                {/if}
              </div>
            {/if}

            {#if visible}
              {#each everythingAfterTheCurrentDay as after}
                <div class="flex mb-3 flex-col">
                  {#if parseTimeString(after, "weekday")}
                    <div class="flex table-cell pl-2 font-semibold mb-1">
                      {parseTimeString(after, "weekday")}
                    </div>
                  {/if}
                  {#if parseTimeString(after, "hours")}
                    <div class="flex ml-2 flex-wrap">
                      {#each parseTimeString(after, "hours") as hours}
                        <div class="flex badge whitespace-nowrap badge-success badge-outline mr-2">{hours}</div>
                      {/each}
                    </div>
                  {:else}
                    <div class="badge badge-error badge-outline ml-2">Closed</div>
                  {/if}
                </div>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/if}

    {#if business.phoneNumber}
      <div class="flex pt-4 mt-4 border-t-2 text-black">
        <Icon name="phone" class="w-6 h-6" />
        <p class="pl-4">{business.phoneNumber}</p>
      </div>
    {/if}

    <div class="flex pt-4 mt-4 border-t-2" style="height: {mapHeight};">
      {#if business.lat && business.lon}
        {#if $myLocation instanceof GeolocationPosition}
          <Map height="{mapHeight}" position="{{ lat: business.lat, long: business.lon }}" bubbletext="{business.name}" />
        {:else}
          <Map height="{mapHeight}" position="{{ lat: business.lat, long: business.lon }}" bubbletext="{business.name}" />
        {/if}
      {/if}
    </div>
  {:else}
    <p>loading details...</p>
  {/if}
</section>

<style>
:global(.badge) {
  text-align: center;
  flex-wrap: wrap;
  margin-bottom: 7px;
}
</style>
