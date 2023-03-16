import { EditorContext } from "./editorContext";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { EditorViewContext } from "./shared/editorViewContext";

export type LocationSearchSelectorParams<TContext extends ProcessContext<any>, TOption, TKey> = {
  view?: EditorViewContext;
  keyProperty?: string;
  getLabel: (option: TOption) => string;
  showResultsOnLoad?: boolean;
  showNavigation?: boolean;
  submitOnBlur?: boolean;
  [x: string]: any;
};

export type LocationSearchSelectorContext<TContext extends ProcessContext<any>, TOption, TKey> = EditorContext & {
  params: LocationSearchSelectorParams<TContext, TOption, TKey>;
};
