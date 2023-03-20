<script lang="ts">
import { surveyConsents, surveyData, inviteUrl } from "../stores/surveyStore";
import { onMount, onDestroy } from "svelte";
import { Environment } from "../../../shared/environment";
import { SurveyDataDocument, BaliVillage } from "../../../shared/api/data/types";
import Label from "../../../shared/atoms/Label.svelte";
import { GenderOfUser } from "../../../shared/models/GenderOfUser.model";
import { _ } from "svelte-i18n";
import { push } from "svelte-spa-router";
import DropDown from "../../../shared/molecules/DropDown.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import { form, field } from "svelte-forms";
import { required } from "svelte-forms/validators";
import { generateLongId } from "../../../shared/functions/generateRandomUid";
import { error } from "../../../shared/stores/error";
import Flatpickr from "svelte-flatpickr";
import "flatpickr/dist/flatpickr.css";
import "flatpickr/dist/themes/airbnb.css";

const genderOfUserData = GenderOfUser;

const surveySessionId = generateLongId();
sessionStorage.removeItem("SurveyComplete");
sessionStorage.removeItem("SurveySessionId");

const villageId = field("villageId", "", [required()]);
const gender = field("gender", "", [required()]);
const dateOfBirth = field("dateOfBirth", <Date>null, [required()]);
const invite = field("invite", "", [required()]);
const myForm = form(villageId, gender, dateOfBirth, invite);

let allBaliVillages: BaliVillage[];
let allBaliVillagesLookup;
let selectedDate: string = "";

onDestroy(() => {});

myForm.validate();

$: {
  if ($inviteUrl) {
    $invite = <any>"true";
  }
}

onMount(async () => {
  allBaliVillages = (await Environment.api.allBaliVillages()).allBaliVillages;
  let firstVillage = 0;
  allBaliVillagesLookup = allBaliVillages.toLookup(
    (o) => {
      if (firstVillage === undefined) {
        firstVillage = o.id;
      }
      return o.id;
    },
    (o) => o
  );

  fetch(Environment.apiEndpointUrl + "/validateinvite", {
    credentials: "include",
  })
    .then((data) => {
      if (data.status == 204) {
      }
      if (data.status == 200) {
        $inviteUrl = "/";
        sessionStorage.setItem("inviteUrl", "/");
      }
    })
    .catch((error) => {
      console.log("Error getting Invite Status:", error);
    });
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
              dateOfBirth: selectedDate,
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

const options = {
  element: "#datePicker",
  disableMobile: true,
  dateFormat: "Y-m-d", //change format also
  enableTime: false,
  weekNumbers: true,
  altInput: true,
  altFormat: "F j, Y",
  time_24hr: true,
  onChange(selectedDates, dateStr) {
    console.log("flatpickr hook", selectedDates, dateStr);
    selectedDate = dateStr;
  },
};
</script>

{#if allBaliVillages}
  <div class="mx-auto mb-20 md:w-2/3 xl:w-1/2">
    <div class="flex flex-col items-center justify-center pl-4 text-white">
      <div class="flex flex-col items-center justify-center">
        <div class="text-2xl text-white uppercase xs:text-4xl font-heading">
          <Label key="dapps.o-homepage.components.survey.userDataCollection.title.top" />
        </div>
        <div class="text-2xl text-center text-white uppercase xs:text-4xl font-heading">
          <Label key="dapps.o-homepage.components.survey.userDataCollection.title.bottom" />
        </div>
      </div>
      <div class="pr-4 mt-5 mb-10 text-center">
        <Label key="dapps.o-homepage.components.survey.userDataCollection.subtitle" />
      </div>
      <div class="w-full mb-5 text-sm">
        <Label key="dapps.o-homepage.components.survey.userDataCollection.bornOn" />
        <div class="w-full form-control">
          <div class="w-full input-group">
            <Flatpickr options="{options}" bind:value="{$dateOfBirth.value}" element="#my-picker">
              <div class="w-full flatpickr" id="my-picker">
                <input type="text" class="w-full text-base rounded-lg input" placeholder="Select Date.." data-input />

                <!-- svelte-ignore a11y-missing-attribute -->
                <a class="input-button" title="clear" data-clear>
                  <i class="icon-close"></i>
                </a>
              </div>
            </Flatpickr>

            <span>
              {#if $dateOfBirth.value}
                <span class="text-6xl font-enso"><Icons icon="check-circle" size="{6}" customClass="text-success" /></span>
              {:else}
                <span class="text-6xl font-enso"><Icons icon="information-circle" size="{6}" customClass="text-alert" /></span>
              {/if}
            </span>
          </div>
        </div>
      </div>
      <div class="w-full mb-5 text-sm">
        <Label key="dapps.o-homepage.components.survey.userDataCollection.useCircleAs" />
        <div class="w-full form-control">
          <div class="w-full input-group">
            <DropDown
              selected="Select your Village"
              items="{allBaliVillages}"
              id="village"
              key="id"
              value="desa"
              dropDownClass="grow text-base"
              on:dropDownChange="{handleOnChange}"
              notFull="{true}" />

            <span>
              {#if $villageId.value && $villageId.value !== "undefined"}
                <span class="text-6xl font-enso"><Icons icon="check-circle" size="{6}" customClass="text-success" /></span>
              {:else}
                <span class="text-6xl font-enso"><Icons icon="information-circle" size="{6}" customClass="text-alert" /></span>
              {/if}
            </span>
          </div>
        </div>
      </div>

      <div class="w-full mb-5 text-sm">
        <Label key="dapps.o-homepage.components.survey.userDataCollection.gender" />
        <div class="w-full form-control">
          <div class="w-full input-group">
            <DropDown
              selected="Select gender"
              items="{genderOfUserData}"
              id="gender"
              key="id"
              value="name"
              dropDownClass="grow text-base"
              on:dropDownChange="{handleOnChange}"
              notFull="{true}" />
            <span>
              {#if $gender.value && $gender.value !== "undefined"}
                <span class="text-6xl font-enso"><Icons icon="check-circle" size="{6}" customClass="text-success" /></span>
              {:else}
                <span class="text-6xl font-enso"><Icons icon="information-circle" size="{6}" customClass="text-alert" /></span>
              {/if}
            </span>
          </div>
        </div>
      </div>

      <div class="w-full mb-5 text-sm">
        <Label key="dapps.o-homepage.components.survey.userDataCollection.scanInvite" />
        <div class="w-full form-control">
          <div class="w-full input-group">
            {#if $inviteUrl}
              <span class="text-sm grow text-success">Invite Valid</span>
            {:else}
              <button class="px-8 overflow-hidden transition-all transform grow btn btn-primary " on:click="{() => handleClick('openQRCode')}" disabled="{$inviteUrl}">
                Scan Invite Now
              </button>
            {/if}
            <span>
              {#if $inviteUrl}
                <span class="text-6xl font-enso"><Icons icon="check-circle" size="{6}" customClass="text-success" /></span>
              {:else}
                <span class="text-6xl font-enso"><Icons icon="information-circle" size="{6}" customClass="text-alert" /></span>
              {/if}
            </span>
          </div>
        </div>
      </div>

      {#if $error}
        <p class="mb-2 text-sm text-center text-alert ">{$error}</p>
      {/if}

      {#if !$myForm.valid}
        <div class="pr-4 text-sm text-center text-info">
          <Label key="dapps.o-homepage.components.survey.userDataCollection.info" />
        </div>
      {/if}
      <div class="flex flex-row justify-between w-full pr-4 mt-10 mb-5 text-center">
        <div>
          <button class="relative px-8 overflow-hidden transition-all transform btn bg-cpurple border-warning text-warning" on:click="{() => handleClick('back')}">
            {$_("dapps.o-homepage.components.survey.button.goBack")}</button>
        </div>
        <div>
          {#if $myForm.dirty}
            <button
              class="relative px-16 overflow-hidden transition-all transform btn btn-primary bg-primary text-cpurple"
              on:click="{() => handleClick('next')}"
              disabled="{!$myForm.valid}">
              {$_("dapps.o-homepage.components.survey.button.next")}</button>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
:global(.date-time-field input) {
  border-radius: var(--rounded-btn, 0.5rem) !important;
  /* border-top-right-radius: 0 !important; */
  /* border-bottom-right-radius: 0 !important; */
  width: 100% !important;
  height: 3rem;
}
:global(.input-group > *, .input-group > .input) {
  border-radius: var(--rounded-btn, 0.5rem) !important;
}
:global(.date-time-field) {
  width: 100%;
}
:global(.input-group :where(span)) {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: transparent;
}
</style>
