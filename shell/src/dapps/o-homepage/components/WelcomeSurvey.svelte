<script lang="ts">
import Button from "../../../shared/atoms/button/Button.svelte";
import Label from "../../../shared/atoms/Label.svelte";
import { _ } from "svelte-i18n";
import { push } from "svelte-spa-router";

function handleClick() {
  push("#/homepage/survey/2");
}
</script>

<div class="p-1 pr-4 -mt-6 overflow-hidden text-white whitespace-pre-line  xs:p-3 xs:-mt-2 font-heading">
  <div class="flex flex-col items-center justify-center">
    <div class="ml-2 text-white uppercase text-4xl">
      <Label key="dapps.o-homepage.components.survey.title.top" />
    </div>
    <div class="flex items-center justify-center my-5">
      <img src="/logos/circles.svg" class="w-32 h-32" alt="Circles Land" />
    </div>

    <div class="ml-2 text-white uppercase text-4xl font-heading">
      <Label key="dapps.o-homepage.components.survey.title.bottom" />
    </div>
  </div>
  <div class="mt-2 text-center text-xl"><Label key="dapps.o-homepage.components.survey.subtitle" /></div>
  <div class="mb-8 text-center uppercase mt-14 text-xl"><Label key="dapps.o-homepage.components.survey.circleIs" /></div>
  <div class="text-center uppercase whitespace-pre-line text-xl">
    <Label key="dapps.o-homepage.components.survey.eachCircle" />
  </div>
  <div class="buttons-container flex flex-row justify-around mt-10 mb-5 text-center">
    <div>
      <button
        class="relative px-8 overflow-hidden transition-all transform btn btn-light bg-cpurple border-warning text-warning svelte-12kbnbk"
        on:click="{() => handleClick()}">
        {$_("dapps.o-homepage.components.survey.button.goBack")}</button>
    </div>
    <div>
      <button
        class="relative px-16 overflow-hidden transition-all transform btn btn-primary bg-primary text-cpurple"
        on:click="{() => handleClick()}">
        {$_("dapps.o-homepage.components.survey.button.next")}</button>
    </div>
  </div>
</div>


<style>
  :global(.buttons-container) {
    margin-top: 180px;
  }
  </style>
