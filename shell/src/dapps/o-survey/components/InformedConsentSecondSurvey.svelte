<script lang="ts">
import { surveyConsents } from "../stores/surveyStore";
import Label from "../../../shared/atoms/Label.svelte";
import { _ } from "svelte-i18n";
import { push } from "svelte-spa-router";
import { form, field } from "svelte-forms";
import { required } from "svelte-forms/validators";
import { onMount } from "svelte";
sessionStorage.setItem("surveyConsentPage2", "false");

function validateCheckBox() {
  return (value: boolean) => ({ valid: value === true, name: "not_set" });
}

const exchange = field("exchange", false, [required(), validateCheckBox()]);
const onlyFromFriends = field("onlyFromFriends", false, [required(), validateCheckBox()]);
const noExchanges = field("noExchanges", false, [required(), validateCheckBox()]);
const unethicalItems = field("unethicalItems", false, [required(), validateCheckBox()]);
const inactiveAccount = field("inactiveAccount", false, [required(), validateCheckBox()]);
const myForm = form(exchange, onlyFromFriends, noExchanges, unethicalItems, inactiveAccount);
myForm.validate();

onMount(() => {
  if (sessionStorage.getItem("surveyConsentPage1") === "true") {
    $exchange.value = $surveyConsents.exchangeConsent;
    $onlyFromFriends.value = $surveyConsents.onlyFromFriendsConsent;
    $noExchanges.value = $surveyConsents.noExchangesConsent;
    $unethicalItems.value = $surveyConsents.unethicalItemsConsent;
    $inactiveAccount.value = $surveyConsents.inactiveAccountConsent;
  } else {
    push("#/survey/page/1");
  }
});

function handleClick(button) {
  if (button === "back") {
    push("#/survey/page/1");
  } else {
    if ($myForm.valid) {
      $surveyConsents.exchangeConsent = $exchange.value;
      $surveyConsents.onlyFromFriendsConsent = $onlyFromFriends.value;
      $surveyConsents.noExchangesConsent = $noExchanges.value;
      $surveyConsents.unethicalItemsConsent = $unethicalItems.value;
      $surveyConsents.inactiveAccountConsent = $inactiveAccount.value;
      $surveyConsents.allConsentsGiven = true;
      sessionStorage.setItem("surveyConsentPage2", "true");
      push("#/survey/page/3");
    } else {
      sessionStorage.setItem("surveyConsentPage2", "false");
    }
  }
}
</script>

<div class="overflow-hidden text-white whitespace-pre-line bg-cpurple bg-clip-content font-heading">
  <div class="px-10 py-5 text-center uppercase bg-negative">
    <div>
      <Label key="dapps.o-homepage.components.survey.informedConsent.title.top" />
    </div>
    <div class="text-primary">
      <Label key="dapps.o-homepage.components.survey.informedConsent.title.middle" />
    </div>
    <div class="whitespace-pre-line">
      <Label key="dapps.o-homepage.components.survey.informedConsent.title.bottom" />
    </div>
  </div>
  <div class="mx-auto mb-20 md:w-2/3 xl:w-1/2">
    <div class="mx-10 my-5 uppercase">
      <input id="check-1" type="checkbox" class="mr-2 checkbox checkbox-warning" bind:checked="{$exchange.value}" />
      <label for="check-1" class="cursor-pointer">
        <Label key="dapps.o-homepage.components.survey.informedConsent.fourthCheckbox" />
      </label>
    </div>
    <div class="mx-10 my-5 uppercase">
      <input id="check-2" type="checkbox" class="mr-2 checkbox checkbox-warning" bind:checked="{$onlyFromFriends.value}" />
      <label for="check-2" class="cursor-pointer">
        <Label key="dapps.o-homepage.components.survey.informedConsent.fifthCheckbox" />
      </label>
    </div>
    <div class="mx-10 my-5 uppercase">
      <input id="check-3" type="checkbox" class="mr-2 checkbox checkbox-warning" bind:checked="{$noExchanges.value}" />
      <label for="check-3" class="cursor-pointer">
        <Label key="dapps.o-homepage.components.survey.informedConsent.sixthCheckbox" />
      </label>
    </div>
    <div class="mx-10 my-5 uppercase">
      <input id="check-4" type="checkbox" class="mr-2 checkbox checkbox-warning" bind:checked="{$unethicalItems.value}" />
      <label for="check-4" class="cursor-pointer">
        <Label key="dapps.o-homepage.components.survey.informedConsent.seventhCheckbox" />
      </label>
    </div>
    <div class="mx-10 my-5 uppercase">
      <input id="check-5" type="checkbox" class="mr-2 checkbox checkbox-warning" bind:checked="{$inactiveAccount.value}" />
      <label for="check-5" class="cursor-pointer">
        <Label key="dapps.o-homepage.components.survey.informedConsent.eighthCheckbox" />
      </label>
    </div>
    {#if !$myForm.valid}
      <div class="mx-10 my-5 text-sm text-center text-info">
        <Label key="dapps.o-homepage.components.survey.informedConsent.info" />
      </div>
    {/if}
    <div class="flex flex-row justify-around mt-10 mb-5 text-center">
      <div>
        <button class="relative px-8 overflow-hidden transition-all transform btn bg-cpurple border-warning text-warning text-lg" on:click="{() => handleClick('back')}">
          {$_("dapps.o-homepage.components.survey.button.goBack")}</button>
      </div>
      <div>
        {#if $myForm.dirty}
          <button
            class="relative px-8 overflow-hidden transition-all transform btn btn-primary bg-primary text-cpurple text-lg"
            on:click="{() => handleClick('next')}"
            disabled="{!$myForm.valid}">
            {$_("dapps.o-homepage.components.survey.button.next")}</button>
        {/if}
      </div>
    </div>
  </div>
</div>
