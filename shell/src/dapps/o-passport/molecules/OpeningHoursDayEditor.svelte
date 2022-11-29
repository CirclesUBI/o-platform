<script lang="ts">
import Icons from "../../../shared/molecules/Icons.svelte";
import Label from "../../../shared/atoms/Label.svelte";
import OpeningHoursWindowEditor, { ValidationEventData } from "./OpeningHoursWindowEditor.svelte";
import { OpeningHourDay } from "../models/openingHourDay";
import { OpeningHourWindow } from "../models/openingHourWindow";
import { HourAndMinute } from "../models/hourAndMinute";
import generateRandomUid from "../../../shared/functions/generateRandomUid";

export let openingHoursDay: OpeningHourDay = new OpeningHourDay("monday");

function addWindow() {
  openingHoursDay.windows.push({
    isEmpty: true,
    from: new HourAndMinute(),
    to: new HourAndMinute(),
  });
  openingHoursDay = openingHoursDay;
}

function deleteWindow(openingHourWindow: OpeningHourWindow) {
  openingHoursDay.windows.splice(openingHoursDay.windows.indexOf(openingHourWindow), 1);
  openingHoursDay = openingHoursDay;

  openingHoursDay.isOpen = openingHoursDay.windows.length > 0;
}

function sortWindowsByStartMinute(windows: OpeningHourWindow[]) {
  return windows.sort((a, b) => {
    const aMinutes = a.from.hour * 60 + a.from.minute;
    const bMinutes = b.from.hour * 60 + b.from.minute;
    return aMinutes > bMinutes ? 1 : aMinutes < bMinutes ? -1 : 0;
  });
}

function validateDay(validationEventData: ValidationEventData) {
  const validationCopy = openingHoursDay.windows.filter(
    (o) =>
      !o.isEmpty && validationEventData.fromMinute !== o.from.minutes && validationEventData.toMinute !== o.to.minutes
  );
  sortWindowsByStartMinute(validationCopy);

  function commit() {
    validationEventData.resultCallback.commit();
    sortWindowsByStartMinute(openingHoursDay.windows);
    openingHoursDay = openingHoursDay;
  }

  if (validationCopy.length == 0) {
    // It's the only element
    commit();
    return;
  }

  const firstElement = validationCopy[0];
  if (validationEventData.toMinute < firstElement.from.minutes) {
    // Ends before the first element starts
    commit();
    return;
  }

  const lastElement = validationCopy[validationCopy.length - 1];
  if (validationEventData.fromMinute > lastElement.to.minutes) {
    // Starts after the last element ends
    commit();
    return;
  }

  // Check if the new element conflicts with any other element
  const isValid = validationCopy.reduce((p, c) => {
    // If one condition failed, it stays 'invalid'
    if (!p) return false;

    // Elements cannot contain other elements
    if (validationEventData.fromMinute < c.from.minutes && validationEventData.toMinute > c.to.minutes) {
      validationEventData.resultCallback.cancel("Contains another window");
      return false;
    }

    // Elements cannot intersect with other elements
    const beginIntersects =
      validationEventData.fromMinute >= c.from.minutes && validationEventData.fromMinute <= c.to.minutes;
    const endIntersects =
      validationEventData.toMinute >= c.from.minutes && validationEventData.toMinute <= c.to.minutes;

    if (beginIntersects || endIntersects) {
      validationEventData.resultCallback.cancel("Intersects with another window");
      return false;
    }

    return true;
  }, true);

  if (!isValid) {
    return;
  } else {
    commit();
  }
}
let randomId: string = generateRandomUid();
</script>

<div class="flex flex-col">
  <div class="one">
    <input
      id="{randomId}"
      type="checkbox"
      class="mr-2 checkbox checkbox-warning"
      bind:checked="{openingHoursDay.isOpen}"
      on:change="{(event) => {
        if (!openingHoursDay.windows.length) {
          addWindow();
        }
        openingHoursDay = openingHoursDay;
      }}" />
    <label for="{randomId}"><Label class="pl-2" key="common.{openingHoursDay.day}" /></label>
  </div>
</div>

<table class="table w-full table-compact">
  <tr>
    <td>
      <table>
        {#if openingHoursDay.isOpen}
          {#each openingHoursDay.windows as openingHourWindow}
            <OpeningHoursWindowEditor
              openingHourWindow="{openingHourWindow}"
              on:delete="{() => deleteWindow(openingHourWindow)}"
              on:ok="{(e) => validateDay(e.detail)}" />
          {/each}
        {/if}
      </table>
    </td>

    <td>
      {#if openingHoursDay.isOpen}
        <span role="presentation" on:click="{() => addWindow()}">
          <Icons customClass="inline w-6 h-6 heroicon smallicon" icon="plus-circle" />
        </span>
      {/if}
    </td>
  </tr>
</table>
