<script lang="ts">
import Select from "../../../shell/src/shared/molecules/Select/Select.svelte";
import ProcessNavigation from "./ProcessNavigation.svelte";
import { EditorContext } from "./editorContext";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { onMount } from "svelte";
import Item from "./DropdownSelectItem.svelte";
import { normalizePromptField, PromptField } from "@o-platform/o-process/dist/states/prompt";
import AutoComplete from "simple-svelte-autocomplete";
import { findGoogleLocation, getGeoDataFromHereId } from "../../../shell/src/shared/functions/locationHandler";
/*
 * allow arbitrary values in dropdownselecteditor
 * allow to add new tags in dropdownselecteditor
 * add a "most-recent" list to the dropdownselecteditor
 */

// export let context: EditorContext;

$: selected = {};

let inputField: any;
let _context: EditorContext;
let field: PromptField<any>;
let filterText: string;

// $: {
//   _context = context;
// }

// onMount(async () => {
//   console.log("SELECTED: ", context.data);
// });

function onPlaceChanged(e) {
  // getGeoDataFromHereId(e.id);
  // if (e.detail) {
  //   // location = e.detail;
  //   // business.location = JSON.stringify(location);
  // }
}

function submitHandler() {
  // const event = new Continue();
  // event.data = {};
  // event.data[field.name] = context.params.getKey(selected);
  // context.data[field.name] = context.params.getKey(selected);
  // context.process.sendAnswer(event);
}
</script>

<div class="flex flex-col items-end w-full m-auto form-control justify-self-center sm:w-3/4">
  <AutoComplete
    inputClassName="select input w-full"
    selectName="text-primary"
    searchFunction="{findGoogleLocation}"
    delay="200"
    localFiltering="{false}"
    labelFieldName="title"
    valueFieldName="id"
    hideArrow="{true}"
    onChange="{onPlaceChanged}"
    bind:selectedItem="{selected}">
    <div slot="item" let:item let:label class="text-sm text-base bg-transparent selection:bg-transparent">
      <section class="flex items-center justify-center mb-4 mr-1 border rounded-lg customItem ">
        <div class="flex items-center w-full p-0 space-x-2 sm:space-x-6 item-body ">
          <div class="relative flex-grow p-3 text-left ">
            <div class="max-w-full -mt-1 leading-8 cursor-pointer ">
              {@html label}
            </div>
          </div>
        </div>
      </section>
    </div>

    <div slot="no-results" let:noResultsText>
      <strong>NO RESULTS - {noResultsText}</strong>
    </div>
  </AutoComplete>
  <!-- 
  {#if context.messages[context.field]}
    <label class="text-right label" for="form-error">
      <span id="form-error" class="label-text-alt text-error">{context.messages[context.field]}</span>
    </label>
  {/if} -->

  <!-- <ProcessNavigation on:buttonClick="{submitHandler}" context="{context}" /> -->
</div>

<style>
:global(.autocomplete-list-item) {
  padding: 0.5rem !important;
  width: 100%;
  height: auto;
}
:global(.autocomplete-list-item.selected) {
  background-color: #fff !important;
  color: #ffcc33;
}
.customItem {
  display: flex;
  align-items: center;
  cursor: default;
  padding: 0;
  overflow: hidden;
  @apply bg-white;
  @apply border-light;
}
:global(.autocomplete-list-item.selected .customItem) {
  @apply border-primary;
}
</style>
