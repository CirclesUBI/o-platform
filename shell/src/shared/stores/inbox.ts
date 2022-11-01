import {PagedEventQuery, PagedEventQueryIndexEntry} from "./pagedEventQuery";
import {
  AcknowledgeDocument,
  EventPayload,
  EventType,
  Profile,
  ProfileEvent,
  ProfileEventFilter,
  QueryEventsArgs,
  SortOrder
} from "../api/data/types";
import {me} from "./me";
import {ApiClient} from "../apiConnection";

export class MyInbox extends PagedEventQuery {
  constructor(sortOrder: SortOrder, pageSize = 20, eventTypes: EventType[]) {
    super(eventTypes, sortOrder, pageSize);
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

    const foundEvents = await ApiClient.query<
      ProfileEvent[],
      QueryEventsArgs
      >(this.query, {
      safeAddress: safeAddress,
      types: <EventType[]>types,
      pagination: {
        order: SortOrder.Desc,
        limit: 1,
        continueAt: new Date().toJSON(),
      },
      filter: <ProfileEventFilter>{
        transactionHash: primaryKey,
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
}