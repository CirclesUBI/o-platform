<script lang="ts">
import { surveyConsents, surveyData, inviteUrl } from "../stores/surveyStore";
import { onMount } from "svelte";
import { SurveyDataDocument, SurveyData, SurveyDataInput } from "../../../shared/api/data/types";
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
import { faYenSign } from "@fortawesome/free-solid-svg-icons";
import { noop } from "svelte/internal";

const typeOfUserData = TypeOfUser;
const genderOfUserData = GenderOfUser;

const surveySessionId = generateLongId();

sessionStorage.setItem("SurveySessionId", surveySessionId);
sessionStorage.removeItem("SurveyComplete");

const userType = field("userType", "", [required()]);
const gender = field("gender", "", [required()]);
const dateOfBirth = field("dateOfBirth", <Date>null, [required()]);
const invite = field("invite", "", [required()]);
const myForm = form(userType, gender, dateOfBirth, invite);

let hasInvite = false;
myForm.validate();

onMount(async () => {
  // if ($surveyConsents.allConsentsGiven !== true) {
  //   push("#/homepage/survey/2");
  // }
});

$: {
  if ($inviteUrl) {
    $invite = "true";
  }
}

async function handleClick(button) {
  if (button === "back") {
    push("#/homepage/survey/3");
  } else if (button === "openQRCode") {
    push("#/homepage/scanInvite/");
  } else {
    $surveyData = $myForm.summary;

    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.mutate({
      mutation: SurveyDataDocument,
      variables: {
        surveyData: {
          sessionId: surveySessionId,
          allConsentsGiven: $surveyConsents.allConsentsGiven,
          userType: $userType.value,
          gender: $gender.value,
          dateOfBirth: $dateOfBirth.value,
        },
      },
    });

    if (result.errors) {
      throw new Error(`Couldn't store Survey data properly: ${JSON.stringify(result.errors)}`);
    }
    sessionStorage.setItem("SurveyComplete", "true");
    sessionStorage.removeItem("surveyConsentPage1");
    sessionStorage.removeItem("surveyConsentPage2");
    push("#/homepage/survey/5");
  }
}

function handleOnChange(event) {
  if (event.detail.target === "userType") {
    userType.set(event.detail.value);
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
        <Label key="dapps.o-homepage.components.survey.userDataCollection.useCircleAs" />
        <div class="flex">
          <DropDown
            selected="Select your type of user"
            items="{typeOfUserData}"
            id="userType"
            key="id"
            value="name"
            on:dropDownChange="{handleOnChange}" />

          {#if $userType.value && $userType.value !== "undefined"}
            <span class="text-6xl font-enso"
              ><Icons icon="check-circle" size="{6}" customClass="inline ml-2 text-success" /></span>
          {:else}
            <span class="text-6xl font-enso"
              ><Icons icon="information-circle" size="{6}" customClass="inline ml-2 text-alert" /></span>
          {/if}
        </div>
      </div>
      <div class="flex flex-col mb-5 text-sm">
        <Label key="dapps.o-homepage.components.survey.userDataCollection.gender" />
        <div class="flex">
          <DropDown
            selected="Select gender"
            items="{genderOfUserData}"
            id="gender"
            key="id"
            value="name"
            on:dropDownChange="{handleOnChange}" />
          {#if $gender.value && $gender.value !== "undefined"}
            <span class="text-6xl font-enso"
              ><Icons icon="check-circle" size="{6}" customClass="inline ml-2 text-success" /></span>
          {:else}
            <span class="text-6xl font-enso"
              ><Icons icon="information-circle" size="{6}" customClass="inline ml-2 text-alert" /></span>
          {/if}
        </div>
      </div>
      <div class="flex flex-col items-start mb-2 text-sm">
        <Label key="dapps.o-homepage.components.survey.userDataCollection.bornOn" />
        <div class="flex items-center h-12 mb-2 date-picker">
          <DateInput
            bind:value="{$dateOfBirth.value}"
            min="{new Date('1920-01-01')}"
            format="MM-dd-yyyy"
            placeholder="Choose a date"
            closeOnSelection="{true}" />

          {#if $dateOfBirth.value}
            <span class="text-6xl font-enso"
              ><Icons icon="check-circle" size="{6}" customClass="inline ml-2 text-success" /></span>
          {:else}
            <span class="text-6xl font-enso"
              ><Icons icon="information-circle" size="{6}" customClass="inline ml-2 text-alert" /></span>
          {/if}
        </div>
      </div>
    </div>
    <div class="flex flex-col mb-5 text-sm">
      <Label key="dapps.o-homepage.components.survey.userDataCollection.scanInvite" />
      <div class="flex ">
        <button
          class="px-8 overflow-hidden transition-all transform btn btn-primary"
          on:click="{() => handleClick('openQRCode')}"
          disabled="{$inviteUrl}">
          <!-- {$_("dapps.o-homepage.components.survey.button.scanInviteNow")} -->
          Scan Invite Now
        </button>
        <input type="hidden" bind:value="{$invite.value}" />

        {#if $inviteUrl}
          <span class="text-6xl font-enso"
            ><Icons icon="check-circle" size="{6}" customClass="inline ml-2 text-success" /></span>
        {:else}
          <span class="text-6xl font-enso"
            ><Icons icon="information-circle" size="{6}" customClass="inline ml-2 text-alert" /></span>
        {/if}
      </div>
    </div>
    {#if !$myForm.valid}
      <div class="text-sm text-center text-info">
        <Label key="dapps.o-homepage.components.survey.userDataCollection.info" />
      </div>
    {/if}
    <div class="flex flex-row justify-around w-full mt-10 mb-5 text-center buttons-container">
      <div>
        <button
          class="relative px-8 overflow-hidden transition-all transform btn bg-cpurple border-warning text-warning"
          on:click="{() => handleClick('back')}">
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

<style>
:global(.date-time-field input) {
  height: 45px !important;
  width: 320px !important;
  border-radius: var(--rounded-btn, 0.5rem) !important;
}
:global(.buttons-container) {
  margin-top: 80px;
}
</style>
