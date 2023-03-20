<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { EventType, SortOrder } from "../../../shared/api/data/types";
import { _ } from "src/i18n/i18n";
import Label from "../../../shared/atoms/Label.svelte";
import { MyInbox } from "../../../shared/stores/inbox";
import EventList from "../../../shared/molecules/Lists/EventList.svelte";
import TransactionCard from "../../o-banking/atoms/TransactionCard.svelte";
import RedeemedInvitationCard from "../atoms/RedeemedInvitationCard.svelte";
import GenericEventCard from "../atoms/GenericEventCard.svelte";
import ContactCard from "../../o-notifications/atoms/ContactCard.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let inbox = new MyInbox(SortOrder.Desc, 30, [EventType.CrcHubTransfer, EventType.CrcMinting, EventType.CrcTrust, EventType.InvitationRedeemed, EventType.Erc20Transfer]);

const views = {
  [EventType.CrcHubTransfer]: { component: TransactionCard },
  [EventType.CrcMinting]: { component: TransactionCard },
  [EventType.CrcTrust]: { component: ContactCard },
  [EventType.InvitationRedeemed]: { component: RedeemedInvitationCard },
  [EventType.Erc20Transfer]: { component: TransactionCard },
};
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<div class="bg-notifications" style="visibility: hidden"></div>
<!-- <div class="px-4 mx-auto mt-12 text-center md:w-2/3 xl:w-1/2 font-heading text-notifications">
  <h1 class="text-5xl">
    <Label key="dapps.o-notifications.pages.home.title" />
  </h1>
</div> -->
<div class="px-4 pt-12 mx-auto mb-20 md:w-2/3 xl:w-1/2">
  <EventList store="{inbox}" views="{views}" />
</div>
