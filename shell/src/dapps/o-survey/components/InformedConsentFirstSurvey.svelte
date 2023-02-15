<script lang="ts">
import { surveyConsents } from "../../o-survey/stores/surveyStore";
import Label from "../../../shared/atoms/Label.svelte";
import { _ } from "svelte-i18n";
import { push } from "svelte-spa-router";
import { form, field } from "svelte-forms";
import { required } from "svelte-forms/validators";
sessionStorage.setItem("surveyConsentPage1", "false");

function validateCheckBox() {
  return (value: boolean) => ({ valid: value === true, name: "not_set" });
}
const research = field("research", false, [required(), validateCheckBox()]);
const participate = field("participate", false, [required(), validateCheckBox()]);
const ending = field("ending", false, [required(), validateCheckBox()]);
const myForm = form(research, participate, ending);
myForm.validate();

function handleClick(button) {
  if (button === "back") {
    push("#/survey/1");
  } else {
    if ($myForm.valid) {
      $surveyConsents.researchConsent = $research.value;
      $surveyConsents.participateConsent = $participate.value;
      $surveyConsents.endingConsent = $ending.value;
      sessionStorage.setItem("surveyConsentPage1", "true");
      push("#/survey/3");
    } else {
      sessionStorage.setItem("surveyConsentPage1", "false");
    }
  }
}
</script>

<div class="overflow-hidden text-white whitespace-pre-line bg-clip-content font-heading">
  <div class="px-5 py-5 text-center uppercase bg-negative">
    <div class="survey-text">
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
      <input id="check-1" type="checkbox" class="mr-2 checkbox checkbox-warning" bind:checked="{$research.value}" />
      <label for="check-1" class="cursor-pointer">
        <Label key="dapps.o-homepage.components.survey.informedConsent.firstCheckbox" />
      </label>
    </div>
    <div class="mx-10 my-5 uppercase">
      <input id="check-2" type="checkbox" class="mr-2 checkbox checkbox-warning" bind:checked="{$participate.value}" />
      <label for="check-2" class="cursor-pointer">
        <Label key="dapps.o-homepage.components.survey.informedConsent.secondCheckbox" />
      </label>
    </div>
    <div class="mx-10 my-5 uppercase">
      <input id="check-3" type="checkbox" class="mr-2 checkbox checkbox-warning" bind:checked="{$ending.value}" />
      <label for="check-3" class="cursor-pointer">
        <Label key="dapps.o-homepage.components.survey.informedConsent.thirdCheckbox" />
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
