<script lang="ts">
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {onMount} from "svelte";
  import {ApiClient} from "../../../shared/apiConnection";
  import {
    AllBusinessesDocument,
    AllBusinessesQueryVariables,
    Businesses,
    LinkTargetType,
    MutationToggleFavoriteArgs,
    ToggleFavoriteDocument
  } from "../../../shared/api/data/types";
  import Icon from "@krowten/svelte-heroicons/Icon.svelte";
  import {fade} from "svelte/transition";
  import {me} from "../../../shared/stores/me";
  import Map from "src/dapps/o-marketlisting/atoms/Map.svelte";
  import {ShareLinkDocument, ShareLinkMutationVariables} from "src/shared/api/data/types";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
  export let circlesAddress: string;

let business: Businesses[] = [];
let favorites: { [circlesAddress: string]: boolean } = {};

let visible: boolean = false;
let currentDayOpenHours = "";
let everythingBeforeTheCurrentDay = [];
let everythingAfterTheCurrentDay = [];

onMount(async () => {
  business = await favoriteBusinesses.getBusiness(id);

  me.subscribe((m) => {
    favorites = {};
    m.favorites.forEach((f) => {
      favorites[f.favorite.circlesAddress] = true;
    });
    favorites = favorites;
  })

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

async function toggleFavorite(circlesAddress:string) {
  favorites[circlesAddress]  = !favorites[circlesAddress] ;
  ApiClient.mutate<boolean, MutationToggleFavoriteArgs>(ToggleFavoriteDocument, {
    circlesAddress: circlesAddress
  }).then(_isFavorite => {
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
    targetKey: circlesAddress
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

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click="{async () => {
          isFavorite = await favoriteBusinesses.toggleFavorite(business[0].circlesAddress);
          me.reload();
          business = await favoriteBusinesses.getBusiness(id);
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

    <button class="btn mr-2 ml-2 text-black bg-white border-1" on:click={shareLink}>
      <span><Icon name="share" class="h-6 w-6" /></span>Share
    </button>

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
    <div class="flex border-t-2 mt-4 pt-4">
      <Icon style="position: absolute;" name="location-marker" class="h-6 w-6" />
      <Map width={"100%"} height={"8em"} />
    </div>
  {:else}
    <p>loading details...</p>
  {/if}
</section>
