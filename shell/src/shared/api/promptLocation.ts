import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { normalizePromptField, prompt, PromptField } from "@o-platform/o-process/dist/states/prompt";

import LocationSearchEditor from "@o-platform/o-editors/src/LocationSearchEditor.svelte";
import { LocationSearchSelectorParams } from "@o-platform/o-editors/src/LocationSearchEditorContext";

import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";

type Location = {
  place_id: string;
  address: string;
  lat: string;
  lng: string;
};

export function promptLocation<TContext extends ProcessContext<any>, TEvent extends PlatformEvent>(spec: {
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
    component: LocationSearchEditor,
    params: <LocationSearchSelectorParams<TContext, Location, string>>{
      view: spec.params.view,
      placeholder: spec.params.view.placeholder,
      submitButtonText: spec.params.view.submitButtonText,

      getLabel: (o) => `${o?.address ?? ""}`,
      keyProperty: "place_id",
    },
    navigation: spec.navigation,
  });
}
