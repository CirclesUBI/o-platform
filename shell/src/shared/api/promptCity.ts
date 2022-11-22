import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { normalizePromptField, prompt, PromptField } from "@o-platform/o-process/dist/states/prompt";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import { DropdownSelectorParams } from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import DropDownCity from "@o-platform/o-editors/src/dropdownItems/DropDownCity.svelte";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import { Environment } from "../environment";

type City = {
  id: string;
  name: string;
  title: string;
  country: string;
  address: Address;
  highlights?: {
    [name: string]: {
      start: number;
      end: number;
    }[];
  };
};

type Address = {
  label: string;
  countryCode: string;
  countryName: string;
};

export async function cityByHereId(key: string) {
  const url = `https://lookup.search.hereapi.com/v1/lookup?id=${encodeURIComponent(key)}&apiKey=${
    Environment.hereApiKey
  }`;
  const response = await fetch(url);
  return await response.json();
}

export function promptCity<TContext extends ProcessContext<any>, TEvent extends PlatformEvent>(spec: {
  id?: string;
  field: PromptField<TContext>;
  params: {
    view: EditorViewContext;
    [x: string]: any;
  };
  navigation?: {
    // If you want to allow the user to go one step back then specify here where he came from
    previous?: string;
    canGoBack?: (context: ProcessContext<TContext>, event: { type: string; [x: string]: any }) => boolean;
    next?: string;
    skip?: string;
    canSkip?: (context: ProcessContext<TContext>, event: { type: string; [x: string]: any }) => boolean;
  };
}) {
  const field = normalizePromptField(spec.field);

  return prompt<TContext, any>({
    id: spec.id ?? field.name,
    field: spec.field,
    component: DropdownSelectEditor,
    params: <DropdownSelectorParams<TContext, City, string>>{
      view: spec.params.view,
      placeholder: spec.params.view.placeholder,
      submitButtonText: spec.params.view.submitButtonText,
      itemTemplate: DropDownCity,
      getKey: (o) => o.id,
      getLabel: (o) => `${o?.title ?? ""}`,
      getHighlight: (o) => {
        if (o.highlights?.title?.length > 0) {
          return {
            start: o.highlights.title[0].start,
            end: o.highlights.title[0].end,
          };
        }
      },
      keyProperty: "id",
      choices: {
        byKey: async (key: string) => {
          return await cityByHereId(key);
        },
        find: async (filter: string) => {
          // https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics-api/code-autocomplete-result-type-filter.html
          const url = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${encodeURIComponent(
            filter
          )}&types=city&apiKey=${Environment.hereApiKey}`;

          const response = await fetch(url);
          const json = await response.json();
          return json.items.reverse().length ? json.items : [];
        },
      },
    },
    navigation: spec.navigation,
  });
}
