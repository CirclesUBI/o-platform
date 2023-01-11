<script>
import Label from "../../../shared/atoms/Label.svelte";
import { _ } from "svelte-i18n";
import { push } from "svelte-spa-router";

let firstCheckbox = false;
let secondCheckbox = false;
let thirdCheckbox = false;
let isValid = false;

function handleToggleCheckbox(event, message) {
  if (event.target.checked) {
    if (message === "first") {
      firstCheckbox = true;
    }
    if (message === "second") {
      secondCheckbox = true;
    }
    if (message === "third") {
      thirdCheckbox = true;
    }
  } else {
    if (message === "first") {
      firstCheckbox = false;
    }
    if (message === "second") {
      secondCheckbox = false;
    }
    if (message === "third") {
      thirdCheckbox = false;
    }
  }
}

$: {
  isValid = firstCheckbox && secondCheckbox && thirdCheckbox;
}

function handleClick(button) {
  if (button === "back") {
    push("#/homepage/survey/1");
  } else {
    if (isValid) {
      push("#/homepage/survey/3");
    }
  }
}
</script>

<div class="overflow-hidden text-white whitespace-pre-line bg-clip-content">
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
      <input
        id="check-1"
        type="checkbox"
        class="mr-2 checkbox checkbox-warning"
        on:change="{(event) => handleToggleCheckbox(event, 'first')}" />
      <label for="check-1" class="cursor-pointer">
        <Label key="dapps.o-homepage.components.survey.informedConsent.firstCheckbox" />
      </label>
    </div>
    <div class="mx-10 my-5 uppercase">
      <input
        id="check-2"
        type="checkbox"
        class="mr-2 checkbox checkbox-warning"
        on:change="{(event) => handleToggleCheckbox(event, 'second')}" />
      <label for="check-2" class="cursor-pointer">
        <Label key="dapps.o-homepage.components.survey.informedConsent.secondCheckbox" />
      </label>
    </div>
    <div class="mx-10 my-5 uppercase">
      <input
        id="check-3"
        type="checkbox"
        class="mr-2 checkbox checkbox-warning"
        on:change="{(event) => handleToggleCheckbox(event, 'third')}" />
      <label for="check-3" class="cursor-pointer">
        <Label key="dapps.o-homepage.components.survey.informedConsent.thirdCheckbox" />
      </label>
    </div>
    {#if !isValid}
      <div class="mx-10 my-5 text-sm text-info text-center">
        <Label key="dapps.o-homepage.components.survey.informedConsent.info" />
      </div>
    {/if}
    <div class="buttons-container flex flex-row justify-around mt-10 mb-5 text-center">
      <div>
        <button
          class="relative px-8 overflow-hidden transition-all transform btn bg-cpurple border-warning text-warning"
          on:click="{() => handleClick('back')}">
          {$_("dapps.o-homepage.components.survey.button.goBack")}</button>
      </div>
      <div>
        <button
          class="relative px-16 overflow-hidden transition-all transform btn btn-primary bg-primary text-cpurple"
          on:click="{() => handleClick('next')}"
          disabled="{!isValid}">
          {$_("dapps.o-homepage.components.survey.button.next")}</button>
      </div>
    </div>
  </div>
</div>

<style>
  :global(.buttons-container) {
    margin-top: 200px;
  }
  </style>