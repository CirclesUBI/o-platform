<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import ContactCard from "../atoms/ContactCard.svelte";
import { contacts } from "../../../shared/stores/contacts";

import { onMount } from "svelte";
import { Contact } from "../../../shared/api/data/types";
import { trustFromContactMetadata } from "../../../shared/functions/trustFromContactMetadata";
import { _ } from "svelte-i18n";
import Label from "../../../shared/atoms/Label.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

type DisplayContact = Contact & { trustIn: number; trustOut: number };

let displayContacts: Contact[];

onMount(() => {
  return contacts.subscribe((c: Contact[]) => {
    console.log("Contacts changed.");
    displayContacts = (c ?? [])
      .map((o) => {
        return <DisplayContact>{ ...o };
      })
      .sort(sortAlphabetically)
      .filter((o) => {
        const { trustIn, trustOut } = trustFromContactMetadata(o);
        o.trustIn = trustIn;
        o.trustOut = trustOut;
        return trustIn > 0 || (trustOut > 0 && !o.metadata?.find((o) => o.name == "Search"));
      });
  });
});

function sortAlphabetically(a, b) {
  if (a.contactAddress_Profile.firstName.startsWith("0x")) {
    return 1;
  }
  if (b.contactAddress_Profile.firstName.startsWith("0x")) {
    return -1;
  }
  return a.contactAddress_Profile.firstName.localeCompare(b.contactAddress_Profile.firstName);
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mt-8 mb-20 md:w-2/3 xl:w-1/2">
  {#if !displayContacts}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div><Label key="dapps.o-contacts.pages.contacts.loadingContacts" /></div>
        </div>
      </div>
    </section>
  {:else}
    <!-- TODO: Possible actions: trust, transfer money -->
    {#each displayContacts as contact (contact.contactAddress + contact.trustIn + contact.trustOut)}
      <ContactCard contact="{contact}" />
    {/each}
    {#if displayContacts.length === 0}
      <section class="flex items-center justify-center mb-2 ">
        <div class="flex items-center w-full p-4 space-x-2 bg-white rounded-lg shadow">
          <div class="flex flex-col items-start text-center">
            <div><Label key="dapps.o-contacts.pages.contacts.noEntries" /></div>
          </div>
        </div>
      </section>
    {/if}
  {/if}
</div>
