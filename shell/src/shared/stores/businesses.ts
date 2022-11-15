import {readable} from "svelte/store";
import {Subscriber} from "svelte/types/runtime/store";
import {
  AllBusinessesDocument,
  Businesses, MutationSetIsFavoriteArgs,
  SetIsFavoriteDocument
} from "../api/data/types";
import {ApiClient} from "../apiConnection";
import {me} from "./me";

export const businesses = {
  subscribe: (subscriber: Subscriber<(Businesses & { isFavorite: boolean })[]>) => _businessesStore.subscribe(subscriber),
  reload: () => {},//_reloadBusinesses(),
  findByCirclesAddress: async (circlesAddress:string) => {
    if (!_data) {
      await reload();
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

    const wasFavoriteBefore = await ApiClient.mutate<boolean, MutationSetIsFavoriteArgs>(SetIsFavoriteDocument, {
      circlesAddress: circlesAddress,
      isFavorite: business.isFavorite
    });

    return business;
  }
};

let _set: (data:(Businesses & { isFavorite: boolean })[]) => void;

let _favorites: {[circlesAddress:string]: boolean}|null = {};
let _businesses: Businesses[] = [];
let _data: (Businesses & { isFavorite: boolean })[];


async function reloadFavorites() {
  _favorites = (await me.reload()).favorites.reduce((p,c) => {
    p[c.favorite.circlesAddress] = true;
    return p;
  }, <{[circlesAddress:string]: boolean}>{});
}

async function reloadBusinesses() {
  _businesses = await ApiClient.query<Businesses[], null>(AllBusinessesDocument, null);
}

async function reload() {
  await Promise.all([reloadFavorites(), reloadBusinesses()]);
}

function publish() {
  _data = _businesses.map(o => {
    return JSON.parse(JSON.stringify( {
      ...o,
      isFavorite: _favorites[o.circlesAddress]
    }))
  }).sort((a,b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0);
  console.log("_data:", _data)
  if (_set) {
    _set(_data);
  }
}

const _businessesStore = readable<(Businesses & { isFavorite: boolean })[]>([], function start(set) {
  _set = set;

  reload().then(o => {
    console.log("_businesses", _businesses);
    console.log("_favorites", _favorites);
    publish();
  });

  return function stop() {
  }
});