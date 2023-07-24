<script lang="ts">
import { push } from "svelte-spa-router";
import { Profile, Organisation } from "../api/data/types";
import Icons from "../molecules/Icons.svelte";
import jazzicon from "@metamask/jazzicon";
import { outerHTML } from "../functions/outerHtml";
import Web3 from "web3";

export let profile: Profile;
export let size: number = 10;
export let transparent: boolean = false;
export let tooltip: boolean = false;
export let profileLink: boolean = true;
export let editable: boolean = false;
export let image: string = "";
let displayName: string = "";
let isOrganisation: boolean = false;
let sizeInPixels = 0;
let noAvatar;

if (!image) {
  const seed = Web3.utils.hexToNumber(profile.circlesAddress?.slice(0, 15));
  noAvatar = jazzicon(size === 15 ? 54 : size * 4, seed);
}

function linkToProfile(event) {
  if (profileLink) {
    push(`#/contacts/profile/${profile.circlesAddress}`);
    event.stopPropagation();
  }
}
$: {
  if (profile) {
    if ((profile.type && profile.type == "PERSON") || (profile.__typename && profile.__typename == "Profile")) {
      displayName = profile.displayName;
    } else {
      displayName = profile.firstName ? profile.firstName : "";
      isOrganisation = true;
    }
    displayName = displayName.length >= 22 ? displayName.slice(0, 22) + "..." : displayName;
  }
  if (profile.type && profile.type == "ORGANISATION") {
    isOrganisation = true;
  } else if (profile.__typename && profile.__typename == "ORGANISATION") {
    isOrganisation = true;
  }
}
</script>

{#if profile}
  <div class="has-tooltip" class:cursor-pointer="{profileLink}" role="presentation" on:click="{(event) => linkToProfile(event)}">
    {#if tooltip}
      <span class="px-2 mt-12 text-sm bg-white rounded shadow-sm tooltip">
        {displayName}
      </span>
    {/if}
    {#if editable}
      <div class="relative z-50 -mt-10 text-center cursor-pointer top-10 -right-10">
        <div class="relative inline-flex">
          <span>
            <span class="table-cell w-10 h-10 align-middle bg-black rounded-full text-primary bg-opacity-60">
              <Icons icon="camera" customClass="inline w-6 h-6 heroicon smallicon" />
            </span>
          </span>
        </div>
      </div>
    {/if}

    <div class="self-center text-center rounded-full justify-self-center w-{size} " style="padding: {size >= 20 ? `4px` : `1px`}">
      <div class="relative w-{size} h-{size} m-auto" class:bg-white="{!transparent}" class:rounded-full="{!isOrganisation}" class:rounded-md="{isOrganisation}">
        {#if profile.provenUniqueness}
          <img
            src="/icons/verified.svg"
            alt="verified user"
            class="absolute"
            class:right-0="{size >= 15}"
            class:top-0="{size >= 15}"
            class:w-8="{size >= 20}"
            class:h-8="{size >= 20}"
            class:-right-1="{size < 15}"
            class:-top-1="{size < 15}"
            class:w-4="{size < 20}"
            class:h-4="{size < 20}" />
        {/if}
        {#if profile.avatarUrl || image}
          <img
            class=" w-{size} h-{size} rounded-corners-purple-borders"
            class:rounded-full="{!isOrganisation}"
            class:rounded-md="{isOrganisation}"
            src="{profile.avatarUrl || image}"
            alt="{displayName}" />
        {:else}
          <div class=" w-{size} h-{size} no-avatar-container" class:rounded-full="{!isOrganisation}" class:rounded-md="{isOrganisation}" class:dashboard-avatar="{size === 15}">
            {@html outerHTML(noAvatar)}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
:global(.no-avatar-container div) {
  padding: 1px;
  border: 2px solid #5b1e63 !important;
  border-radius: 9999px !important;
  background-color: #5b1e63 !important;
}

:global(.dashboard-avatar) {
  width: 54px !important;
  height: 54px !important;
}
</style>
