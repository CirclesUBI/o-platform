<script lang="ts">
import Select from "../../../shell/src/shared/molecules/Select/Select.svelte";
import ProcessNavigation from "./ProcessNavigation.svelte";
import { EditorContext } from "./editorContext";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { onMount } from "svelte";
import Item from "./DropdownSelectItem.svelte";
import { normalizePromptField, PromptField } from "@o-platform/o-process/dist/states/prompt";
import { DropdownSelectorContext } from "./DropdownSelectEditorContext";
import { _ } from "@o-platform/shell/src/i18n/i18nDictionary";
import Error from "@o-platform/shell/src/shared/atoms/Error.svelte";
import { Profile } from "@o-platform/shell/src/shared/api/data/types";
import { me } from "@o-platform/shell/src/shared/stores/me";

/*
 * allow arbitrary values in dropdownselecteditor
 * allow to add new tags in dropdownselecteditor
 * add a "most-recent" list to the dropdownselecteditor
 */

export let context: DropdownSelectorContext<any, any, any>;

$: selected = {};

let inputField: any;
let _context: EditorContext;
let selectComponent: Select;
let field: PromptField<any>;
let filterText: string;
let showSafeAddressInput: boolean = false;
let fieldId = context.isSensitive ? Math.random().toString().replace(".", "") : context.field;
let errorMessage = "";

$: {
  _context = context;
}

onMount(async () => {
  let $me: Profile | null = null;

  const unsub = me.subscribe((o) => {
    $me = o;
  });
  unsub();
  if (!$me) throw new Error($_("shared.userActions.errors.couldNotLoadYourProfile"));

  field = normalizePromptField(context.field);
  const currentKey = field.get(context);

  if (currentKey) {
    selected = await context.params.choices.byKey(currentKey, context);
  } else {
    selected = undefined;
    if (context.params.showResultsOnLoad) {
      filterText = "0x";
      setTimeout(() => {
        filterText = "";
        selectComponent.getItems();
      }, 1);
    }
  }
  console.log("CONTEXT: ", context);
});

function handleSelect(event) {
  selected = event.detail;
  context.editorDirtyFlags[field.name] = true;
  if (context.params.submitOnBlur) {
    onBlur(event);
  }
}

export function handleClear() {
  selected = undefined;
  context.editorDirtyFlags[field.name] = true;
  if (context.params.submitOnBlur) {
    onBlur(event);
  }
}

function submitHandler() {
  if (context?.data?.safeAddress === context?.params.getKey(selected)) {
    errorMessage = $_("dapps.common.cannotSendToYourself");
  } else {
    errorMessage = "";
    const event = new Continue();
    event.data = {};
    event.data[field.name] = context.params.getKey(selected);
    context.data[field.name] = context.params.getKey(selected);
    context.process?.sendAnswer(event);
  }
}

const submitSafeAddressInput = () => {
  if (context.data?.recipientAddress === context.data?.safeAddress) {
    errorMessage = $_("dapps.common.cannotSendToYourself");
  } else {
    errorMessage = "";
    const answer = new Continue();
    answer.data = context.data;
    context.process?.sendAnswer(answer);
  }
};

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter" && selected) {
    submitHandler();
  }
}

function onBlur(e) {
  if (context.params.submitOnBlur) {
    console.log("onBlur");
    submitHandler();
  }
}

function toggleInputView() {
  showSafeAddressInput = !showSafeAddressInput;
}
</script>

{#if field}
  <div class="flex flex-col items-end form-control justify-self-center">
    {#if context.messages[context.field]}
      <Error message="{context.messages[context.field]}" />
    {/if}
    {#if errorMessage}
      <div class="mt-2 mb-2 alert alert-error">
        <div class="flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
          </svg>
          <label for="input">{errorMessage} </label>
        </div>
      </div>
    {/if}
    <div class="h-12 text-base themed">
      {#if showSafeAddressInput}
        <div class="flex flex-row items-start space-x-4 form-control justify-self-center" style="margin-bottom: 1.4rem;">
          <input
            on:keydown="{onkeydown}"
            id="{fieldId}"
            name="{fieldId}"
            autocomplete="{fieldId}"
            type="text"
            placeholder="Enter Safe Address"
            class="flex-grow h-12 min-w-0 input input-lg input-bordered"
            class:input-error="{context.messages[context.field]}"
            bind:value="{_context.data[context.field]}"
            on:focus
            on:blur
            on:change="{() => {
              context.editorDirtyFlags[context.field] = true;
            }}" />
          <div>
            <ProcessNavigation on:buttonClick="{submitSafeAddressInput}" context="{context}" type="small" />
          </div>
        </div>
      {:else}
        <Select
          name="searchTerm"
          autoComplete="off"
          isFocused="{false}"
          selectedValue="{selected}"
          loadOptions="{(searchString) => context.params.choices.find(searchString, context)}"
          noOptionsMessage=""
          placeholder="Search..."
          listAutoWidth="{false}"
          getHighlight="{context.params.getHighlight}"
          inlineSubmit="{context.params.showNavigation === undefined ? true : context.params.showNavigation}"
          isCreatable="{false}"
          listPlacement="top"
          scrollContainer="{document.getElementById('modalScrollable')}"
          containerClasses="min-w-full asyncList  max-w-xs"
          on:clear="{handleClear}"
          optionIdentifier="{context.params.keyProperty}"
          getSelectionLabel="{context.params.getLabel}"
          getOptionLabel="{context.params.getLabel}"
          Item="{context.params.itemTemplate ? context.params.itemTemplate : Item}"
          on:select="{handleSelect}"
          on:blur="{onBlur}"
          bind:this="{selectComponent}"
          bind:filterText="{filterText}"
          on:buttonClick="{submitHandler}" />
      {/if}
      {#if context.params.allowAlternativeInput}
        <div
          class="sticky text-xs text-right cursor-pointer text-primary left-16"
          style="z-index: 999999999999; right: 5.5rem; bottom: 0.2rem;"
          role="presentation"
          on:click="{toggleInputView}">
          {showSafeAddressInput ? $_("dapps.o-banking.transfer.clickToSearchProfile") : $_("dapps.o-banking.transfer.clickToEnterSafeAddress")}
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- <ProcessNavigation on:buttonClick={submitHandler} {context} type="small" /> -->
<style>
.themed {
  width: 100%;
  padding: 0 !important;
  --listMaxHeight: 19rem;
  --listBackground: transparent;
  --listShadow: none;
  --borderRadius: var(--rounded-btn, 0.5rem);
  --border: 1px solid hsla(var(--bc, 215 28% 17%) / var(--tw-border-opacity));
  --height: auto;
  --inputTop: 3px;
  --inputFontSize: 18px;
  --inputPadding: 0.5rem 0.5rem 0.5rem 1rem;
  --itemHoverBG: "#cccccc";
  --clearSelectTop: 3.25rem;
  --clearSelectHeight: 2.5rem;
  --clearSelectRight: 4.5rem;
  height: auto;
}
</style>
