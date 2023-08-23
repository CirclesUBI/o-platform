<script lang="ts">
import { onMount, afterUpdate } from "svelte";

import { EditorContext } from "./editorContext";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { DropdownSelectorContext } from "./DropdownSelectEditorContext";
import ProcessNavigation from "./ProcessNavigation.svelte";
import { Observable } from "rxjs";
import Icons from "@o-platform/shell/src/shared/molecules/Icons.svelte";
import { normalizePromptField, PromptField } from "@o-platform/o-process/dist/states/prompt";
import { Profile, SafeInfo } from "@o-platform/shell/src/shared/api/data/types";
import BeerItem from "./BeerItem.svelte";
export let context: DropdownSelectorContext<any, any, any>;
import { _ } from "@o-platform/shell/src/i18n/i18nDictionary";
import { log } from "xstate/lib/actions";

let filteredCountries = [];

let _context: EditorContext;
let showSafeAddressInput: boolean = false;
let buttonDisabled = "disabled";
let inputValue = undefined;
let searchInput; // use with bind:this to focus element
$: {
  _context = context;
}
let fieldId = context.isSensitive ? Math.random().toString().replace(".", "") : context.field;
const filterCountries = async () => {
  let storageArr = [];
  if (inputValue) {
    const evaluatedLoadOptions = context.params.choices.find(inputValue, context);

    // countries.forEach(country => {
    // 	 if (country.toLowerCase().startsWith(inputValue.toLowerCase())) {
    // 		 storageArr = [...storageArr, makeMatchBold(country)];
    // 	 }
    // });

    return new Promise((resolve) => {
      const observable: Observable<Profile[]> = <Observable<Profile[]>>evaluatedLoadOptions;
      observable.subscribe((next) => {
        if (!next) {
          resolve(null);
        } else {
          storageArr = [...next];
          console.log("ARRAY", storageArr);
          filteredCountries = storageArr;
          // dispatch("loaded", { storageArr });
        }
      });
    });
  }
};

$: filterCountries();
function toggleInputView() {
  showSafeAddressInput = !showSafeAddressInput;
}

function focus(node) {
  const update = () => {
    const item = node.querySelector(".focused-item");
    console.log("DER ITEM", item);
    if (item) item.scrollIntoView({ block: "center" });
  };

  update();

  return { update };
}
</script>

<svelte:window />

<div id="dropdownResults" class="flex flex-col overflow-auto items">
  {#if filteredCountries.length > 0}
    <section use:focus>
      {#each filteredCountries as item, i}
        <div class:focused-item="{i === filteredCountries.length - 1}"><BeerItem item="{item}" /></div>
      {/each}
    </section>
  {/if}
</div>

<form autocomplete="off">
  <div
    class="sticky bottom-0 left-0 flex flex-row order-1 w-full space-x-4 bg-white"
    style="height: 70px; z-index: 99999999; box-shadow: 2px 2px 1px 10px
      rgba(255, 255, 255, 1);">
    <div class="flex-grow autocomplete">
      <input
        id="dropdown-input"
        type="text"
        class="flex-grow h-12 min-w-0 dropdown-editor-input input input-lg input-bordered"
        placeholder="Search "
        bind:this="{searchInput}"
        bind:value="{inputValue}"
        on:input="{filterCountries}" />
    </div>

    <div>
      <button
        type="submit"
        on:click="{() => {
          // dispatch('buttonClick');
        }}"
        class="btn btn-primary btn-square">
        <Icons icon="submitsmall" />
      </button>
    </div>
  </div>

  <!-- FILTERED LIST OF COUNTRIES -->

  <!-- <div class="flex flex-row items-center form-control justify-self-center">
    <div class="autocomplete">
      <input
        id="dropdown-input"
        type="text"
        class="order-1 input input-lg input-bordered"
        placeholder="Search Country Names"
        bind:this="{searchInput}"
        bind:value="{inputValue}"
        on:input="{filterCountries}" />
    </div>

    <div>
      <button type="submit" class="btn btn-primary btn-square">
        <Icons icon="submitsmall" />
      </button>
    </div>
  </div> -->
</form>
<div class="sticky text-xs text-right cursor-pointer text-primary left-16" style="z-index: 999999999999; right: 5.5rem; bottom: 0.2rem;" role="presentation" on:click="{toggleInputView}">
  {showSafeAddressInput ? $_("dapps.o-banking.transfer.clickToSearchProfile") : $_("dapps.o-banking.transfer.clickToEnterSafeAddress")}
</div>

<style>
div.autocomplete {
  /*the container must be positioned relative:*/
  position: relative;
  display: inline-block;
  width: 300px;
}
input {
  border: 1px solid transparent;
  background-color: #f1f1f1;
  padding: 10px;
  font-size: 16px;
  margin: 0;
}
input[type="text"] {
  background-color: #f1f1f1;
  width: 100%;
}
input[type="submit"] {
  background-color: DodgerBlue;
  color: #fff;
}

#autocomplete-items-list {
  position: relative;
  margin: 0;
  padding: 0;
  top: 0;
  width: 297px;
  border: 1px solid #ddd;
  background-color: #ddd;
}
</style>
