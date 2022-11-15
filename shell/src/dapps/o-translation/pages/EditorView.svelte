<script lang="ts">
import { onMount } from "svelte";

import {
  CreateNewStringAndKeyDocument,
  GetAllStringsByMaxVersionDocument,
  GetAllStringsByMaxVersionQuery,
  GetAvailableLanguagesDocument,
  GetAvailableLanguagesQuery,
  I18n,
  MutationCreateNewStringAndKeyArgs,
} from "../../../shared/api/data/types";

import { ApiClient } from "../../../shared/apiConnection";
import StringEditor from "../atoms/StringEditor.svelte";
import { Environment } from "../../../shared/environment";
import { createEventDispatcher } from "svelte";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";

export let searchKey: string = "";
export let i18nData: I18n[] = [];
export let updateMode: boolean = false;
export let userLanguage: string;

let valueFilter: string = "";
let allLanguages: string[] = [];
let selectedLanguage: string = "";
let createNewStringMode: boolean = false;
let keyToCreate: string = "";
let stringToCreate: string = "";
let availableLanguages: I18n[] = [];

const dispatch = createEventDispatcher();

async function getAllLanguages() {
  const queryResult = await ApiClient.query<I18n[], GetAllStringsByMaxVersionQuery>(
    GetAllStringsByMaxVersionDocument,
    {}
  );
  const allLanguageKeysInQueryResult = queryResult.toLookup((o) => o.lang);
  allLanguages = Object.keys(allLanguageKeysInQueryResult);
  allLanguages.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
}

$: {
  i18nData;
  searchKey;
  selectedLanguage;
}

onMount(async () => {
  selectedLanguage = Environment.userLanguage;
  // reload();
  getAllLanguages();
  const i18nResult = await ApiClient.query<I18n[], GetAvailableLanguagesQuery>(GetAvailableLanguagesDocument, {});
  availableLanguages = i18nResult;
  availableLanguages.sort((a, b) => {
    if (a.lang < b.lang) {
      return -1;
    }
    if (a.lang > b.lang) {
      return 1;
    }
    return 0;
  });
});

function loadMoreWhenInViewport(e) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      dispatch("loadMoreStrings", updateMode);
    }
  });
  observer.observe(e);
}

function loadMoreUpdateStringsWhenInViewport(e) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      dispatch("loadMoreStringsToUpdate", updateMode);
    }
  });
  observer.observe(e);
}

async function writeNewKeyToDb(lang: string, key: string, version: number, value: string) {
  return await ApiClient.query<I18n, MutationCreateNewStringAndKeyArgs>(CreateNewStringAndKeyDocument, {
    lang: lang,
    key: key,
    version: version,
    value: value,
  });
}
</script>

<section class="flex flex-col items-center p-6 justify-evenly">
  <div class="flex flex-row flex-wrap items-stretch w-full justify-evenly">
    <div class="z-10 flex w-1/3 justify-evenly">
      {#each allLanguages as languageCode}
        <svg
          role="presentation"
          on:click="{() => {
            selectedLanguage = languageCode;
            dispatch('toggleLanguage', { languageCode: languageCode });
          }}"
          class="flex flex-row w-12 h-8 border-8 border-warning"
          class:border-8="{selectedLanguage == languageCode}"
          class:border-warning="{selectedLanguage == languageCode}">
          {#if languageCode == "en"}
            <image width="100%" height="100%" preserveAspectRatio="none" xlink:href="{'/countryFlags/gb.svg'}"></image>
          {:else}
            <image
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              xlink:href="{'/countryFlags/' + languageCode + '.svg'}"></image>
          {/if}
        </svg>
      {/each}
    </div>
    <div class="inline-flex w-2/3">
      <div class="inline-flex w-3/4">
        <form
          class="inline-flex w-full justify-sart"
          on:submit|preventDefault="{() => {
            dispatch('stringSearch', { searchString: valueFilter });
            valueFilter = '';
          }}">
          <input bind:value="{valueFilter}" class="w-3/4 rounded-r-none" type="text" placeholder="String" />
          {#if valueFilter == ""}
            <button class="text-white bg-gray-400 rounded-l-none btn-primary btn-disabled btn-sm rounded-btn">
              <Icon name="search" class="w-5 h-5 text-white" solid />
            </button>
          {:else}
            <button class="rounded-l-none btn-primary btn-sm rounded-btn">
              <Icon name="search" class="w-5 h-5 text-white" solid />
            </button>
          {/if}
        </form>
      </div>
      <div class="flex w-1/4 grow justify-evenly">
        <button
          class="bg-blue-200 rounded-md btn-md hover:bg-blue-500"
          class:bg-blue-100="{createNewStringMode}"
          class:rounded-md="{createNewStringMode}"
          class:btn-md="{createNewStringMode}"
          class:hover:cursor-not-allowed="{createNewStringMode}"
          on:click="{() => {
            createNewStringMode = true;
          }}">
          add a new string
        </button>
      </div>
    </div>

    {#if createNewStringMode}
      <!--Modal effect-->
      <div class="fixed inset-0 z-40 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50" id="my-modal"></div>
      <!--modale editor-->
      <div
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto p-5 border w-[50%] rounded-md bg-white z-50">
        <div class="w-full max-w-2xl px-5 py-10 m-auto mt-10 bg-white">
          <div class="mb-6 text-3xl text-center ">Create a new string</div>
          <div class="mb-6 text-center text-info">
            Please use english for the new created text/string.<br />All other languages will be notified about a new
            created text/string.
          </div>

          <div class="grid max-w-xl grid-cols-2 gap-4 m-auto">
            <div class="col-span-2">
              <input
                bind:value="{keyToCreate}"
                type="text"
                class="w-full p-3 border-2 border-gray-400 border-solid md:text-xl"
                placeholder="key goes here..." />
            </div>

            <div class="col-span-2">
              <textarea
                bind:value="{stringToCreate}"
                cols="30"
                rows="8"
                class="w-full p-3 border-2 border-gray-400 border-solid md:text-xl"
                placeholder="Message"></textarea>
            </div>

            <div class="sm:col-span-1 text-left col-span-2 sm:text-center w-[100%]">
              <button
                class="w-full px-6 py-3 font-bold text-white bg-green-500 rounded-md sm:w-32"
                on:click="{async () => {
                  for (let i = 0; i < availableLanguages.length; i++) {
                    await writeNewKeyToDb(availableLanguages[i].lang, keyToCreate, 1, stringToCreate);
                  }
                  createNewStringMode = false;
                  dispatch('newString');
                }}">
                Save
              </button>
            </div>

            <div class="sm:col-span-1 text-right col-span-2 sm:text-center w-[100%]">
              <button
                class="w-full px-6 py-3 font-bold text-white bg-red-500 rounded-md sm:w-32"
                on:click="{() => {
                  createNewStringMode = false;
                }}">
                Abort
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <div class="w-full pt-20">
    {#if !i18nData.length}
      <h1 class="flex justify-center pt-20 align-middle text-alert">No matching result</h1>
    {/if}

    {#each i18nData as data (data.key + data.lang + data.version)}
      <div class="w-full">
        <StringEditor
          on:save
          userLanguage="{userLanguage}"
          dataString="{data.value}"
          dataKey="{data.key}"
          dataLang="{data.lang}"
          dataVersion="{data.version}" />
      </div>
    {/each}

    {#if i18nData.length && !updateMode}
      <div use:loadMoreWhenInViewport class="btn-primary rounded-btn"></div>
    {:else if i18nData.length && updateMode}
      <div use:loadMoreUpdateStringsWhenInViewport class="btn-primary rounded-btn"></div>
    {/if}
  </div>
</section>
