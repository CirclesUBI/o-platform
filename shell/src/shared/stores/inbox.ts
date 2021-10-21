import { writable } from "svelte/store";
import {
  AcknowledgeDocument,
  InboxDocument,
  Profile,
  ProfileEvent,
} from "../api/data/types";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";

let events: ProfileEvent[] = [];
async function queryEvents() {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const result = await apiClient.query({
    query: InboxDocument,
  });
  if (result.errors) {
    console.error(result.errors);
    return [];
  }

  return result.data.inbox;
}

const { subscribe, set, update } = writable<ProfileEvent[] | null>(
  null,
  function start(set) {
    set([]);

    const subscription = window.o.events.subscribe(
      async (
        event: PlatformEvent & {
          profile: Profile;
        }
      ) => {
        if (event.type == "shell.loggedOut") {
          set([]);
          return;
        }

        if (
          (<any>event).type == "blockchain_event" ||
          (<any>event).type == "new_message"
        ) {
          queryEvents().then((e) => {
            events = e;
            events = events.filter((o) => o.type != "eth_transfer");
            set(events);
          });
          return;
        }
        if (event.type == "shell.authenticated") {
          queryEvents().then((e) => {
            events = e;
            events = events.filter((o) => o.type != "eth_transfer");
            set(events);
          });
          return;
        }
      }
    );

    return function stop() {
      subscription.unsubscribe();
    };
  }
);

export const inbox = {
  subscribe,
  reload: () => {
    queryEvents().then((e) => {
      events = e;
      events = events.filter((o) => o.type != "eth_transfer");
      update(() => events);
    });
  },
  acknowledge: async (event: ProfileEvent) => {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    await apiClient.mutate({
      mutation: AcknowledgeDocument,
      variables: {
        until: new Date(event.timestamp).toJSON(),
      },
    });
    const e = events.find((o) => o.timestamp == event.timestamp);
    events.splice(events.indexOf(e), 1);
    update(() => events);
  },
};
