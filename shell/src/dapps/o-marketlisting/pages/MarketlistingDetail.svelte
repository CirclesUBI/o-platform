<script lang="ts">
import { onMount } from "svelte";
import { ApiClient } from "../../../shared/apiConnection";
import { Businesses, LinkTargetType, Profile } from "../../../shared/api/data/types";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import { ShareLinkDocument, ShareLinkMutationVariables } from "../../../shared/api/data/types";
import { myLocation } from "../../../shared/stores/myLocation";
import { marketFavoritesStore } from "../stores/marketFavoritesStore";
import marketStore from "../stores/marketStore";
import CopyClipboard from "../../../shared/atoms/CopyClipboard.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import GoogleMap from "../../../shared/molecules/GoogleMaps/GoogleMap.svelte";
import { log } from "xstate/lib/actions";
import { Environment } from "../../../shared/environment";
import { UserActionItem, UserActions } from "../../../shared/userActions";
import { transfer } from "../../o-banking/processes/transfer";
import DetailActionBar from "../../../shared/molecules/DetailActionBar.svelte";
import { me } from "../../../shared/stores/me";
import { _ } from "svelte-i18n";
import Label from "../../../shared/atoms/Label.svelte";
import { contacts } from "../../../shared/stores/contacts";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export let circlesAddress: string;
let business: Businesses;
let visible: boolean = false;
let link: string;
let showShareOptions: boolean = false;
let mapHeight = "16em";
let nextEventTimeString: string = "";
const mapOptions = {
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
};
type BusinessHour = {
  day: string;
  hours?: string[];
  isNow: boolean;
};

let hours: BusinessHour[];
let isOpenNow: boolean;
let noData: boolean;
let detailActions: UserActionItem[];
let availableActions = [];
let isMyShop: boolean;
let shopOwner: Profile[];
onMount(async () => {
  detailActions = [];
  let $me: Profile | null = null;
  const unsub = me.subscribe((o) => {
    $me = o;
  });
  unsub();
  if (!$me) throw new Error(window.o.i18n("shared.userActions.errors.couldNotLoadYourProfile"));
  shareLink();
  return marketStore.subscribe(async (data) => {
    if (!data || data.businesses.length == 0) {
      return;
    }
    business = data.businesses.find((o) => o.circlesAddress == circlesAddress);
    if (!business) {
      await marketStore.loadSingleItem(circlesAddress);
    }
    const shopOwnerData = await contacts.findBySafeAddress(business.circlesAddress);
    shopOwner = shopOwnerData.contactAddress_Profile.members;

    const currentDateIndex = new Date().getDay();

    // adding a nice comment so this will get picked back up by the deployment
    isMyShop = $me.circlesAddress === business.circlesAddress || $me.circlesAddress === shopOwner[0].circlesAddress;

    availableActions.push({
      key: "transfer",
      icon: "sendmoney",
      title: window.o.i18n("shared.userActions.sendMoney"),
      action: async () => {
        window.o.runProcess(transfer, {
          safeAddress: $me.circlesAddress,
          recipientAddress: business.circlesAddress,
          privateKey: sessionStorage.getItem("circlesKey"),
        });
      },
    });

    hours = [
      {
        day: "dapps.o-marketlisting.pages.marketListingDetail.sunday",
        hours: business.businessHoursSunday?.split(";"),
        isNow: false,
      },
      {
        day: "dapps.o-marketlisting.pages.marketListingDetail.monday",
        hours: business.businessHoursMonday?.split(";"),
        isNow: false,
      },
      {
        day: "dapps.o-marketlisting.pages.marketListingDetail.tuesday",
        hours: business.businessHoursTuesday?.split(";"),
        isNow: false,
      },
      {
        day: "dapps.o-marketlisting.pages.marketListingDetail.wednesday",
        hours: business.businessHoursWednesday?.split(";"),
        isNow: false,
      },
      {
        day: "dapps.o-marketlisting.pages.marketListingDetail.thursday",
        hours: business.businessHoursThursday?.split(";"),
        isNow: false,
      },
      {
        day: "dapps.o-marketlisting.pages.marketListingDetail.friday",
        hours: business.businessHoursFriday?.split(";"),
        isNow: false,
      },
      {
        day: "dapps.o-marketlisting.pages.marketListingDetail.saturday",
        hours: business.businessHoursSaturday?.split(";"),
        isNow: false,
      },
    ];
    hours[currentDateIndex].isNow = true;

    if (hours[currentDateIndex].hours) {
      isOpenNow = checkIsOpenNow(hours[currentDateIndex].hours);
      // Determine the next time the shop closes or opens
      if (isOpenNow) {
        let nextTimes = hours[currentDateIndex].hours[0].split("-");
        nextEventTimeString = ` - ${$_("dapps.o-marketlisting.pages.marketListingDetail.closes")} ${nextTimes[1]}`;
      } else {
        let nextEntry = hours.find((entry, index) => index > currentDateIndex && entry.hours[0] !== "");
        if (nextEntry == undefined) {
          nextEntry = hours.find((entry, index) => index >= 0 && entry.hours[0] !== "");
        }
        if (nextEntry) {
          let nextTimes = nextEntry.hours[0].split("-");
          nextEventTimeString = ` - ${$_("dapps.o-marketlisting.pages.marketListingDetail.opens")} ${$_(nextEntry.day)} ${nextTimes[0]}`;
        }
      }
    } else {
      noData = true;
    }
  });
});
function convertH2M(timeInHour) {
  var timeParts = timeInHour.split(":");
  return Number(timeParts[0]) * 60 + Number(timeParts[1]);
}
function checkIsOpenNow(timesArray) {
  if (!timesArray) {
    return;
  }
  const d = dayjs().tz("Asia/Makassar");
  let nIn = convertH2M(d.hour() + ":" + d.minute());
  let open = false;

  if (timesArray) {
    timesArray.forEach(function (times, index) {
      if (open) {
        return true;
      }
      times = times.split("-");
      if (times[1]) {
        let begIn = convertH2M(times[0]);
        let endIn = convertH2M(times[1]);
        open = nIn >= begIn && nIn < endIn;
        return open;
      }
    });
  } else {
    return false;
  }
  return open;
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
    <div class="flex justify-center w-full">
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
        <div class="mb-0 text-4xl font-bold tracking-normal break-all font-heading text-heading">{business.name}</div>
        <div class="flex flex-row w-full pt-0 mt-0 text-xl text-grey font-heading">
          {#if business.businessCategory}
            <Label key="{business.businessCategory}" />
          {/if}
        </div>
        {#if business.description}
          <p class="mt-2 text-black break-word"><Label text="{business.description}" /></p>
        {/if}
      </div>
    </div>
    <div class="flex justify-start pt-4">
      <DetailActionBar actions="{!isMyShop ? availableActions : []}" />
    </div>
    {#if !noData}
      <div class="flex pt-4 mt-4 text-black border-t-2">
        <div>
          <div
            class="flex cursor-pointer"
            role="presentation"
            on:click="{() => {
              visible = !visible;
            }}">
            <div>
              <Icon name="clock" class="inline w-5 h-5 -mt-1 -ml-1" />
              <span>
                {#if isOpenNow}
                  <span class="text-success">
                    <Label key="common.open" />
                  </span>
                {:else}
                  <span class="text-alert">
                    <Label key="common.closed" />
                  </span>
                {/if}
                {nextEventTimeString}
                {#if visible}
                  <Icon name="chevron-up" class="inline w-5 h-5 -mt-1 -ml-1" />
                {:else}
                  <Icon name="chevron-down" class="inline w-5 h-5 -mt-1 -ml-1" />
                {/if}
              </span>
            </div>
          </div>
          <div class="opening-hours-container">
            {#if visible && hours}
              <div class="grid gap-2 mt-4 grid-rows">
                {#each hours as businessHour}
                  <div class="grid grid-cols-2 gap-1">
                    <div class="text-sm"><Label key="{businessHour.day}" /></div>
                    <div class="text-sm">{@html businessHour.hours[0].length ? businessHour.hours.join(", ") : "<span class='text-alert'>" + window.o.i18n("common.closed") + "</span>"}</div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
    {#if business.phoneNumber}
      <div class="flex pt-4 mt-4 text-black border-t-2">
        <a href="https://wa.me/{business.phoneNumber}" target="_blank" rel="noreferrer"><Icons icon="whatsapp" customClass="inline -mt-1" size="{6}" /></a>
        <p class="pl-2"><a href="https://wa.me/{business.phoneNumber}">{business.phoneNumber}</a></p>
      </div>
    {/if}
    {#if shopOwner && shopOwner.length}
      <div class="flex pt-4 mt-4 border-t-2 text-default">
        <section class="justify-center mb-2">
          <div class="flex flex-col w-full pt-2 space-y-1">
            <div class="font-bold text-left text-default text-2xs">
              <Label key="dapps.o-contacts.pages.profile.members" />
            </div>
            <div class="flex flex-row flex-wrap mt-2">
              {#each shopOwner as shopOwnerProfile}
                <div class="flex items-center mt-2 mr-2">
                  <UserImage profile="{shopOwnerProfile}" />
                  <div class="ml-3">{shopOwnerProfile.displayName}</div>
                </div>
              {/each}
            </div>
          </div>
        </section>
      </div>
    {/if}
    <div class="flex pt-4 mt-4 border-t-2" style="height: {mapHeight};">
      {#if business.lat && business.lon && business.location}
        <GoogleMap
          apiKey="{Environment.placesApiKey}"
          zoom="{17}"
          options="{mapOptions}"
          center="{{ lat: business.lat, lng: business.lon }}"
          placeId="{business.location}"
          placeName="{business.name}" />
      {/if}
    </div>
    {#if !showShareOptions}
      <div class="flex flex-row justify-center w-full mt-3 mb-3">
        <button
          class="mt-3 text-base rounded-full font-heading btn btn-outline btn-sm"
          on:click="{() => {
            showShareOptions = !showShareOptions;
          }}">
          <span><Icons icon="share" customClass="w-4 h-4" /></span>
          <p class="pl-1"><Label key="common.share" /></p>
        </button>
      </div>
    {/if}
    {#if showShareOptions}
      <div class="flex flex-row justify-between w-full pl-4 pr-6 mt-6 mb-3">
        <div class="w-10 h-10 text-center rounded-full cursor-pointer copylink bg-light-light">
          <CopyClipboard text="{link}" let:copy>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div on:click="{copy}">
              <Icon name="link" class="self-center inline w-10 h-10 p-2 heroicon smallicon" />
            </div>
          </CopyClipboard>
        </div>
        <div class="w-10 h-10 text-center rounded-full cursor-pointer copylink bg-light-light">
          <a href="mailto:?subject=Invitation%20to%20Circlesland&body={window.o.i18n('dapps.o-marketlisting.pages.marketListingDetail.shareMarket')} {link}" target="_blank" rel="noreferrer">
            <Icon name="mail" class="inline w-10 h-10 p-2 heroicon smallicon" />
          </a>
        </div>
        <div class="-mt-1 text-center cursor-pointer whatsapp">
          <a href="https://wa.me/?text={window.o.i18n('dapps.o-marketlisting.pages.marketListingDetail.shareMarket')} {link}" target="_blank" rel="noreferrer">
            <Icons icon="whatsapp" customClass="inline" size="{12}" />
          </a>
        </div>
        <div class="text-center cursor-pointer telegram">
          <a href="https://telegram.me/share/url?url={link}&text={window.o.i18n('dapps.o-marketlisting.pages.marketListingDetail.shareMarket')} {link}" target="_blank" rel="noreferrer">
            <Icons icon="telegram" customClass="inline" size="{10}" />
          </a>
        </div>
      </div>
    {/if}
  {:else}
    <p>{$_("dapps.o-marketlisting.pages.marketListingDetail.loadingDetails")}</p>
  {/if}
</section>

<style>
:global(.badge) {
  text-align: center;
  flex-wrap: wrap;
  margin-bottom: 7px;
}
</style>
