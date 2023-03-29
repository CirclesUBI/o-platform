<script lang="ts">
import { setupI18n, isLocaleLoaded, _ } from "src/i18n/i18nDictionary";
import { get } from "svelte/store";
const i18nString = get(_);

$: if (!$isLocaleLoaded) {
  setupI18n({ withLocale: "en" });
}

export let key: string;
export let values: any = null;
</script>

{#if $isLocaleLoaded}
  <!-- <span data-i18n-key="{key}">{@html $_(`${key}`)}</span> -->
  <span data-i18n-key="{key}">{@html i18nString(key, { values: values })}</span>
{/if}
