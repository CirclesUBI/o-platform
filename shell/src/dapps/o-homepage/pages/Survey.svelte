<script lang="ts">
import "../../../shared/css/tailwind.css";
import TopNav from "../../../shared/atoms/TopNav.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import VideoHeader from "../components/VideoHeader.svelte";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import WelcomeSurvey from "../components/WelcomeSurvey.svelte";
import InformedConsentFirst from "../components/InformedConsentFirstSurvey.svelte";
import InformedConsentSecond from "../components/InformedConsentSecondSurvey.svelte";
import UserDataCollectionSurvey from "../components/UserDataCollectionSurvey.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let inviteCode: any;
export let id: string;

if (inviteCode) {
  localStorage.setItem("circlesInvite", inviteCode);
  window.runInitMachine();
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<div>
  {#if id == "1"}
    <WelcomeSurvey />
  {/if}
  {#if id == "2"}
    <InformedConsentFirst />
  {/if}
  {#if id == "3"}
    <InformedConsentSecond />
  {/if}
  {#if id == "4"}
    <UserDataCollectionSurvey />
  {/if}
</div>
