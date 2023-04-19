<script lang="ts">
import { push } from "svelte-spa-router";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { Contact } from "../../../shared/api/data/types";
import { onMount } from "svelte";

import { _ } from "svelte-i18n";
import { trustFromContactMetadata } from "../../../shared/functions/trustFromContactMetadata";

export let contact: Contact;

let displayName: string;
let safeAddress: string;
let message: string;
let className: string;

onMount(() => {
  displayName = contact.contactAddress_Profile.displayName;
  safeAddress = contact.contactAddress;
  message = "";

  const { trustIn, trustOut } = trustFromContactMetadata(contact);
  console.log("trustIn", trustIn);
  console.log("trustOut", trustOut);

  if (trustIn > 0 && trustOut > 0) {
    message += `${$_("dapps.o-contacts.atoms.contactCard.mutualTrust")}`;
    className = "text-wallet";
  } else if (!trustIn && trustOut > 0) {
    message += `${$_("dapps.o-contacts.atoms.contactCard.trustedByYou")}`;
    className = "text-contacts";
  } else if (trustIn > 0 && !trustOut) {
    message += `${$_("dapps.o-contacts.atoms.contactCard.isTrustingYou")}`;
    className = "text-passport";
  } else {
    message += `${$_("dapps.o-contacts.atoms.contactCard.notTrusted")}`;
  }
});

function loadDetailPage(path) {
  push(`#/contacts/profile/${path}`);
}
</script>

<div role="presentation" on:click="{() => loadDetailPage(safeAddress)}" class="cursor-pointer">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: contact.contactAddress_Profile,
      title: displayName,
      subTitle: message,
      truncateMain: true,
      mobileTextCutoff: 24,
      class: className,
    }}">
    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl"></div>
    </div>
  </ItemCard>
</div>
