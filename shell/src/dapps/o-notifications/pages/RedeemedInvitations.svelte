<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import {EventType, SortOrder} from "../../../shared/api/data/types";
import {MyInbox} from "../../../shared/stores/inbox";
import EventList from "../../../shared/molecules/Lists/EventList.svelte";
import RedeemedInvitationCard from "../atoms/RedeemedInvitationCard.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let inbox = new MyInbox(SortOrder.Desc, 20, [
  EventType.InvitationRedeemed
]);
</script>
<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<div class="bg-notifications" style="visibility: hidden"></div>
<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  <h1>Invitations</h1>
  <EventList
  store="{inbox}"
  views="{{
    [EventType.InvitationRedeemed]: {component: RedeemedInvitationCard},
  }}" />
</div>
