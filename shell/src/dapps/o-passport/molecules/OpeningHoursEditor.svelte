<script lang="ts">
    import {OpeningHourWeek} from "../models/openingHourWeek";
    import OpeningHoursDayEditor from "./OpeningHoursDayEditor.svelte";

    export let week: OpeningHourWeek = new OpeningHourWeek();

    function validate() {

    }
</script>
<div class="flex flex-col">
    <div>
        {#each week.asArray as day}
            <OpeningHoursDayEditor openingHoursDay={day} />
        {/each}
    </div>
</div>