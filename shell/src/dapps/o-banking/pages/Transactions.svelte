<script lang="ts">
import BankingHeader from "../atoms/BankingHeader.svelte";

import TransactionCard from "../atoms/TransactionCard.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { EventType, SortOrder } from "../../../shared/api/data/types";

import EventList from "../../../shared/molecules/Lists/EventList.svelte";
import { MyInbox } from "../../../shared/stores/inbox";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let transactions = new MyInbox(SortOrder.Desc, 20, [EventType.CrcHubTransfer, EventType.CrcMinting, EventType.Erc20Transfer]);
</script>

<BankingHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mt-8 mb-20 md:w-2/3 xl:w-1/2">
  <EventList
    store="{transactions}"
    views="{{
      [EventType.CrcHubTransfer]: { component: TransactionCard },
      [EventType.CrcMinting]: { component: TransactionCard },
      [EventType.Erc20Transfer]: { component: TransactionCard },
    }}" />
</div>
