<script lang="ts">
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import CopyToClipboard from "../../../shared/atoms/CopyClipboard.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { me } from "../../../shared/stores/me";
import { KeyManager } from "../data/keyManager";
import AccountCard from "../atoms/AccountCard.svelte";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { _ } from "svelte-i18n";
import StandardHeaderBox from "../../../shared/atoms/StandardHeaderBox.svelte";
import { onMount } from "svelte";

export let runtimeDapp: RuntimeDapp<any>;

let keyManager: KeyManager | null = null;
let profile;

async function init() {
  const km = new KeyManager($me.circlesAddress);
  await km.load();
  keyManager = km;
}

$: {
  if ($me && $me.circlesAddress) {
    init();
  }
}
onMount(() => {
  if ($me) {
    profile = $me;
  } else {
    profile = undefined;
  }
});
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" />
<div class="px-4 mx-auto mt-8 mb-20 md:w-2/3 xl:w-1/2">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: $me,
      noShadow: true,
      title: $me.displayName,
      subTitle: `${window.o.i18n('dapps.o-passport.pages.account.subTitle')}`,
      truncateMain: true,
    }}">
    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl">{$_("dapps.o-passport.pages.account.ubi")}</div>
    </div>
  </ItemCard>

  {#if keyManager}
    {#each Object.values(keyManager.eoas).sort((a, b) => a.address.localeCompare(b.address)) as key}
      <AccountCard key="{key}" />
    {/each}
  {/if}
  {#if profile}
    <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.home.address">
      <div slot="standardHeaderBoxContent">
        <section class="justify-center">
          <div class="flex flex-col w-full space-y-1">
            <div class="flex items-center w-full space-x-2 sm:space-x-4">
              <div class="text-left">
                <div class="inline-block break-all" id="clipboard">
                  {profile.circlesAddress ? profile.circlesAddress : ""}

                  <!-- svelte-ignore missing-declaration -->
                  <CopyToClipboard text="{profile.circlesAddress}" let:copy>
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
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </StandardHeaderBox>
  {/if}
</div>
