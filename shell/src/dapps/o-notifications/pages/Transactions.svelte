<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import { EventType, SortOrder } from "../../../shared/api/data/types";
import { MyInbox } from "../../../shared/stores/inbox";
import EventList from "../../../shared/molecules/Lists/EventList.svelte";
import TransactionCard from "../../o-banking/atoms/TransactionCard.svelte";
import { _ } from "svelte-i18n";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let inbox = new MyInbox(SortOrder.Desc, 20, [EventType.CrcHubTransfer, EventType.CrcMinting, EventType.Erc20Transfer]);
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<div class="bg-notifications" style="visibility: hidden"></div>
<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2 mt-5">
  <h1>{$_("dapps.o-notifications.pages.transactions.txs")}</h1>
  <EventList
    store="{inbox}"
    views="{{
      [EventType.CrcHubTransfer]: { component: TransactionCard },
      [EventType.CrcMinting]: { component: TransactionCard },
      [EventType.Erc20Transfer]: { component: TransactionCard },
    }}" />
</div>
