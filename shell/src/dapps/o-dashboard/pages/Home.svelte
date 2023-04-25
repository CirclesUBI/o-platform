<script lang="ts">
import { me } from "../../../shared/stores/me";
import { onMount } from "svelte";

import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Capability, CapabilityType } from "../../../shared/api/data/types";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import DashboardInvitesWidget from "../molecules/DashboardInvitesWidget.svelte";
import DashboardColorCard from "../atoms/DashboardColorCard.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let capabilities: Capability[] | undefined = [];

$: me;

let disableBanking: boolean = false;

const init = async () => {
  const pk = sessionStorage.getItem("circlesKey");
  disableBanking = !pk;

  const sessionInfo = await me.getSessionInfo();
  capabilities = sessionInfo.capabilities;
};

onMount(init);
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" />
<div class="mx-auto md:w-2/3 xl:w-1/2">
  <div class="m-4 mt-4 mb-40">
    {#if $me && $me.__typename === "Profile" && capabilities && capabilities.find((o) => o.type === CapabilityType.Invite)}
      <DashboardInvitesWidget />
    {/if}

    <div class="relative z-0 flex flex-col space-y-4">
      <DashboardColorCard color="passport" link="/passport/profile" blobshape="60% 40% 56% 38% / 99% 50% 90% 57%" icon="passport" title="dapps.o-dashboard.pages.home.passport" />

      <DashboardColorCard color="banking" link="/banking/transactions" blobshape="137% 1% 119% 38% / 99% 60% 86% 73%" icon="banking" title="dapps.o-dashboard.pages.home.banking" />

      <DashboardColorCard color="marketplace" link="/market/listing" blobshape="75% 0% 92% 93% / 110% 32% 110% 81%" icon="marketlisting" title="dapps.o-dashboard.pages.home.marketlisting" />

      <DashboardColorCard color="contacts" link="/contacts" blobshape="175% 0% 92% 93% / 110% 32% 110% 81%" icon="dashfriends" title="dapps.o-dashboard.pages.home.contacts" />

      <div class="w-full mx-auto">
        <img src="images/common/broadcast.svg" alt="Marketplace" class="w-full" />
      </div>
    </div>
  </div>
</div>
