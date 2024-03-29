import { get, readable, Subscriber } from "svelte/store";
import {
  AllBusinessesDocument,
  Businesses,
  QueryAllBusinessesConditions, QueryAllBusinessesOrder,
  QueryAllBusinessesOrderOptions
} from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";

export type MarketListingData = {
  businesses: Businesses[];
  orderBy: QueryAllBusinessesOrderOptions;
  filter?: number[];
  messages: string[];
  cursor: number;
  searchString?: string;
};

let ownLocation: GeolocationPosition;

function marketStore() {
  return {
    subscribe: (subscriber: Subscriber<MarketListingData>) => _marketStore.subscribe(subscriber),
    reload: reload,
    fetchNext: fetchNext,
    search: search,
    loadSingleItem: loadSingleItem,
    resetSearch() {
      _marketListingData.searchString = null;
    },
    init(location: GeolocationPosition) {
      ownLocation = location;
    },
  };
}

const initial = {
  businesses: [],
  orderBy: QueryAllBusinessesOrderOptions.Nearest,
  messages: [],
  cursor: 0,
};

const _marketStore = readable<MarketListingData>(initial, function start(set) {
  _set = set;

  reload(_marketListingData.orderBy, _marketListingData.filter);
  return function stop() { };
});

function search(searchString: string) {
  if (!searchString) {
    _marketListingData.searchString = null;
    return;
  }
  _marketListingData.searchString = searchString;
  reload(_marketListingData.orderBy, _marketListingData.filter, null, false);
}

function fetchNext() {
  const value = get(_marketStore);
  const cursor: number = value.businesses.at(-1)?.cursor || 0;

  if (_marketListingData.businesses.length > 0 && _marketListingData.cursor == cursor) {
    return false;
  }

  reload(_marketListingData.orderBy, _marketListingData.filter, cursor, true);
  return true;
}

async function loadSingleItem(circlesAddress: string) {
  const businesses = await ApiClient.query<Businesses[], any>(AllBusinessesDocument, {
    queryParams: {
      where: <QueryAllBusinessesConditions>{
        inCirclesAddress: [circlesAddress]
      },
      order: <QueryAllBusinessesOrder>{
        orderBy: QueryAllBusinessesOrderOptions.Newest
      },
      limit: 1
    }
  });

  _marketListingData.businesses.push(...businesses);
}

function reload(orderBy: QueryAllBusinessesOrderOptions, filter?: number[], cursor: number = 0, append: boolean = false) {
  const newOrder = orderBy != QueryAllBusinessesOrderOptions.Nearest ? orderBy : !ownLocation ? QueryAllBusinessesOrderOptions.Newest : QueryAllBusinessesOrderOptions.Nearest;
  console.log("ORDER: ", newOrder);

  if (filter?.length === 0) {
    filter = undefined;
  }

  if (orderBy != newOrder) {
    _marketListingData.messages = ["<span class='text-info'>" + window.o.i18n('dapps.o-marketlisting.stores.marketStore.couldntGetLocation') + "<br/>" + window.o.i18n('dapps.o-marketlisting.stores.marketStore.couldntGetLocationDetails') + "</span>"];
  } else {
    _marketListingData.messages = [];
  }

  ApiClient.query<Businesses[], any>(AllBusinessesDocument, {
    queryParams: {
      order: {
        orderBy: newOrder,
      },
      cursor: cursor,
      limit: 8,
      ...(ownLocation
        ? {
          ownCoordinates: {
            lat: ownLocation.coords.latitude,
            lon: ownLocation.coords.longitude,
          },
        }
        : {}),
      ...(filter
        ? {
          where: {
            inCategories: filter,
          },
        }
        : {}),
      ...(_marketListingData.searchString
        ? {
          where: {
            searchString: _marketListingData.searchString,
          },
        }
        : {}),
    },
  }).then((businesses) => {
    _marketListingData.cursor = cursor;
    _marketListingData.orderBy = orderBy;
    _marketListingData.filter = filter;
    if (append) {
      _marketListingData.businesses = [..._marketListingData.businesses, ...businesses];
    } else {
      _marketListingData.businesses = businesses;
    }
    _set(_marketListingData);
  });
  console.log("Store Data Loaded");
}

let _set: (marketListingData: MarketListingData) => void;
let _marketListingData: MarketListingData = initial;

export default marketStore();
