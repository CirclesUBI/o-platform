import { Subscriber, writable } from "svelte/store";
import {
  Businesses,
  AllBusinessesDocument,
  MutationToggleFavoriteArgs,
  ToggleFavoriteDocument,
  AllBusinessesQueryVariables,
  Profile,
} from "../api/data/types";
import { ApiClient } from "../apiConnection";
import { me } from "./me";

let businesses: Businesses[] = [];
let business: Businesses[] = [];
let favorites: { [circlesAddress: string]: boolean } = {};

export const favoriteBusinesses = {
  getBusinesses: async () => {
    async function getBusinesses() {
      businesses = await ApiClient.query<[Businesses], null>(AllBusinessesDocument, null);
    }

    await Promise.all([getBusinesses(), me.reload()]);

    return businesses;
  },

  toggleFavorite: async (circlesAddress: string) => {
    favorites[circlesAddress] = await ApiClient.mutate<boolean, MutationToggleFavoriteArgs>(ToggleFavoriteDocument, {
      circlesAddress: circlesAddress,
    });

    return favorites[circlesAddress];
  },

  getBusiness: async (circlesAddress: string) => {
    business = await ApiClient.query<Businesses[], AllBusinessesQueryVariables>(AllBusinessesDocument, {
      circlesAddress: circlesAddress,
    });

    return business;
  },
};
