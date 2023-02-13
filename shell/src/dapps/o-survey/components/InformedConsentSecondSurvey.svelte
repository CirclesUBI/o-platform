<script lang="ts">
import { surveyConsents } from "../stores/surveyStore";
import Label from "../../../shared/atoms/Label.svelte";
import { _ } from "svelte-i18n";
import { push } from "svelte-spa-router";
import { form, field } from "svelte-forms";
import { required } from "svelte-forms/validators";
sessionStorage.setItem("surveyConsentPage2", "false");

function validateCheckBox() {
  return (value: boolean) => ({ valid: value === true, name: "not_set" });
}

const exchange = field("exchange", false, [required(), validateCheckBox()]);
const dataCollect = field("dataCollect", false, [required(), validateCheckBox()]);
const onlyFromFriends = field("onlyFromFriends", false, [required(), validateCheckBox()]);
const myForm = form(exchange, dataCollect, onlyFromFriends);
myForm.validate();

function handleClick(button) {
  if (button === "back") {
    push("#/survey/2");
  } else {
    if ($myForm.valid) {
      $surveyConsents.exchangeConsent = $exchange.value;
      $surveyConsents.dataCollectConsent = $dataCollect.value;
      $surveyConsents.onlyFromFriends = $onlyFromFriends.value;
      $surveyConsents.allConsentsGiven = true;
      sessionStorage.setItem("surveyConsentPage2", "true");
      push("#/survey/4");
    } else {
      sessionStorage.setItem("surveyConsentPage2", "false");
    }
  }
}
</script>

<div class="overflow-hidden text-white whitespace-pre-line bg-cpurple bg-clip-content">
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
      <input id="check-2" type="checkbox" class="mr-2 checkbox checkbox-warning" bind:checked="{$dataCollect.value}" />
      <label for="check-2" class="cursor-pointer">
        <Label key="dapps.o-homepage.components.survey.informedConsent.fifthCheckbox" />
      </label>
    </div>
    <div class="mx-10 my-5 uppercase">
      <input
        id="check-3"
        type="checkbox"
        class="mr-2 checkbox checkbox-warning"
        bind:checked="{$onlyFromFriends.value}" />
      <label for="check-3" class="cursor-pointer">
        <Label key="dapps.o-homepage.components.survey.informedConsent.sixthCheckbox" />
      </label>
    </div>
    {#if !$myForm.valid}
      <div class="mx-10 my-5 text-sm text-center text-info">
        <Label key="dapps.o-homepage.components.survey.informedConsent.info" />
      </div>
    {/if}
    <div class="flex flex-row justify-around mt-10 mb-5 text-center">
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
