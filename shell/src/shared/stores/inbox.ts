import {PagedEventQuery, PagedEventQueryIndexEntry} from "./pagedEventQuery";
import {
  AcknowledgeDocument,
  EventPayload,
  EventType, NotificationEvent,
  Profile,
  ProfileEvent,
  ProfileEventFilter,
  QueryEventsArgs,
  SortOrder
} from "../api/data/types";
import {me} from "./me";
import {ApiClient} from "../apiConnection";
import {Environment} from "../environment";

const inboxes:MyInbox[] = [];

export class MyInbox extends PagedEventQuery {
  constructor(sortOrder: SortOrder, pageSize = 20, eventTypes: EventType[], filter?: ProfileEventFilter) {
    super(eventTypes, sortOrder, pageSize, filter, () => {
      inboxes.splice(inboxes.indexOf(this), 1);
      console.log("Closed inbox", inboxes.length)
    });
    inboxes.push(this);
    console.log("Opened inbox", inboxes.length)
  }

  getPrimaryKey(eventPayload: EventPayload): string {
    if (eventPayload.__typename === EventType.InvitationRedeemed) {
      return eventPayload.redeemedBy;
    } else {
      return eventPayload.transaction_hash.toString();
    }
  }

  protected getIndexedValues(event: ProfileEvent): PagedEventQueryIndexEntry[] {
    return [{
      indexName: "transaction_hash",
      indexKey: event.transaction_hash
    }];
  }

  async findSingleItemFallback(types: string[], primaryKey: string): Promise<ProfileEvent | undefined> {
    let safeAddress: string;
    me.subscribe(($me) => (safeAddress = $me.circlesAddress))();

    console.log("Looking for event", primaryKey, types)

    const foundEvents = await ApiClient.query<
      ProfileEvent[],
      QueryEventsArgs
      >(this.query, {
      safeAddress: safeAddress,
      types: <EventType[]>types,
      pagination: {
        order: SortOrder.Desc,
        limit: 1,
        continueAt: Environment.endOfTime.toJSON(),
      },
      filter: <ProfileEventFilter>{
        transactionHash: primaryKey
      },
    });

    if (foundEvents && foundEvents.length > 0) {
      const event = foundEvents[0];
      this.addToCache(event);
      return event;
    }
  }

  protected maintainExternalCaches(event: ProfileEvent): void {
  }

  async acknowledge(event: ProfileEvent) {
    let $me:Profile;
    me.subscribe(me => $me = me)();
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    await apiClient.mutate({
      mutation: AcknowledgeDocument,
      variables: {
        safeAddress: $me.circlesAddress,
        until: new Date(event.timestamp).toJSON(),
      },
    });
    this.refresh();
  }

  static update(event: {type:string, transaction_hash: string}) {
    console.log("Updating inboxes")
    inboxes.forEach(inbox => {
      console.log("Updating inbox", inbox)
      inbox.findSingleItemFallback([event.type], event.transaction_hash).then(o => {
        console.log("Updated inbox event", o)
        inbox.refresh(!!o)
      });
    })
  }
}
