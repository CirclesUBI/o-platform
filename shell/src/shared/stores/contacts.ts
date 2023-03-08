import { readable } from "svelte/store";
import { AggregateType, Contact, Contacts, EventType, Profile } from "../api/data/types";
import { me } from "./me";
import { Subscription } from "rxjs";
import { ZERO_ADDRESS } from "@o-platform/o-circles/dist/consts";
import { ApiClient } from "../apiConnection";

let contactsBySafeAddress: { [address: string]: Contact } = {};

async function loadContacts(safeAddress: string) {
  const contacts = await ApiClient.queryAggregate<Contacts>(AggregateType.Contacts, safeAddress);
  const contactsList: Contact[] = contacts.contacts.filter((o: Contact) => {
    return o.contactAddress !== ZERO_ADDRESS && o.contactAddress != safeAddress;
  });

  return contactsList.sort((a, b) => {
    return a.lastContactAt > b.lastContactAt ? -1 : a.lastContactAt < b.lastContactAt ? 1 : 0;
  });
}

let _set: (val: any) => void;
export const { subscribe } = readable<Contact[]>([], function start(set) {
  _set = set;
  // Subscribe to $me and reload the store when the profile changes
  async function update(safeAddress: string) {
    const contacts = await loadContacts(safeAddress);
    contacts.forEach((c) => {
      contactsBySafeAddress[c.contactAddress] = c;
    });
    set(contacts);
  }

  let shellEventSubscription: Subscription;

  const profileSubscription = me.subscribe(async ($me) => {
    if (shellEventSubscription) {
      shellEventSubscription.unsubscribe();
      shellEventSubscription = null;
    }

    if (!$me?.circlesAddress) {
      console.log(`contacts: Not loaded. No safe address on profile.`);
      set([]);
      return;
    }
    console.log(`contacts: Updating for ${$me.circlesAddress} ..`);
    await update($me.circlesAddress);

    shellEventSubscription = window.o.events.subscribe(async (event) => {
      const isRelevantEvent =
        [
          <string>EventType.CrcHubTransfer,
          <string>EventType.CrcTrust,
          <string>EventType.CrcSignup,
          <string>EventType.CrcMinting,
        ].indexOf(event.type) > -1;

      if (isRelevantEvent) {
        await update($me.circlesAddress);
      }

      if ((<any>event).type == "new_message") {
        console.log(`contacts: Updating because of chat message ..`);
        await update($me.circlesAddress);
      }
    });
  });

  return function stop() {
    profileSubscription();

    if (shellEventSubscription) {
      shellEventSubscription.unsubscribe();
      shellEventSubscription = null;
    }
  };
});

export const contacts = {
  subscribe: subscribe,
  findBySafeAddress: async (safeAddress: string, reload: boolean = false) => {
    let _$me: Profile;
    me.subscribe(($me) => (_$me = $me))();
    if (_$me.circlesAddress == safeAddress) {
      return <Contact>{
        contactAddress: safeAddress,
        contactAddress_Profile: _$me,
        lastContactAt: new Date().toJSON(),
        metadata: [],
      };
    }
    let contact = contactsBySafeAddress[safeAddress];
    if (!contact || reload) {
      const filteredContacts = await ApiClient.queryAggregate<Contacts>(AggregateType.Contacts, _$me.circlesAddress, {
        contacts: {
          addresses: [safeAddress],
        },
      });

      if (filteredContacts && filteredContacts.contacts?.length > 0) {
        contact = filteredContacts.contacts[0];
        contactsBySafeAddress[contact.contactAddress] = contact;
      }

      const newList = Object.values(contactsBySafeAddress).sort((a, b) => {
        return a.lastContactAt > b.lastContactAt ? -1 : a.lastContactAt < b.lastContactAt ? 1 : 0;
      });

      if (_set) {
        // If _set is not yet set, the store is not yet used, but we still wanted to load the contact
        _set(newList);
      }
    }

    return contact;
  },
};
