<script lang="ts">
  import Button from "../../../shared/atoms/button/Button.svelte";
  import Label from "../../../shared/atoms/Label.svelte";
  import { _ } from "svelte-i18n";
  import { push } from "svelte-spa-router";
  
  function handleClick() {
    push('#/homepage/survey/2')
  }
  </script>
  
  <div class="bg-cpurple p-1 xs:p-3 pr-4 -mt-6 xs:-mt-2 whitespace-pre-line overflow-hidden text-white">
    <div class="flex items-center justify-center flex-col">
      <div class="ml-2 text-2xl text-white uppercase xs:text-4xl font-heading">
      <Label  key="dapps.o-homepage.components.survey.title.top" />
       </div>
      <div class="flex items-center justify-center my-5">
        <img src="/logos/circles.svg" class="w-6 h-6 xs:w-32 xs:h-32" alt="Circles Land" />
      </div>
  
      <div class="ml-2 text-2xl text-white uppercase xs:text-4xl font-heading">
      <Label key="dapps.o-homepage.components.survey.title.bottom" />
    </div>
    </div>
    <div class="text-center mt-2"><Label key="dapps.o-homepage.components.survey.subtitle" /></div>
    <div class="text-center uppercase mt-14 mb-8"><Label key="dapps.o-homepage.components.survey.circleIs" /></div>
    <div class="text-center uppercase whitespace-pre-line"><Label key="dapps.o-homepage.components.survey.eachCircle" /></div>
    <div class="flex flex-row justify-around text-center mt-10 mb-5">
    <div>
      <button
    class="btn btn-light transition-all overflow-hidden transform relative bg-cpurple px-8 border-warning text-warning svelte-12kbnbk"
    on:click="{() => handleClick()}">
    {$_('dapps.o-homepage.components.survey.button.goBack')}</button>
    </div>
    <div>
      <button
    class="btn btn-primary transition-all overflow-hidden transform relative bg-primary px-16 text-cpurple"
    on:click="{() => handleClick()}">
    {$_('dapps.o-homepage.components.survey.button.next')}</button>
    </div>
    </div>
  </div>
  