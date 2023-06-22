import {
  EventPayload,
  EventType,
  PaginationArgs,
  Profile,
  ProfileEvent, ProfileEventFilter, QueryEventsArgs,
  SortOrder,
  StreamDocument
} from "../api/data/types";
import {writable} from "svelte/store";
import {me} from "./me";
import {Environment} from "../environment";

export type PagedEventQueryIndexEntry = {
  indexName: string,
  indexKey: string
}

export interface ObjectCache<T> {
  findByPrimaryKey(type:string, primaryKey:string) : Promise<T|undefined>;
  findByIndexKey(type:string, indexName:string, indexKey:string) : T[];
}

export abstract class PagedEventQuery implements ObjectCache<ProfileEvent>{
  readonly eventTypes:EventType[];
  readonly sortOrder: SortOrder;
  readonly pageSize: number;
  readonly query = StreamDocument;
  readonly filter?:ProfileEventFilter;

  private readonly _subscribe:any;
  private readonly _set:any;

  private _pagination?: PaginationArgs;
  private _primaryCache: {[primaryKey:string]:ProfileEvent} = {};
  private _indexCache: {[indexKey:string]: string[]} = {};

  private _profileChangedSubscription:any;
  public get isInitialized() : boolean {
    return this._isInitialized;
  }
  private _isInitialized = false;
  private _onDestroy?: () => void;

  abstract getPrimaryKey(eventPayload:EventPayload) : string;
  protected abstract getIndexedValues(event:ProfileEvent) : PagedEventQueryIndexEntry[];
  protected abstract maintainExternalCaches(event:ProfileEvent) : void;

  abstract findSingleItemFallback(types:string[], primaryKey:string) : Promise<ProfileEvent|undefined>;

  get scrollPosition() : number {
    return this._scrollPosition;
  }
  set scrollPosition(val:number) {
    this._scrollPosition = val;
  }
  private _scrollPosition:number;

  constructor(eventTypes: EventType[], order: SortOrder, pageSize: number, filter?: ProfileEventFilter, onDestroy?: () => void) {
    this.eventTypes = eventTypes;
    this.sortOrder = order;
    this.pageSize = pageSize;
    this.filter = filter;
    this._onDestroy = onDestroy;

    const { subscribe, set, update } = writable<ProfileEvent[]>(
      [], (set) => {
        if (!this._isInitialized) {
          this._profileChangedSubscription = me.subscribe(async $me => {
            if (this._isInitialized) {
              this.reset();
              await this.next();
            }
          });

          this.next().then(result => {
            if (result) {
              console.log(`Initial loading complete. More data available.`)
            } else {
              console.log(`Initial loading complete. All loaded.`)
            }
            this._isInitialized = true;
            this.refresh();
          });
        }

        return () => {
          this._profileChangedSubscription();
          this._onDestroy?.call(this);
        }
      }
    );
    this._subscribe = subscribe;
    this._set = set;

    this.reset();
  }

  protected getPageDelimiterValue(event:ProfileEvent) : string {
    return event.timestamp;
  }

  private reset() {
    this._primaryCache = {};
    this._indexCache = {};
    this._pagination = {
      order: this.sortOrder,
      limit: this.pageSize,
      continueAt: this.sortOrder == SortOrder.Desc
        ? Environment.endOfTime.toJSON()
        : Environment.beginningOfTime.toJSON()
    };
    this.refresh();
  }

  async next() : Promise<boolean> {
    let $me:Profile;
    me.subscribe(m => $me = m)();
    if (!$me) {
      return;
    }
    const args = <QueryEventsArgs>{
      safeAddress: $me.circlesAddress,
      types: this.eventTypes,
      pagination: this._pagination,
      filter: this.filter,
    };

    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const nextPageQueryResult: any = await apiClient.query({
      query: this.query,
      variables: args,
    });

    if (nextPageQueryResult.errors) {
      throw new Error(window.o.i18n("shared.stores.transactions.errors.couldNotLoadData", { values: { error: JSON.stringify(nextPageQueryResult.errors)}}));
    }

    let nextPage:ProfileEvent[] = nextPageQueryResult.data.events;
    if (nextPage.length > 0) {
      nextPage.forEach((e) => {
        this.addToCache(e);
        this.maintainExternalCaches(e);
      });

      const lastElementOfPage = nextPage[nextPage.length - 1];
      const continueAt = this.getPageDelimiterValue(lastElementOfPage);

      this._pagination = {
        continueAt: continueAt,
        order: this.sortOrder,
        limit: this.pageSize,
      };
    }

    this.refresh();
    const newEventCount = nextPage.length;
    return newEventCount >= this.pageSize;
  }

  refresh(newItem:boolean = false) {
    let eventList = Object.values(this._primaryCache).sort((a, b) => {
      const _a = new Date(a.timestamp).getTime();
      const _b = new Date(b.timestamp).getTime();
      return _a > _b
        ? -1
        : _a < _b
          ? 1
          : 0;
    });

    if (this.filter?.unreadOnly) {
        eventList = eventList.filter(e => e.unread);
    }

    this._set({
      events: eventList,
      metadata: {
        itemAdded: newItem
      }});

    return eventList.length;
  }

  addToCache(e: ProfileEvent) {
    const primaryKey = `${e.type}_${this.getPrimaryKey(e.payload)}`;
    this._primaryCache[primaryKey] = e;

    this.getIndexedValues(e).forEach(o => {
      const indexKey = `${e.type}_${o.indexName}_${o.indexKey}`;
      this._indexCache[indexKey] = this._indexCache[indexKey]
        ? this._indexCache[indexKey].concat([primaryKey])
        : [primaryKey];
    });
  }

  subscribe(run: (next:ProfileEvent[]) => void) {
    return this._subscribe(run);
  }

  async fetchMore() {
    return await this.next();
  }

  async findByPrimaryKey(type:EventType, primaryKey:string) : Promise<ProfileEvent|undefined> {
    const result = this._primaryCache[`${type}_${primaryKey}`];
    if (this.filter?.unreadOnly && !result?.unread) {
      return undefined;
    }
    return result;
  }

  findByIndexKey(type:EventType, indexName:string, indexKey:string) : ProfileEvent[] {
    const entries = this._indexCache[`${type}_${indexName}_${indexKey}`];
    if (!entries) {
      return [];
    }
    const result = entries.map(o => this._primaryCache[o]);
    if (this.filter?.unreadOnly) {
      return result.filter(o => o?.unread);
    }
    return result;
  }
}
