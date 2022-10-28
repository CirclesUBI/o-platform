<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import {onMount} from "svelte";
import {ProfileEvent} from "../../../shared/api/data/types";
import { _ } from "svelte-i18n";
import Label from "../../../shared/atoms/Label.svelte";
import NotificationCard from "./../atoms/NotificationCard.svelte"
import { inbox } from "../../../shared/stores/inbox";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let displyEvents:ProfileEvent[];

onMount(() => {
  inbox.subscribe(e => {
    displyEvents = e;
  })
});

</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  {#if !displyEvents}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading notifications</div>
        </div>
      </div>
    </section>
  {:else}
    <!-- TODO: Possible actions: trust, transfer money -->
    {#each displyEvents as event}
      <NotificationCard event={event} />
    {/each}
    {#if displyEvents.length === 0}
      <section class="flex items-center justify-center mb-2 ">
        <div class="flex items-center w-full p-4 space-x-2 bg-white rounded-lg shadow">
          <div class="flex flex-col items-start text-center">
            <div>No entries</div>
          </div>
        </div>
      </section>
    {/if}
  {/if}
</div>
