import { derived } from "svelte/store";
import { dictionary, locale, _, init } from "svelte-i18n";
import { Environment } from "../shared/environment";

const MESSAGE_FILE_URL_TEMPLATE = "https://cdn.jsdelivr.net/gh/CirclesUBI/o-platform-i18n@dev/{locale}.json";
// const MESSAGE_FILE_URL_TEMPLATE = "./dictionaries/{locale}.json";
// TODO: Add Local Fallback if fetch fails. ( LOCAL DEVELOPMENT WITHOUT NETWORK WILL OTHERWISE NOT WORK)

let cachedLocale;

init({
  fallbackLocale: "en",
  initialLocale: Environment.userLanguage.slice(0, 2),
});

function setupI18n({ withLocale: _locale } = { withLocale: Environment.userLanguage.slice(0, 2) }) {
  const messsagesFileUrl = Environment.i18nFileUrlTemplate.replace("{locale}", _locale);

  return fetch(messsagesFileUrl)
    .then((response) => response.json())
    .then((messages) => {
      dictionary.set({ [_locale]: messages });
      // Keep a cached copy of the locale
      cachedLocale = _locale;
      locale.set(_locale);
    })
    .catch((e) => {
      console.log("Error fetching translation file: ", e.message);
    });
}

function formatDate(date, options) {
  return new Intl.DateTimeFormat(cachedLocale, options).format(new Date(date));
}

const isLocaleLoaded = derived(locale, ($locale) => typeof $locale === "string");

export { _, locale, setupI18n, formatDate, isLocaleLoaded };
