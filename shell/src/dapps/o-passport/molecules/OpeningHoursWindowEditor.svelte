<script context="module" lang="ts">
export interface ValidationEventData {
  id: string;
  fromMinute: number;
  toMinute: number;
  resultCallback: ValidationResultCallback;
}

export interface ValidationResultCallback {
  cancel(message: string): void;
  commit(): void;
}
</script>

<script lang="ts">
import Icons from "../../../shared/molecules/Icons.svelte";
import { createEventDispatcher, onMount } from "svelte";
import { OpeningHourWindow } from "../models/openingHourWindow";
import { HourAndMinute } from "../models/hourAndMinute";
import {_} from "svelte-i18n";

export let isValid: boolean = true;
export let openingHourWindow: OpeningHourWindow = {
  id: Math.random().toString(),
  isEmpty: true,
  isPersisted: false,
  from: new HourAndMinute(),
  to: new HourAndMinute(),
};

let isEditing: boolean = false;
let fromEditorInput: HTMLInputElement;
let toEditorInput: HTMLInputElement;

let editFromValue: string = "00:00";
let editToValue: string = "23:59";

let message: string;

const eventDispatcher = createEventDispatcher();

onMount(() => {
  if (openingHourWindow.isEmpty) {
    edit();
  }
});

function padZero(value: number): string {
  return value.toString().padStart(2, "0");
}

function parseTime(timeString: string): HourAndMinute | null {
  let isValid = timeString.indexOf(":") > 0;
  if (!isValid) return null;

  const valueSplit = timeString.split(":");
  isValid = valueSplit.length == 2;
  if (!isValid) return null;

  const parsedHour = parseInt(valueSplit[0]);
  const parsedMinute = parseInt(valueSplit[1]);
  isValid = parsedHour != Number.NaN && parsedMinute != Number.NaN;
  if (!isValid) return null;

  isValid = parsedHour >= 0 && parsedMinute >= 0 && parsedHour <= 23 && parsedMinute <= 59;
  if (!isValid) return null;

  return new HourAndMinute(parsedHour, parsedMinute);
}

function validate() {
  const from = parseTime(editFromValue);
  isValid = from != null;
  if (!isValid) {
    message = $_("dapps.o-passport.molecules.openingHoursDayEditor.fromValueFormatError");
    return
  }

  const to = parseTime(editToValue);
  isValid = to != null;
  if (!isValid) {
    message = $_("dapps.o-passport.molecules.openingHoursDayEditor.toValueFormatError");
    return
  }

  isValid = to.hour * 60 + to.minute > from.hour * 60 + from.minute;
  if (!isValid) {
    message = "The time-window ends before it starts";
    return;
  }

  isValid = from.minutes != to.minutes;
  if (!isValid) {
    message = $_("dapps.o-passport.molecules.openingHoursDayEditor.durationIsZero");
    return;
  }

  eventDispatcher("validate", <ValidationEventData>{
    id: openingHourWindow.id,
    fromMinute: from.hour * 60 + from.minute,
    toMinute: to.hour * 60 + to.minute,
    resultCallback: {
      commit: () => isValid = true,
      cancel: (msg) => {
        isValid = false;
        message = msg;
        console.log("invalid:", msg);
      },
    },
  });
}

function edit(focusRightInsteadOfLeftField?: boolean) {
  if (isEditing) {
    return;
  }

  eventDispatcher("beginEdit", {id: openingHourWindow.id});

  editFromValue = `${padZero(openingHourWindow.from.hour)}:${padZero(openingHourWindow.from.minute)}`;
  editToValue = `${padZero(openingHourWindow.to.hour)}:${padZero(openingHourWindow.to.minute)}`;

  isEditing = true;

  setTimeout(() => {
    console.log("focusRightInsteadOfLeftField", focusRightInsteadOfLeftField);
    if (focusRightInsteadOfLeftField) {
      toEditorInput?.focus();
    } else {
      fromEditorInput?.focus();
    }
  });
}

function cancel() {
  isEditing = false;
  eventDispatcher("cancel", {
    isNew: !openingHourWindow.isPersisted
  });
}

function ok() {
  if (!isValid) return;

  const from = parseTime(editFromValue);
  const to = parseTime(editToValue);

  eventDispatcher("ok", <ValidationEventData>{
    id: openingHourWindow.id,
    fromMinute: from.hour * 60 + from.minute,
    toMinute: to.hour * 60 + to.minute,
    resultCallback: {
      commit: commit,
      cancel: (msg) => {
        isValid = false;
        message = msg;
      },
    },
  });
}

function commit() {
  isEditing = false;

  openingHourWindow.isPersisted = true;
  openingHourWindow.from = parseTime(editFromValue);
  openingHourWindow.to = parseTime(editToValue);
  openingHourWindow.isEmpty = false;
}
</script>

{#if isEditing}
  <tr>
    <td>
      <input
              bind:this="{fromEditorInput}"
              type="time"
              class="text-xs input input-sm"
              bind:value="{editFromValue}"
              on:change="{validate}" />
    </td>
    <td> &nbsp;-&nbsp; </td>
    <td>
      <input bind:this="{toEditorInput}"
             type="time"
             class="text-xs input input-sm"
             bind:value="{editToValue}"
             on:change="{validate}" />
    </td>
  </tr>
  {#if !isValid}
    <tr>
      <td colspan="3" class="ml-2 text-error">
        <Icons customClass="inline text-red-300 w-6 h-6 heroicon smallicon" icon="exclamation-circle" />
        {message}
      </td>
    </tr>
  {/if}
  <tr>
    <td colspan="3" align="right">
      <input type="button"
             class="btn btn-primary"
             class:btn-disabled={!isValid}
             value="Save"
             on:click={ok} />
      <input type="button"
             class="btn btn-secondary"
             value="Cancel"
             on:click={cancel} />
    </td>
  </tr>
{:else}
  <tr class="cursor-pointer">
    <td role="presentation" on:click="{() => edit(false)}">
      <div>{padZero(openingHourWindow.from.hour)}:{padZero(openingHourWindow.from.minute)}</div>
    </td>
    <td on:click="{edit}"> &nbsp;-&nbsp; </td>
    <td role="presentation" on:click="{() => edit(true)}">
      <div>{padZero(openingHourWindow.to.hour)}:{padZero(openingHourWindow.to.minute)}</div>
    </td>
  </tr>
{/if}