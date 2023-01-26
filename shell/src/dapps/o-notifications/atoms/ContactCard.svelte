<script lang="ts">
import { push } from "svelte-spa-router";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import {Contact, ProfileEvent} from "../../../shared/api/data/types";
import { onMount } from "svelte";

import { _ } from "svelte-i18n";
import {trustFromContactMetadata} from "../../../shared/functions/trustFromContactMetadata";
import { contacts as contactStore } from "../../../shared/stores/contacts"
import Profile from "../../o-contacts/pages/Profile.svelte";

export let event: ProfileEvent;

let displayName: string;
let safeAddress: string;
let message: string;
let contact: Contact;
let profileImage: Profile;

onMount(async () => {
  displayName = event.contact_address_profile.displayName;
  safeAddress = event.contact_address;
  profileImage = event.contact_address_profile;
  message = "";

  contact = await contactStore.findBySafeAddress(event.contact_address);

  const {trustIn, trustOut} = trustFromContactMetadata(contact);

  if (trustIn > 0 && trustOut > 0) {
    message += `${$_("dapps.o-contacts.atoms.contactCard.mutualTrust")}`;
  } else if (!trustIn && trustOut > 0) {
    message += `${$_("dapps.o-contacts.atoms.contactCard.trustedByYou")}`;
  } else if (trustIn > 0 && !trustOut) {
    message += `${$_("dapps.o-contacts.atoms.contactCard.isTrustingYou")}`;
  } else {
    message += `${$_("dapps.o-contacts.atoms.contactCard.notTrusted")}`;
  }
});

function loadDetailPage(path) {
  push(`#/contacts/profile/${path}`);
}
</script>

<div on:click="{() => loadDetailPage(safeAddress)}" class="cursor-pointer">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: profileImage,
      title: displayName,
      subTitle: message,
      truncateMain: true,
      mobileTextCutoff: 24,
    }}">
    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl"></div>
    </div>
  </ItemCard>
</div>
