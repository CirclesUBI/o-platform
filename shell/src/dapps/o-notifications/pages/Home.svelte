<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import {onMount} from "svelte";
import {EventType, ProfileEvent} from "../../../shared/api/data/types";
import { _ } from "svelte-i18n";
import { inbox } from "../../../shared/stores/inbox";
import EventList from "../../../shared/molecules/Lists/EventList.svelte";
import GenericEventCard from "../../../shared/NotificationViewer/molecules/GenericEventCard.svelte";
import TransactionCard from "../../o-banking/atoms/TransactionCard.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let displyEvents:ProfileEvent[];

onMount(() => {
  inbox.subscribe(e => {
    console.log(e);
  })
});

</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  <EventList
  store="{inbox}"
  views="{{
    [EventType.CrcHubTransfer]: { component: TransactionCard },
    [EventType.CrcMinting]: { component: TransactionCard },
    [EventType.CrcTrust]: { component: GenericEventCard }
  }}" />
</div>
