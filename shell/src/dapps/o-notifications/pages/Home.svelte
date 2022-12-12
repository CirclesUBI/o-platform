<script lang="ts">
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {EventType, SortOrder} from "../../../shared/api/data/types";
  import {MyInbox} from "../../../shared/stores/inbox";
  import EventList from "../../../shared/molecules/Lists/EventList.svelte";
  import TransactionCard from "../../o-banking/atoms/TransactionCard.svelte";
  import RedeemedInvitationCard from "../atoms/RedeemedInvitationCard.svelte";
  import GenericEventCard from "src/dapps/o-notifications/atoms/GenericEventCard.svelte";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let unreadInbox = new MyInbox(SortOrder.Desc, 250, [
    EventType.CrcHubTransfer,
    EventType.CrcMinting,
    EventType.CrcTrust,
    EventType.InvitationRedeemed,
    EventType.Erc20Transfer
  ], {
    unreadOnly: true
  });

  let readInbox = new MyInbox(SortOrder.Desc, 20, [
    EventType.CrcHubTransfer,
    EventType.CrcMinting,
    EventType.CrcTrust,
    EventType.InvitationRedeemed,
    EventType.Erc20Transfer
  ], {
    readOnly: true
  });

  const views = {
    [EventType.CrcHubTransfer]: { component: TransactionCard },
    [EventType.CrcMinting]: { component: TransactionCard },
    [EventType.CrcTrust]: { component: GenericEventCard },
    [EventType.InvitationRedeemed]: {component: RedeemedInvitationCard},
    [EventType.Erc20Transfer]: { component: TransactionCard }
  };

</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<div class="bg-notifications" style="visibility: hidden"></div>
<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  <EventList
          store="{unreadInbox}"
          views="{views}" />
  <EventList
          store="{readInbox}"
          views="{views}" />
</div>
