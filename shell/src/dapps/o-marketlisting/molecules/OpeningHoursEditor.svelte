<script lang="ts">
import { OpeningHourWeek } from "../models/openingHourWeek";
import OpeningHoursDayEditor from "./OpeningHoursDayEditor.svelte";
import {createEventDispatcher} from "svelte";

export let week: OpeningHourWeek = new OpeningHourWeek();
</script>

<div class="flex flex-col">
  <div>
    {#each week.asArray as day}
      <OpeningHoursDayEditor on:change openingHoursDay={day}  />
    {/each}
  </div>
</div>
