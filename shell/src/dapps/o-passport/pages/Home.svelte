<script lang="ts">
import CopyToClipboard from "../../../shared/atoms/CopyClipboard.svelte";
import PassportHeader from "../atoms/PassportHeader.svelte";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { Profile, Businesses } from "../../../shared/api/data/types";
import { upsertIdentity } from "../processes/upsertIdentity";

import { Environment } from "../../../shared/environment";

import { AvataarGenerator } from "../../../shared/avataarGenerator";
import { onMount } from "svelte";
import { upsertOrganisation } from "../../o-coop/processes/upsertOrganisation";
import QrCode from "../../../shared/molecules/QrCode/QrCode.svelte";
import Label from "../../../shared/atoms/Label.svelte";
import StandardHeaderBox from "../../../shared/atoms/StandardHeaderBox.svelte";

let name;
let profile: Profile;
let businesses: Businesses[];
export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

const options = {};

$: name = profile?.circlesAddress ? profile.circlesAddress : "";

onMount(() => {
  if ($me) {
    profile = $me;
  } else {
    profile = undefined;
  }
  if (profile && profile.memberships) {
    businesses = profile.memberships.reduce(function (result, option) {
      if (option.isAdmin === true) {
        return result.concat(option.organisation);
      }
      return result;
    }, []);

    console.log("BUS", businesses);
  }
});

function editProfile(dirtyFlags: { [x: string]: boolean }) {
  if (profile.__typename == "Organisation") {
    window.o.runProcess(upsertOrganisation, profile, {}, Object.keys(dirtyFlags));
  } else {
    window.o.runProcess(upsertIdentity, profile, {}, Object.keys(dirtyFlags));
  }
}
</script>

<PassportHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

{#if profile}
  <div class="flex flex-col px-4 mx-auto mt-8 mb-20 space-y-6 md:w-2/3 xl:w-1/2">
    <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.home.qrcodeheading">
      <div slot="standardHeaderBoxContent">
        <section class="justify-center">
          <div class="flex flex-col w-full space-y-2">
            <div class="text-left ">
              <Label key="dapps.o-passport.pages.home.qrcode" />
            </div>
            <div class="container p-1 pt-2 xs:p-4">
              <center>
                {#if profile}
                  <QrCode value="{profile.circlesAddress}" size="250" />
                {/if}
              </center>
            </div>
          </div>
        </section>
      </div>
    </StandardHeaderBox>
    <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.home.myshops">
      <div slot="standardHeaderBoxContent">
        <section class="justify-center">
          <div class="flex flex-col w-full space-y-2">
            <h2 class="text-alert">
              Your Newly created shops are only displayed after a log-out and log in. (e.g. through clicking the Action
              button on the bottom and switching to a different profile and back) <strong>WORK IN PROGRESS</strong>
            </h2>
            <div class="container p-1 pt-2 xs:p-4">
              <ul>
                {#if businesses}
                  {#each businesses as business}
                    <li><a href="#/passport/organization/{business.circlesAddress}">{business.name}</a></li>
                  {/each}
                {/if}
              </ul>
            </div>
            <div class="container p-1 pt-2 text-center xs:p-4">
              <a href="/#/passport/new-organization"><button class="btn btn-primary btn-sm">Add new Shop</button></a>
            </div>
          </div>
        </section>
      </div>
    </StandardHeaderBox>
    {#if profile.circlesAddress}
      <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.home.address">
        <div slot="standardHeaderBoxContent">
          <section class="justify-center">
            <div class="flex flex-col w-full space-y-1">
              <div class="flex items-center w-full space-x-2 sm:space-x-4">
                <div class="text-left">
                  <div class="inline-block break-all" id="clipboard">
                    {#if profile}
                      {profile.circlesAddress ? profile.circlesAddress : ""}

                      <CopyToClipboard text="{name}" let:copy>
                        <svg
                          role="presentation"
                          on:click="{copy}"
                          xmlns="http://www.w3.org/2000/svg"
                          class="inline w-4 h-4 stroke-current text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0
                00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0
                012 2"></path>
                        </svg>
                      </CopyToClipboard>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </StandardHeaderBox>
    {/if}
  </div>
{/if}
