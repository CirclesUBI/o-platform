import { writable } from "svelte/store";
import { SurveyDataInput } from "../../../shared/api/data/types";
export const surveyConsents = writable({
  researchConsent: false,
  participateConsent: false,
  endingConsent: false,
  exchangeConsent: false,
  dataCollectConsent: false,
  onlyFromFriends: false,
  allConsentsGiven: false,
});

export const surveyData = writable();
export const inviteUrl = writable();
