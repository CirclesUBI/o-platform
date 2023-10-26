import { writable } from "svelte/store";
import { SurveyDataInput } from "../../../shared/api/data/types";
export const surveyConsents = writable({
  researchConsent: false,
  dataCollectConsent: false,
  endingConsent: false,
  exchangeConsent: false,
  onlyFromFriendsConsent: false,
  noExchangesConsent: false,
  unethicalItemsConsent: false,
  inactiveAccountConsent: false,
  allConsentsGiven: false,
});

export const surveyData = writable();
export const inviteUrl = writable();
