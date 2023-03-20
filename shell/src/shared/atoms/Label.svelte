<script lang="ts">
import { setupI18n, isLocaleLoaded, _ } from "src/i18n/i18nDictionary";

$: if (!$isLocaleLoaded) {
  setupI18n({ withLocale: "en" });
}

export let key: string;
</script>

{#if $isLocaleLoaded}
  <span data-i18n-key="{key}">{@html $_(`${key}`)}</span>
{/if}
