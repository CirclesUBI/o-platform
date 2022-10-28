<script lang="ts">
import { ProfileEvent } from "../../api/data/types";
import { onMount } from "svelte";
import ItemCard from "../../atoms/ItemCard.svelte";
import Date from "../../atoms/Date.svelte";

export let event: ProfileEvent;
</script>

<div>
  <!--<pre>{JSON.stringify(event, null, 2)}</pre>-->
  <ItemCard
    params="{{
      edgeless: false,
      title: event.type,
      subTitle: window.o.i18n("shared.molecules.notificationViewer.molecules.genericEventCard.subTitle"),
      noTruncate: true,
    }}">
    <div slot="itemCardEnd">
      <div class="self-end text-right">
        <span> </span>
      </div>
      <div class="self-end text-xs text-dark-lightest whitespace-nowrap">
        {#if event.timestamp}
          <Date time="{event.timestamp}" />
        {/if}
      </div>
    </div>
  </ItemCard>
</div>
