import {
  Favorite, MutationSetIsFavoriteArgs,
  MyFavoritesDocument, Profile, SetIsFavoriteDocument
} from "../../../shared/api/data/types";
import {ApiClient} from "../../../shared/apiConnection";
import {readable} from "svelte/store";
import {me} from "../../../shared/stores/me";

export type FavoriteLookup = { [circlesAddress:string]: Favorite };

export const marketFavoritesStore = {
  subscribe: (subscriber: any) => _marketFavoritesStore.subscribe(subscriber),
  reload: reload,
  toggleFavorite: (circlesAddress:string) => {
    if (_favorites[circlesAddress]) {
      delete _favorites[circlesAddress];
      ApiClient.mutate<boolean, MutationSetIsFavoriteArgs>(SetIsFavoriteDocument, {
        circlesAddress: circlesAddress,
        isFavorite: false
      });
    } else {
      let _me:Profile|undefined;
      me.subscribe(o => _me = o)();
      _favorites[circlesAddress] = {
        createdAt: new Date().toJSON(),
        favoriteAddress: circlesAddress,
        createdByAddress: _me?.circlesAddress
      };
      ApiClient.mutate<boolean, MutationSetIsFavoriteArgs>(SetIsFavoriteDocument, {
        circlesAddress: circlesAddress,
        isFavorite: true
      });
    }
    _set(_favorites);
  }
};

const _marketFavoritesStore = readable<FavoriteLookup>({}, function start(set) {
  _set = set;
  reload();

  return function stop() {
  }
});

let _favorites: FavoriteLookup = {};
let _set: (favorites: FavoriteLookup) => void;

function reload() {
  ApiClient.query<Favorite[], any>(MyFavoritesDocument, {})
    .then(favorites => favorites
      .reduce((p, c) => {
        p[c.favoriteAddress] = c;
        return p;
      }, <FavoriteLookup>{}))
    .then(favoritesLookup => _favorites = favoritesLookup)
    .then(() => _set(_favorites));
}