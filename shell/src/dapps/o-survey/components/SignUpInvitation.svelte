<script lang="ts">
import { _ } from "svelte-i18n";
import { push } from "svelte-spa-router";
import Label from "../../../shared/atoms/Label.svelte";

async function handleClick(button) {
  if (button === "back") {
    push("#/survey/page/3");
  } else if (button === "submit") {
    const inviteUrl = sessionStorage.getItem("inviteUrl");
    if (inviteUrl == "/") {
      window.runInitMachine();
    } else {
      window.location = sessionStorage.getItem("inviteUrl");
    }
  }
}
</script>

<div class="p-1 -mt-6 overflow-hidden text-white whitespace-pre-line xs:p-3 xs:-mt-2">
  <div class="flex flex-col items-center justify-center">
    <div class="flex items-center justify-center my-5">
      <img src="/logos/circles.svg" class="w-32 h-32" alt="Circles Land" />
    </div>

    <div class="ml-2 text-4xl text-white uppercase font-heading">
      <span class="text-4xl sm:text-5xl">CIRCLES</span><span class="text-2xl sm:text-3xl">UBI.ID</span>
    </div>
  </div>
  <div class="mt-2 text-center"><Label key="dapps.o-homepage.components.survey.subtitle" /></div>
  <div class="my-8 text-xl text-center uppercase">
    <div class="ml-2 text-5xl text-white uppercase font-heading">
      <Label key="dapps.o-homepage.components.survey.success" />
    </div>
    <div class="mt-2 text-2xl text-center font-heading">
      <Label key="dapps.o-homepage.components.survey.signupInvitation.success.subtitle" />
    </div>
  </div>
  <div class="text-center whitespace-pre-line">
    {#if !sessionStorage.getItem("inviteUrl")}
      <div class="text-sm text-center text-info">
        <Label key="dapps.o-homepage.components.survey.signupInvitation.noInvitationCode" />
      </div>
      <button class="relative px-8 mt-6 overflow-hidden transition-all transform btn btn-primary text-lg" on:click="{() => handleClick('back')}">
        {$_("dapps.o-homepage.components.survey.button.goBack")}</button>
    {:else}
      <button class="relative px-8 overflow-hidden transition-all transform btn btn-primary text-lg" on:click="{() => handleClick('submit')}">
        {$_("dapps.o-homepage.components.survey.button.signUpNow")}</button>
    {/if}
  </div>
</div>
