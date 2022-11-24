<script context="module" lang="ts">
  export interface ValidationEventData {
    fromMinute: number;
    toMinute: number;
    resultCallback: ValidationResultCallback;
  }

  export interface ValidationResultCallback {
    cancel(message: string): void
    commit(): void
  }
</script>
<script lang="ts">
  import Icons from "../../../shared/molecules/Icons.svelte";
  import {createEventDispatcher, onMount} from "svelte";
  import {OpeningHourWindow} from "../models/openingHourWindow";
  import {HourAndMinute} from "../models/hourAndMinute";

  export let isValid: boolean = true;
  export let openingHourWindow: OpeningHourWindow = {
    isEmpty: true,
    from: new HourAndMinute(),
    to: new HourAndMinute()
  };

  let isEditing: boolean = false;
  let fromEditorInput: HTMLInputElement;

  let editFromValue: string = "00:00";
  let editToValue: string = "23:59";

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
    if (!isValid) return;

    const to = parseTime(editToValue);
    isValid = to != null;
    if (!isValid) return;

    isValid = to.hour * 60 + to.minute > from.hour * 60 + from.minute;
    if (!isValid) return;
  }

  function edit() {
    if (isEditing) {
      return;
    }

    editFromValue = `${padZero(openingHourWindow.from.hour)}:${padZero(openingHourWindow.from.minute)}`;
    editToValue = `${padZero(openingHourWindow.to.hour)}:${padZero(openingHourWindow.to.minute)}`;

    isEditing = true;

    setTimeout(() => fromEditorInput?.focus());
  }

  function cancel() {
    isEditing = false;
  }

  function ok() {
    if (!isValid) return;

    const from = parseTime(editFromValue);
    const to = parseTime(editToValue);

    eventDispatcher("ok", <ValidationEventData>{
      fromMinute: from.hour * 60 + from.minute,
      toMinute: to.hour * 60 + to.minute,
      resultCallback: {
        commit: commit,
        cancel: (message) => {
          console.log(message)
        }
      }
    });
  }

  function commit() {
    isEditing = false;

    openingHourWindow.from = parseTime(editFromValue);
    openingHourWindow.to = parseTime(editToValue);
    openingHourWindow.isEmpty = false;
  }
</script>

<tr>
    {#if isEditing}
        <td>
            <input bind:this={fromEditorInput} type="time" bind:value={editFromValue} on:change={validate}
                   style="width: 6em;">
        </td>
        <td>
            &nbsp;-&nbsp;
        </td>
        <td>
            <input type="time" bind:value={editToValue} on:change={validate} style="width: 6em;">
        </td>
    {:else}
        <td role="presentation" on:click={edit}>
            <div>{padZero(openingHourWindow.from.hour)}:{padZero(openingHourWindow.from.minute)}</div>
        </td>
        <td>
            &nbsp;-&nbsp;
        </td>
        <td role="presentation" on:click={edit}>
            <div>{padZero(openingHourWindow.to.hour)}:{padZero(openingHourWindow.to.minute)}</div>
        </td>
    {/if}
    <td>
        {#if isEditing}
            <span role="presentation" on:click={() => cancel()}><Icons customClass="inline w-6 h-6 heroicon smallicon"
                                                                       icon="cancel"/></span>
            {#if isValid}
                <span role="presentation" on:click={() => ok()}><Icons
                        customClass="inline text-green-500 w-6 h-6 heroicon smallicon" icon="check"/></span>
            {:else}
                <span><Icons customClass="inline text-red-300 w-6 h-6 heroicon smallicon"
                             icon="exclamation-circle"/></span>
            {/if}
        {:else}
            <span role="presentation" on:click={() => edit()}><Icons customClass="inline w-6 h-6 heroicon smallicon"
                                                                     icon="pencil"/></span>
            <span role="presentation" on:click={() => eventDispatcher("delete")}><Icons
                    customClass="inline w-6 h-6 heroicon smallicon" icon="trash"/></span>
        {/if}
    </td>
</tr>