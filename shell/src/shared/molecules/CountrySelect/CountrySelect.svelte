<script lang="ts">
import { createEventDispatcher } from "svelte";
import type { DetailedValue, CountryCode, E164Number, CountrySelectEvents } from "svelte-tel-input/types";
import { TelInput, normalizedCountries } from "svelte-tel-input";
import { clickOutside } from "../../functions/clickOutside";
import "../../../../../node_modules/flag-icons/css/flag-icons.min.css";
import { isSelected } from "../../functions/isSelected";

export let searchText = "";
export let selectedCountry: CountryCode;
export let searchTextPlaceholder: string = "Search";
export let closeOnClick = true;
export let disabled = false;
export let detailedValue: DetailedValue | null = null;

$: selectedCountryDialCode = normalizedCountries.find((el) => el.iso2 === selectedCountry)?.dialCode || null;

let isOpen = false;

$: isValid = detailedValue?.isValid ?? false;

const toggleDropDown = (e: Event) => {
  e.preventDefault();
  isOpen = !isOpen;
};

const closeDropdown = (e?: Event) => {
  e?.preventDefault();
  isOpen = false;
  searchText = "";
};

const selectClick = () => {
  if (closeOnClick) closeDropdown();
};

$: filteredItems =
  searchText && searchText.length > 0
    ? normalizedCountries.filter((el) => el.label.toLowerCase().indexOf(searchText.toLowerCase()) >= 0).sort((a, b) => (a.label < b.label ? -1 : 1))
    : normalizedCountries;

const handleSelect = (val: CountryCode, e?: Event) => {
  if (disabled) return;
  e?.preventDefault();
  if (selectedCountry === undefined || selectedCountry === null || (typeof selectedCountry === typeof val && selectedCountry !== val)) {
    selectedCountry = val;
    onChange(val);
    selectClick();
  } else {
    dispatch("same", { option: val });
    selectClick();
  }
};

const dispatch = createEventDispatcher<CountrySelectEvents<CountryCode>>();

const onChange = (selectedCountry: CountryCode) => {
  dispatch("change", { option: selectedCountry });
};
</script>

<div class="flex input input-bordered" use:clickOutside on:click_outside="{() => closeDropdown()}">
  <button
    id="states-button"
    data-dropdown-toggle="dropdown-states"
    class="flex-shrink-0 overflow-hidden z-10 inline-flex items-center py-2.5 text-sm font-medium text-center focus:outline-none"
    type="button"
    on:click="{toggleDropDown}">
    {#if selectedCountry && selectedCountry !== null}
      <div class="inline-flex items-center text-left">
        <span class="fi fis fi-{selectedCountry.toLowerCase()} flex-shrink-0 mr-3"></span>

        <span class="text-gray-500">+{selectedCountryDialCode}</span>
      </div>
    {:else}
      Please select
    {/if}
    <svg aria-hidden="true" class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
    </svg>
  </button>
  {#if isOpen}
    <div
      id="dropdown-countries"
      class="absolute z-10 overflow-hidden -translate-x-6 bg-white divide-y divide-gray-100 rounded shadow max-w-fit translate-y-11"
      data-popper-reference-hidden=""
      data-popper-escaped=""
      data-popper-placement="bottom"
      aria-orientation="vertical"
      aria-labelledby="country-button"
      tabindex="-1">
      <ul class="px-2 py-4 overflow-y-auto text-sm max-h-48" aria-labelledby="countries-button" role="listbox">
        {#if true}
          <input aria-autocomplete="list" type="text" class="sticky w-full px-4 input input-bordered input-sm m-x-2" placeholder="{searchTextPlaceholder}" bind:value="{searchText}" />
        {/if}
        {#each filteredItems as country (country.id)}
          {@const isActive = isSelected(country.iso2, selectedCountry)}
          <li role="option" aria-selected="{isActive}">
            <button
              value="{country.iso2}"
              type="button"
              class="inline-flex py-2 px-4 w-full text-sm hover:bg-gray-100 dark:hover:bg-gray-600
                             active:bg-gray-800 dark:active:bg-gray-800 overflow-hidden
                            {isActive ? 'bg-gray-600 dark:text-white' : 'dark:hover:text-white dark:text-gray-400'}"
              on:click="{(e) => {
                handleSelect(country.iso2, e);
              }}">
              <div class="inline-flex items-center text-left">
                <span class="fi fis fi-{country.iso2.toLowerCase()} flex-shrink-0 mr-3"></span>
                <span class="mr-2">{country.name}</span>
                <span class="text-gray-500">+{country.dialCode}</span>
              </div>
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
