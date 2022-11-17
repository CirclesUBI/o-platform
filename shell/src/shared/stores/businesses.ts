import {readable} from "svelte/store";
import {Subscriber} from "svelte/types/runtime/store";
import {
  AllBusinessesDocument,
  AllBusinessesQueryVariables,
  Businesses,
  MutationSetIsFavoriteArgs,
  QueryAllBusinessesOrderOptions,
  SetIsFavoriteDocument
} from "../api/data/types";
import {ApiClient} from "../apiConnection";
import {me} from "./me";

export const businesses = {
  subscribe: (subscriber: Subscriber<(Businesses & { isFavorite: boolean })[]>) => _businessesStore.subscribe(subscriber),
  reload: async (order:QueryAllBusinessesOrderOptions, position?: GeolocationPosition) => {
    await reload(order, position)
    publish();
  },
  findByCirclesAddress: async (circlesAddress:string) => {
    if (!_data) {
      await reload(QueryAllBusinessesOrderOptions.Nearest);
      publish();
    }
    return _data
      .sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0)
      .find(o => o.circlesAddress == circlesAddress)
  },
  toggleFavorite: async (circlesAddress:string) => {
    const business = _data.find(o => o.circlesAddress == circlesAddress);
    _favorites[circlesAddress] = !_favorites[circlesAddress];
    business.isFavorite = _favorites[circlesAddress];
    publish();
    await ApiClient.mutate<boolean, MutationSetIsFavoriteArgs>(SetIsFavoriteDocument, {
      circlesAddress: circlesAddress,
      isFavorite: business.isFavorite
    });
    return business;
  }
};

let _set: (data:(Businesses & { isFavorite: boolean })[]) => void;
let _favorites: {[circlesAddress:string]: boolean}|null = {};
let _businesses: (Businesses & {index: number})[] = [];
let _data: (Businesses & { isFavorite: boolean })[];

async function reloadFavorites() {
  _favorites = (await me.reload()).favorites.reduce((p,c) => {
    p[c.favorite.circlesAddress] = true;
    return p;
  }, <{[circlesAddress:string]: boolean}>{});
}

async function reloadBusinesses(order?:QueryAllBusinessesOrderOptions, ownLocation?: GeolocationPosition) {
  if (order == QueryAllBusinessesOrderOptions.Nearest) {
    _businesses = (await ApiClient.query<Businesses[], AllBusinessesQueryVariables>(AllBusinessesDocument, {
        queryParams: {
          order: {
            orderBy: QueryAllBusinessesOrderOptions.Nearest
          },
          ... ownLocation ? {
            ownCoordinates: {
              lat: ownLocation.coords.latitude,
              lon: ownLocation.coords.longitude
            }
          } : {}
        }
      }))
      .map((o, i) => {
        return {
          ...o,
          index: i
        };
      });
  } else {
    var business = (await ApiClient.query<Businesses[], AllBusinessesQueryVariables>(AllBusinessesDocument, {
     ...order ? {
       queryParams: {
         order: {
           orderBy: order
         }
       }
     } : {}
    }))
    console.log("businesses ordered by something", business);
    _businesses = business.map((o, i) => {
        return {
          ...o,
          index: i
        };
      });
  }
}

async function reload(order?:QueryAllBusinessesOrderOptions, position?: GeolocationPosition) {
  await Promise.all([reloadFavorites(), reloadBusinesses(order, position)]);
}

function publish() {
  _data = _businesses.map(o => {
    return  {
      ...o,
      isFavorite: _favorites[o.circlesAddress]
    }
  });

  if (_set) {
    _set(_data);
  }
}

const _businessesStore = readable<(Businesses & { isFavorite: boolean })[]>([], function start(set) {
  _set = set;

  reload(QueryAllBusinessesOrderOptions.MostPopular).then(o => {
    publish();
  });

  return function stop() {
  }
});