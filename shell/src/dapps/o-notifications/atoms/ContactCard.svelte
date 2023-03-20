<script lang="ts">
import { push } from "svelte-spa-router";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { CrcTrust, ProfileEvent } from "../../../shared/api/data/types";
import { onMount } from "svelte";

import { _ } from "src/i18n/i18n";
import { isMobile } from "../../../shared/functions/isMobile";
import relativeTimeString from "../../../shared/functions/relativeTimeString";
import Icons from "../../../shared/molecules/Icons.svelte";

export let event: ProfileEvent;

let safeAddress: string;
let timestamp: string;

let values: {
  title: string;
  titleClass: string;
  icon: string;
  textColor: string;
};

values = getValues();

onMount(async () => {
  timestamp = relativeTimeString(event.timestamp, 7);
  safeAddress = event.contact_address;
});

function getValues(): {
  title: string;
  titleClass: string;
  icon: string;
  textColor: string;
} {
  let icon = "trust";
  let title = "";
  let titleClass = "";
  let textColor = "";

  const crcTrust = <CrcTrust>event.payload;

  if (event.direction == "in" && crcTrust.limit == 0) {
    title = `${event.contact_address_profile.firstName} ${$_("dapps.o-contacts.atoms.chatListItems.crcTrust.getValues.untrustedYou")}`;
    titleClass = "text-alert";
    textColor = "text-negative";
  } else if (event.direction == "in" && crcTrust.limit > 0) {
    title = `${event.contact_address_profile.firstName} ${$_("dapps.o-contacts.atoms.chatListItems.crcTrust.getValues.trustedYou")}`;
    titleClass = "text-heading";
    textColor = "text-positive";
  } else if (event.direction == "out" && crcTrust.limit == 0) {
    title = `${$_("dapps.o-contacts.atoms.chatListItems.crcTrust.getValues.youUntrusted")} ${event.contact_address_profile.firstName}`;
    titleClass = "text-alert";
    textColor = "text-negative";
  } else if (event.direction == "out" && crcTrust.limit > 0) {
    title = `${$_("dapps.o-contacts.atoms.chatListItems.crcTrust.getValues.youTrusted")} ${event.contact_address_profile.firstName}`;
    titleClass = "text-heading";
    textColor = "text-positive";
  }

  return {
    title,
    titleClass,
    icon,
    textColor,
  };
}

function loadDetailPage(path: string) {
  push(`#/contacts/profile/${path}`);
}

let textCutoff = isMobile() ? 16 : 42;
</script>

<div role="presentation" on:click="{() => loadDetailPage(safeAddress)}" class="cursor-pointer">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: event.contact_address_profile,
      truncateMain: true,
    }}">
    <div slot="itemCardBody" class="w-full">
      <div class="flex-col flex-grow">
        <div class="flex flex-row items-center justify-between px-3 text-left">
          <div class="flex-grow min-w-0">
            <h2 class="overflow-hidden text-xl font-heading whitespace-nowrap overflow-ellipsis {values.titleClass}">
              <b>{values.title ? (values.title.length >= textCutoff ? values.title.slice(0, textCutoff) + "..." : values.title) : ""}</b>
            </h2>
          </div>
          <div class="self-end text-right pl-2 text-lg whitespace-nowrap {values.textColor}">
            <Icons icon="{values.icon}" size="{6}" customClass="inline inline-icon" />
          </div>
        </div>
        <div class="flex flex-row items-center justify-between px-3 -mt-1 text-left">
          <div class="flex-grow leading-none">
            <span class="inline-block text-xs">
              {timestamp}
            </span>
          </div>
        </div>
      </div>
    </div>
  </ItemCard>
</div>
