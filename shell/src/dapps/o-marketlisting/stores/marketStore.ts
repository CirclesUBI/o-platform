import {readable, Subscriber} from "svelte/store";
import {AllBusinessesDocument, Businesses, QueryAllBusinessesOrderOptions} from "../../../shared/api/data/types";
import {ApiClient} from "../../../shared/apiConnection";
import {myLocation} from "../../../shared/stores/myLocation";

export type MarketListingData = {
  businesses: Businesses[]
  orderBy: QueryAllBusinessesOrderOptions
  messages: string[]
}

export const marketStore = {
  subscribe: (subscriber: Subscriber<MarketListingData>) => _marketStore.subscribe(subscriber),
  reload: reload,
};

const initial = {
  businesses: [],
  orderBy: QueryAllBusinessesOrderOptions.MostPopular,
  messages: []
};

const _marketStore = readable<MarketListingData>(initial, function start(set) {
  _set = set;
  reload(QueryAllBusinessesOrderOptions.MostPopular);
  return function stop() {
  }
});

function reload(orderBy: QueryAllBusinessesOrderOptions) {
  let ownLocation: GeolocationPosition | undefined;

  if (orderBy == QueryAllBusinessesOrderOptions.Nearest) {
    myLocation.subscribe((o) => {
      if (!o || o instanceof GeolocationPositionError || o instanceof Error) {
        myLocation.reload();
      } else {
        ownLocation = o;
      }
    })();
  }

  const newOrder = orderBy != QueryAllBusinessesOrderOptions.Nearest
    ? orderBy
    : !ownLocation
      ? _marketListingData.orderBy
      : QueryAllBusinessesOrderOptions.Nearest;

  if (orderBy != newOrder) {
    _marketListingData.messages = ["The last action couldn't be completed without you current location. Please try it again once the location is available."];
  } else {
    _marketListingData.messages = [];
  }

  ApiClient.query<Businesses[], any>(AllBusinessesDocument, {
    queryParams: {
      order: {
        orderBy: newOrder
      },
      ... ownLocation ? {
        ownCoordinates: {
          lat: ownLocation.coords.latitude,
          lon: ownLocation.coords.longitude
        }
      } : {}
    }
  })
  .then(businesses => {
    _marketListingData.orderBy = orderBy;
    _marketListingData.businesses = businesses;
    _set(_marketListingData);
  });
}

let _set: (marketListingData: MarketListingData) => void;
let _marketListingData: MarketListingData = initial;