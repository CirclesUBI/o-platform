<script lang="ts">
import { setupI18n, isLocaleLoaded, _ } from "src/i18n/i18nDictionary";
import { get } from "svelte/store";
const i18nString = get(_);

$: if (!$isLocaleLoaded) {
  setupI18n({ withLocale: "en" });
}

export let key: string = null;
export let values: any = null;
export let text: string = null;
export let truncate: boolean = false;
</script>

{#if text}
  <div class:flex-parent="{truncate}" class:inline="{!truncate}">
    <div class:long-and-truncated="{truncate}" class:inline="{!truncate}">
      {text}
    </div>
  </div>
{:else if $isLocaleLoaded}
  <!-- <span data-i18n-key="{key}">{@html $_(`${key}`)}</span> -->
  <span data-i18n-key="{key}">{@html i18nString(key, { values: values })}</span>
{/if}

<style lang="css">
.flex-parent {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
}
.long-and-truncated {
  flex: 1;
}
.long-and-truncated,
.long-and-truncated > * {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
