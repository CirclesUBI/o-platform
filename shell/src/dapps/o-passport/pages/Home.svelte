<script lang="ts">
import CopyToClipboard from "../../../shared/atoms/CopyClipboard.svelte";
import PassportHeader from "../atoms/PassportHeader.svelte";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { Profile, Businesses, Organisation } from "../../../shared/api/data/types";
import { upsertIdentity } from "../processes/upsertIdentity";
import { loadProfile } from "../../../shared/functions/loadProfile";
import { createOrganisation } from "../../o-coop/processes/createOrganisation";
import { onMount } from "svelte";
import { upsertOrganisation } from "../../o-coop/processes/upsertOrganisation";
import QrCode from "../../../shared/molecules/QrCode/QrCode.svelte";
import Label from "../../../shared/atoms/Label.svelte";
import StandardHeaderBox from "../../../shared/atoms/StandardHeaderBox.svelte";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import { push } from "svelte-spa-router";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { _ } from "svelte-i18n";

let name;
let profile: Profile;
let businesses: Organisation[];
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
  }
});

function switchAccount(account) {
  window.o.publishEvent(<PlatformEvent>{
    type: "shell.loggedOut",
  });
  window.o.publishEvent(<PlatformEvent>{
    type: "shell.authenticated",
    profile: account,
  });
  localStorage.removeItem("editShopIndex");

  location.reload();
}

function createNewOrga() {
  window.o.runProcess(
    createOrganisation,
    {
      successAction: async (data) => {
        const createdOrga = await loadProfile(data.circlesAddress, $me);
        window.o.publishEvent(<PlatformEvent>{
          type: "shell.loggedOut",
        });
        window.o.publishEvent(<PlatformEvent>{
          type: "shell.authenticated",
          profile: {
            ...createdOrga.profile,
            __typename: "Organisation",
            type: "Organisation",
            firstName: createdOrga.profile.firstName,
            description: createdOrga.profile.dream,
            locationName: createdOrga.profile.locationName,
            location: createdOrga.profile.location,
          },
        });

        push(`#/market/mystore/${createdOrga.profile.circlesAddress}`);
      },
    },
    {}
  );
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
    {#if profile.__typename == "Profile"}
      <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.home.myshops">
        <div slot="standardHeaderBoxContent">
          <section class="justify-center">
            <div class="flex flex-col w-full space-y-4">
              {#if businesses}
                {#each businesses as business}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <div class="flex items-center w-full space-x-2 cursor-pointer" on:click="{switchAccount(business)}">
                    <div class="">
                      <UserImage profile="{business}" size="{8}" profileLink="{false}" />
                    </div>
                    <div>
                      {business.firstName}
                    </div>
                  </div>
                {/each}
              {:else}
                <div class="container p-1 pt-2 text-center xs:p-4">
                  <button class="btn btn-primary btn-sm" on:click="{createNewOrga}">{$_("dapps.o-passport.pages.home.addNewShop")}</button>
                </div>
              {/if}
            </div>
          </section>
        </div>
      </StandardHeaderBox>
    {:else}
      <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.home.editProfile">
        <div slot="standardHeaderBoxContent">
          <section class="justify-center">
            <div class="flex flex-col w-full space-y-2">
              <div class="container p-1 pt-2 xs:p-4">
                <center>
                  <a href="#/market/mystore/{profile.circlesAddress}" class="text-center"><button class="btn btn-primary">{$_("dapps.o-passport.pages.home.editShop")}</button></a>
                </center>
              </div>
            </div>
          </section>
        </div>
      </StandardHeaderBox>
    {/if}
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
