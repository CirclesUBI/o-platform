<script lang="ts">
import Label from "../../../shared/atoms/Label.svelte";
import { _ } from "svelte-i18n";
import { push } from "svelte-spa-router";

function handleClick() {
  push("#/survey/page/1");
}
</script>

<div class="p-1 px-4 overflow-hidden text-white whitespace-pre-line xs:p-3 xs:-mt-2 font-heading">
  <div class="flex flex-col items-center justify-center mt-8">
    <div class="ml-2 text-4xl text-white uppercase">
      <Label key="dapps.o-homepage.components.survey.title.top" />
    </div>
    <div class="flex items-center justify-center my-5">
      <img src="/logos/circles.svg" class="w-32 h-32" alt="CirclesUBI.id" />
    </div>

    <div class="ml-2 text-4xl text-white uppercase font-heading">
      <span class="text-4xl sm:text-5xl">CIRCLES</span><span class="text-2xl sm:text-3xl">UBI.ID</span>
    </div>
  </div>
  <div class="mt-2 text-xl text-center"><Label key="dapps.o-homepage.components.survey.subtitle" /></div>
  <div class="mb-8 text-xl text-center uppercase mt-14">
    <Label key="dapps.o-homepage.components.survey.circleIs" />
  </div>
  <div class="text-xl text-center uppercase whitespace-pre-line">
    <Label key="dapps.o-homepage.components.survey.eachCircle" />
  </div>
  <div class="flex flex-row items-start justify-around pt-8 mb-5 text-center align-top">
    <div>
      <button class="relative px-8 overflow-hidden transition-all transform btn btn-primary bg-primary text-cpurple text-lg" on:click="{() => handleClick()}">
        {$_("dapps.o-homepage.components.survey.button.next")}</button>
    </div>
  </div>
</div>

<style>
:global(.buttons-container) {
  margin-top: 180px;
}
</style>
