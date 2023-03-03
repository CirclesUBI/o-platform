<script lang="ts">
import Icons from "../../../shared/molecules/Icons.svelte";
import Label from "../../../shared/atoms/Label.svelte";
import OpeningHoursWindowEditor, { ValidationEventData } from "./OpeningHoursWindowEditor.svelte";
import { OpeningHourDay } from "../models/openingHourDay";
import { OpeningHourWindow } from "../models/openingHourWindow";
import { HourAndMinute } from "../models/hourAndMinute";
import { generateUID } from "../../../shared/functions/generateRandomUid";
import { _ } from "svelte-i18n";
import { createEventDispatcher } from "svelte";

export let openingHoursDay: OpeningHourDay = new OpeningHourDay("monday");

const eventDispatcher = createEventDispatcher();
let editElementId: string;

function addWindow() {
  openingHoursDay.windows.push({
    id: generateUID(),
    isEmpty: true,
    isPersisted: false,
    from: new HourAndMinute(5, 0),
    to: new HourAndMinute(17, 0),
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

function commitDay(validationEventData: ValidationEventData, onlyValidate?: boolean) {
  const validationCopy: OpeningHourWindow[] = openingHoursDay.windows.map((o) => {
    return {
      ...o,
      from: new HourAndMinute(o.from.hour, o.from.minute),
      to: new HourAndMinute(o.to.hour, o.to.minute),
    };
  });
  sortWindowsByStartMinute(validationCopy);

  function commit() {
    validationEventData.resultCallback.commit();
    if (!onlyValidate) {
      sortWindowsByStartMinute(openingHoursDay.windows);
      openingHoursDay = openingHoursDay;
      eventDispatcher("change", openingHoursDay);
    }
  }

  if (validationCopy.length == 0) {
    // It's the only element
    commit();
    return true;
  }

  const firstElement = validationCopy[0];
  if (validationEventData.toMinute <= firstElement.from.minutes && validationEventData.toMinute != validationEventData.fromMinute) {
    // Ends before the first element starts
    commit();
    return true;
  }

  const lastElement = validationCopy[validationCopy.length - 1];
  if (validationEventData.fromMinute >= lastElement.to.minutes && validationEventData.toMinute != validationEventData.fromMinute) {
    // Starts after the last element ends
    commit();
    return true;
  }

  // Check if the new element conflicts with any other element
  let cancelled: boolean;
  const isValid = validationCopy.reduce((p, c) => {
    // If one condition failed, it stays 'invalid'
    if (!p) {
      return false;
    }

    // Elements can not start and end at the same time
    if (validationEventData.toMinute == validationEventData.fromMinute) {
      validationEventData.resultCallback.cancel($_("dapps.o-passport.molecules.openingHoursDayEditor.durationIsZero"));
      return false;
    }

    // Elements cannot contain other elements
    if (validationEventData.id != c.id && validationEventData.fromMinute < c.from.minutes && validationEventData.toMinute > c.to.minutes) {
      validationEventData.resultCallback.cancel($_("dapps.o-passport.molecules.openingHoursDayEditor.elementConflict"));
      return false;
    }

    // Elements cannot intersect with other elements
    const endIntersects = validationEventData.id != c.id && validationEventData.toMinute >= c.from.minutes && validationEventData.toMinute <= c.to.minutes;
    const beginIntersects = validationEventData.id != c.id && validationEventData.fromMinute >= c.from.minutes && validationEventData.fromMinute <= c.to.minutes;

    if (beginIntersects || endIntersects) {
      validationEventData.resultCallback.cancel($_("dapps.o-passport.molecules.openingHoursDayEditor.elementConflict"));
      return false;
    }

    return true;
  }, true);

  if (!isValid) {
    return false;
  } else {
    commit();
    return true;
  }
}
let randomId: string = generateUID();
</script>

<div class="flex flex-col">
  <div class="one">
    <input
      id="{randomId}"
      type="checkbox"
      class="mr-2 checkbox checkbox-warning"
      bind:checked="{openingHoursDay.isOpen}"
      on:change="{() => {
        if (!openingHoursDay.windows.length) {
          addWindow();
        }
        openingHoursDay = openingHoursDay;
        eventDispatcher('change', openingHoursDay);
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
              on:beginEdit="{(e) => {
                if (editElementId && editElementId !== e.detail.id) {
                  // Close the currently open editor
                  console.log(`TODO: Close existing editor first`);
                }
                editElementId = e.detail.id;
              }}"
              on:cancel="{(e) => {
                if (e.detail.isNew) {
                  const i = openingHoursDay.windows.indexOf(openingHourWindow);
                  openingHoursDay.windows.splice(i, 1);
                  if (openingHoursDay.windows.length === 0) {
                    openingHoursDay.isOpen = false;
                  }
                  openingHoursDay = openingHoursDay;
                }
                editElementId = undefined;
              }}"
              on:delete="{() => deleteWindow(openingHourWindow)}"
              on:validate="{(e) => {
                commitDay(e.detail, true);
              }}"
              on:ok="{(e) => {
                const isValid = commitDay(e.detail);
                if (isValid) {
                  editElementId = undefined;
                }
              }}" />
          {/each}
        {/if}
      </table>
    </td>
  </tr>
  {#if openingHoursDay.isOpen && !editElementId}
    <tr align="right">
      <span role="presentation" on:click="{() => addWindow()}">
        <Icons customClass="inline w-6 h-6 heroicon smallicon" icon="plus-circle" />
      </span>
    </tr>
  {/if}
</table>
