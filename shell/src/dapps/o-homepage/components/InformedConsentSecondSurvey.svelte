<script>
import Label from "../../../shared/atoms/Label.svelte";
import { _ } from "svelte-i18n";
import { push } from "svelte-spa-router";

let firstCheckbox = false;
let secondCheckbox = false;
let isValid = false;

function handleToggleCheckbox(event, message) {
if (event.target.checked) {
  if (message === 'first') {
    firstCheckbox = true;
  }
  if (message === 'second') {
    secondCheckbox = true;
  }
}
else {
  if (message === 'first') {
    firstCheckbox = false;
  }
  if (message === 'second') {
    secondCheckbox = false;
  }
}
}

$: {
isValid = firstCheckbox && secondCheckbox;
}

function handleClick(button) {
  if (button === 'back') {
    push('#/homepage/survey/2')
  }
  else {
    if (isValid) {
      push('#/homepage/survey/4')
    }
  }
  }
</script>

<div class="bg-cpurple p-1 xs:p-3 pr-4 -mt-6 xs:-mt-2 whitespace-pre-line overflow-hidden text-white bg-clip-content overflow-hidden">
  <div class="uppercase bg-negative py-5 px-10 text-center">
    <div>
    <Label key="dapps.o-homepage.components.survey.informedConsent.title.top" />
  </div>
  <div class="text-primary">
    <Label key="dapps.o-homepage.components.survey.informedConsent.title.middle" />
  </div>
  <div class="whitespace-pre-line">
    <Label key="dapps.o-homepage.components.survey.informedConsent.title.bottom" />
  </div>
    <Label key="dapps.o-homepage.components.survey.informedConsent.title.top" />
    <Label key="dapps.o-homepage.components.survey.informedConsent.title.middle" />
    <Label key="dapps.o-homepage.components.survey.informedConsent.title.bottom" />
  </div>
  <div class="uppercase mx-10 my-5">
    <input type="checkbox" class="checkbox checkbox-warning mr-2" on:change="{(event) => handleToggleCheckbox(event, 'first')}"/>
<Label key="dapps.o-homepage.components.survey.informedConsent.fourthCheckbox" />
  </div>
  <div class="uppercase mx-10 my-5">
    <input type="checkbox" class="checkbox checkbox-warning mr-2" on:change="{(event) => handleToggleCheckbox(event, 'second')}"/>
  <Label key="dapps.o-homepage.components.survey.informedConsent.fifthCheckbox" />
  </div>
  {#if !isValid}
  <div class="mx-10 my-5 text-sm text-info"><Label key="dapps.o-homepage.components.survey.informedConsent.info" /></div>
  {/if}
  <div class="flex flex-row justify-around text-center mt-10 mb-5">
    <div>
      <button
    class="btn transition-all overflow-hidden transform relative bg-cpurple px-8 border-warning text-warning"
    on:click="{() => handleClick('back')}">
    {$_('dapps.o-homepage.components.survey.button.goBack')}</button>
  
    </div>
    <div>
      <button
    class="btn transition-all overflow-hidden transform relative bg-primary px-16 text-cpurple"
    on:click="{() => handleClick('next')}" disabled={!isValid}>
    {$_('dapps.o-homepage.components.survey.button.next')}</button>
    </div>
    </div>
</div>
