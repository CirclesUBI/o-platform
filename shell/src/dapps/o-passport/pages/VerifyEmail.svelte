<script lang="ts">
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import Icons from "../../../shared/molecules/Icons.svelte";
import { onMount } from "svelte";
import { Environment } from "../../../shared/environment";
import { _ } from "svelte-i18n";

export let secret: string = undefined;
export let runtimeDapp: RuntimeDapp<any>;

let showButton: boolean = false;

function verify() {
  if (secret && secret != "failed" && secret != "success") {
    window.location.assign(`${Environment.apiEndpointUrl}/trigger?hash=${secret}`);
  }
}
onMount(() => {
  verify();
  setTimeout(() => {
    if (secret && secret != "failed" && secret != "success") {
      showButton = true;
    }
  }, 800);
});
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" />

<div class="mx-auto md:w-2/3 xl:w-1/2">
  <!-- <section class="flex items-center justify-center mx-4 mb-2 -mt-2">
    <Card>
      <div class="text-xs font-bold text-left text-primary">EMAIL</div>
      <div class="flex items-center w-full space-x-2 bg-white sm:space-x-6">
        <div class="mr-2 text-center">{email}</div>
      </div>
    </Card>
  </section> -->
  <section class="mx-4 mb-2 -mt-2">
    <div class="flex flex-col w-full px-3 py-2 space-x-2 bg-white rounded-lg shadow-md">
      <div class="flex flex-col space-y-2">
        <div class="text-left">
          {#if secret && secret == "success"}
            <h1>{$_("dapps.o-passport.pages.verifyEmail.thankYou")}</h1>
            <p class="mt-4">{$_("dapps.o-passport.pages.verifyEmail.emailVerifiedAndChanged")}</p>
            <p class="mt-4">
              <a href="/#/home" class="link link-primary">{$_("dapps.o-passport.pages.verifyEmail.dashboard")}</a>
            </p>
          {:else if secret && secret == "failed"}
            <h1>{$_("dapps.o-passport.pages.verifyEmail.oops")}</h1>
            <p class="mt-4">{$_("dapps.o-passport.pages.verifyEmail.emailVerificationFailed")}</p>
            <p class="mt-4">
              {$_("dapps.o-passport.pages.verifyEmail.linkExpired")}
              <br />
              {$_("dapps.o-passport.pages.verifyEmail.pleaseNote")}
            </p>
            <p class="mt-4">
              {$_("dapps.o-passport.pages.verifyEmail.please")}
              <a href="/" class="link link-primary">{$_("dapps.o-passport.pages.verifyEmail.login")}</a>
              {$_("dapps.o-passport.pages.verifyEmail.goToPassport")}
            </p>
          {:else if showButton}
            <h1>{$_("dapps.o-passport.pages.verifyEmail.verifyEmailAddress")}</h1>
            <p class="mt-4">{$_("dapps.o-passport.pages.verifyEmail.useButtonBellow")}</p>
            <p class="mt-4">
              <button
                type="submit"
                on:click="{() => {
                  verify();
                }}"
                class="relative btn btn-primary"
                ><span class="pr-4">{$_("dapps.o-passport.pages.verifyEmail.verifyMyEmailAddress")}</span>
                <div class="absolute right-2">
                  <Icons icon="buttonrightarrow" />
                </div>
              </button>
            </p>
          {/if}
        </div>
      </div>
    </div>
  </section>
</div>
