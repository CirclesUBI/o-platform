<script lang="ts">
import { surveyConsents, surveyData, inviteUrl } from "../stores/surveyStore";
import { onMount, onDestroy } from "svelte";
import { Environment } from "../../../shared/environment";
import { SurveyDataDocument, BaliVillage } from "../../../shared/api/data/types";
import Label from "../../../shared/atoms/Label.svelte";
import { GenderOfUser } from "../../../shared/models/GenderOfUser.model";
import { TypeOfUser } from "../../../shared/models/TypeOfUser.model";
import { _ } from "svelte-i18n";
import { push } from "svelte-spa-router";
import DropDown from "../../../shared/molecules/DropDown.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import { DateInput } from "date-picker-svelte";
import { form, field } from "svelte-forms";
import { required } from "svelte-forms/validators";
import { generateLongId } from "../../../shared/functions/generateRandomUid";
import { error } from "../../../shared/stores/error";
import getCookies from "../../../shared/functions/getCookies";

const typeOfUserData = TypeOfUser;
const genderOfUserData = GenderOfUser;

const surveySessionId = generateLongId();
sessionStorage.removeItem("SurveyComplete");
sessionStorage.removeItem("SurveySessionId");

const villageId = field("villageId", "", [required()]);
const gender = field("gender", "", [required()]);
const dateOfBirth = field("dateOfBirth", <Date>null, [required()]);
const invite = field("invite", "", [required()]);
const myForm = form(villageId, gender, dateOfBirth, invite);

let hasInvite = false;
let allBaliVillages: BaliVillage[];
let allBaliVillagesLookup;
let _finally: boolean = false;

onDestroy(() => {});

myForm.validate();

$: {
  if ($inviteUrl) {
    $invite = "true";
  }
}

onMount(async () => {
  let cookies = getCookies();
  if (cookies && cookies.invitationCode) {
    $inviteUrl = "/";
    sessionStorage.setItem("inviteUrl", "/");
  }

  allBaliVillages = (await Environment.api.allBaliVillages()).allBaliVillages;
  allBaliVillagesLookup = allBaliVillages.toLookup(
    (o) => o.id,
    (o) => o
  );
});

const getNetworkErrors = (error) => error.networkError.response.json().then((e) => e.errors.map((e) => e.message).join(","));

async function handleClick(button) {
  if (button === "back") {
    push("#/survey/page/2");
  } else if (button === "openQRCode") {
    push("#/survey/scanInvite");
  } else if (button === "next") {
    if ($myForm.valid) {
      $surveyData = $myForm.summary;

      const apiClient = await window.o.apiClient.client.subscribeToResult();
      const result = await apiClient
        .mutate({
          mutation: SurveyDataDocument,
          variables: {
            surveyData: {
              sessionId: surveySessionId,
              allConsentsGiven: $surveyConsents.allConsentsGiven,
              villageId: parseInt($villageId.value),
              gender: $gender.value,
              dateOfBirth: $dateOfBirth.value,
            },
          },
        })
        .then(() => {
          sessionStorage.setItem("SurveySessionId", surveySessionId);
          sessionStorage.setItem("SurveyComplete", "true");
          sessionStorage.removeItem("surveyConsentPage1");
          sessionStorage.removeItem("surveyConsentPage2");
          push("#/survey/page/4");
        })
        .catch((error) => {
          if (error.networkError) {
            getNetworkErrors(error).then(console.log);
          } else {
            console.log("Error", error.message);
          }
        });
    }
  }
}

function handleOnChange(event) {
  if (event.detail.target === "village") {
    villageId.set(event.detail.value);
  }
  if (event.detail.target === "gender") {
    gender.set(event.detail.value);
  }
}
</script>

<div class="mx-auto mb-20 md:w-2/3 xl:w-1/2">
  <div class="flex flex-col items-center justify-center px-4 overflow-hidden text-white whitespace-pre-line">
    <div class="flex flex-col items-center justify-center">
      <div class="text-2xl text-white uppercase xs:text-4xl font-heading">
        <Label key="dapps.o-homepage.components.survey.userDataCollection.title.top" />
      </div>
      <div class="text-2xl text-center text-white uppercase xs:text-4xl font-heading">
        <Label key="dapps.o-homepage.components.survey.userDataCollection.title.bottom" />
      </div>
    </div>
    <div class="mt-5 mb-10 text-center">
      <Label key="dapps.o-homepage.components.survey.userDataCollection.subtitle" />
    </div>
    <div>
      <div class="flex flex-col mb-5 text-sm">
        <Label key="dapps.o-homepage.components.survey.userDataCollection.bornOn" />
        <div class="flex items-center h-12 mb-2 date-picker">
          <DateInput bind:value="{$dateOfBirth.value}" min="{new Date('1920-01-01')}" format="MM-dd-yyyy" placeholder="Choose a date" closeOnSelection="{true}" />

          {#if $dateOfBirth.value}
            <span class="text-6xl font-enso"><Icons icon="check-circle" size="{6}" customClass="inline ml-2 text-success" /></span>
          {:else}
            <span class="text-6xl font-enso"><Icons icon="information-circle" size="{6}" customClass="inline ml-2 text-alert" /></span>
          {/if}
        </div>
      </div>
      <div class="flex flex-col mb-5 text-sm">
        <Label key="dapps.o-homepage.components.survey.userDataCollection.useCircleAs" />
        <div class="flex">
          {#if allBaliVillages}
            <DropDown selected="Select your Village" items="{allBaliVillages}" id="village" key="id" value="desa" dropDownClass="max-w-xs text-base" on:dropDownChange="{handleOnChange}" />
          {/if}

          {#if $villageId.value && $villageId.value !== "undefined"}
            <span class="text-6xl font-enso"><Icons icon="check-circle" size="{6}" customClass="inline ml-2 text-success" /></span>
          {:else}
            <span class="text-6xl font-enso"><Icons icon="information-circle" size="{6}" customClass="inline ml-2 text-alert" /></span>
          {/if}
        </div>
      </div>
      <div class="flex flex-col mb-5 text-sm">
        <Label key="dapps.o-homepage.components.survey.userDataCollection.gender" />
        <div class="flex">
          <DropDown selected="Select gender" items="{genderOfUserData}" id="gender" key="id" value="name" dropDownClass="max-w-xs text-base" on:dropDownChange="{handleOnChange}" />
          {#if $gender.value && $gender.value !== "undefined"}
            <span class="text-6xl font-enso"><Icons icon="check-circle" size="{6}" customClass="inline ml-2 text-success" /></span>
          {:else}
            <span class="text-6xl font-enso"><Icons icon="information-circle" size="{6}" customClass="inline ml-2 text-alert" /></span>
          {/if}
        </div>
      </div>

      {#if !$inviteUrl}
        <div class="flex flex-col items-start w-full mb-2 text-sm">
          <Label key="dapps.o-homepage.components.survey.userDataCollection.scanInvite" />

          <div class="flex items-center w-full h-12 pr-8 mb-2">
            <button class="px-8 overflow-hidden transition-all transform btn btn-primary btn-block" on:click="{() => handleClick('openQRCode')}" disabled="{$inviteUrl}">
              <!-- {$_("dapps.o-homepage.components.survey.button.scanInviteNow")} -->
              Scan Invite Now
            </button>

            <input type="hidden" bind:value="{$invite.value}" />

            {#if $inviteUrl}
              <span class="text-6xl font-enso"><Icons icon="check-circle" size="{6}" customClass="inline ml-2 text-success" /></span>
            {:else}
              <span class="text-6xl font-enso"><Icons icon="information-circle" size="{6}" customClass="inline ml-2 text-alert" /></span>
            {/if}
          </div>
        </div>
      {/if}
    </div>
    {#if $error}
      <p class="mb-2 text-sm text-center text-alert ">{$error}</p>
    {/if}

    {#if !$myForm.valid}
      <div class="text-sm text-center text-info">
        <Label key="dapps.o-homepage.components.survey.userDataCollection.info" />
      </div>
    {/if}
    <div class="flex flex-row justify-around w-full mt-10 mb-5 text-center">
      <div>
        <button class="relative px-8 overflow-hidden transition-all transform btn bg-cpurple border-warning text-warning" on:click="{() => handleClick('back')}">
          {$_("dapps.o-homepage.components.survey.button.goBack")}</button>
      </div>
      <div>
        {#if $myForm.dirty}
          <button class="relative px-16 overflow-hidden transition-all transform btn btn-primary bg-primary text-cpurple" on:click="{() => handleClick('next')}" disabled="{!$myForm.valid}">
            {$_("dapps.o-homepage.components.survey.button.next")}</button>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
:global(.date-time-field input) {
  height: 45px !important;
  width: 320px !important;
  border-radius: var(--rounded-btn, 0.5rem) !important;
}
</style>
