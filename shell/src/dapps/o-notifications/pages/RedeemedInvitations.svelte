<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { EventType, SortOrder } from "../../../shared/api/data/types";
import { MyInbox } from "../../../shared/stores/inbox";
import EventList from "../../../shared/molecules/Lists/EventList.svelte";
import RedeemedInvitationCard from "../atoms/RedeemedInvitationCard.svelte";
import { _ } from "svelte-i18n";

export let runtimeDapp: RuntimeDapp<any>;

let inbox = new MyInbox(SortOrder.Desc, 20, [EventType.InvitationRedeemed]);
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" />
<div class="bg-notifications" style="visibility: hidden"></div>
<div class="px-4 mx-auto mt-5 mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  <h1>{$_("dapps.o-notifications.pages.redeemedInvitations.invitations")}</h1>
  <EventList
    store="{inbox}"
    views="{{
      [EventType.InvitationRedeemed]: { component: RedeemedInvitationCard },
    }}" />
</div>
