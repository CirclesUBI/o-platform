<script lang="ts">
import { me } from "../../../shared/stores/me";
import { onMount } from "svelte";

import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import {
  Capability
} from "../../../shared/api/data/types";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import DashboardInvitesWidget from "../molecules/DashboardInvitesWidget.svelte";
import DashboardColorCard from "../atoms/DashboardColorCard.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
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

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<div class="mx-auto md:w-2/3 xl:w-1/2">
  <div class="m-4 mb-40 ">
    <!--<LangSwitcher />-->
    <!-- bg-passport-light bg-passport bg-banking bg-banking-light bg-marketplace bg-marketplace-light bg-contacts bg-contacts-light -->
    <DashboardInvitesWidget />
    <div class="flex flex-col space-y-4">
      <DashboardColorCard
        color="passport"
        link="/passport/profile"
        blobshape="60% 40% 56% 38% / 99% 50% 90% 57%"
        icon="dashpassport"
        title="dapps.o-dashboard.pages.home.passport" />

      <DashboardColorCard
        color="banking"
        link="/banking/transactions"
        blobshape="137% 1% 119% 38% / 99% 60% 86% 73%"
        icon="dashbanking"
        title="dapps.o-dashboard.pages.home.banking" />

      <DashboardColorCard
        color="contacts"
        link="/contacts"
        blobshape="175% 0% 92% 93% / 110% 32% 110% 81%"
        icon="dashfriends"
        title="dapps.o-dashboard.pages.home.contacts" />
    </div>
  </div>
</div>
