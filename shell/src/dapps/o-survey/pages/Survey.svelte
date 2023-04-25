<script lang="ts">
import "../../../shared/css/tailwind.css";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import InformedConsentFirst from "../components/InformedConsentFirstSurvey.svelte";
import InformedConsentSecond from "../components/InformedConsentSecondSurvey.svelte";
import UserDataCollectionSurvey from "../components/UserDataCollectionSurvey.svelte";
import SignUpInvitation from "../components/SignUpInvitation.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let inviteCode: any;
export let id: string;

if (inviteCode) {
  localStorage.setItem("circlesInvite", inviteCode);
  window.runInitMachine();
}

sessionStorage.getItem("circlesKey");
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" />
<div class="mt-8">
  {#if id == "1"}
    <InformedConsentFirst />
  {/if}
  {#if id == "2"}
    <InformedConsentSecond />
  {/if}
  {#if id == "3"}
    <UserDataCollectionSurvey />
  {/if}
  {#if id == "4"}
    <SignUpInvitation />
  {/if}
</div>
