import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import ChoiceSelector from "@o-platform/o-editors/src/ChoiceSelector.svelte";

export type PromptChoiceSpec = {
  id: string
  promptLabel: string
  options:{key:string, label:string, target:string}[]
  onlyWhenDirty?:boolean
  navigation?: {
    // If you want to allow the user to go one step back then specify here where he came from
    previous?: string;
    canGoBack?: (
        context: ProcessContext<any>,
        event: { type: string; [x: string]: any }
    ) => boolean;
    skip?: string;
    canSkip?: (
        context: ProcessContext<any>,
        event: { type: string; [x: string]: any }
    ) => boolean;
  }
};

export function promptChoice<
  TContext extends ProcessContext<any>,
  TEvent extends PlatformEvent
  >(spec: PromptChoiceSpec) {
  const connectOrCreateConfig: any = {
    // TODO: Fix need for 'any'
    id: spec.id,
    initial: "promptChoice",
    states: {
      promptChoice: prompt<ProcessContext<any>, any>({
        fieldName: spec.id,
        component: ChoiceSelector,
        onlyWhenDirty: spec.onlyWhenDirty,
        params: {
          label: spec.promptLabel,
          choices: spec.options
        },
        navigation: {
          next: "#checkChoiceAndContinue",
          previous: spec.navigation?.previous,
          canGoBack: spec.navigation?.canGoBack,
          canSkip : spec.navigation?.canSkip,
          skip: spec.navigation?.skip
        },
      }),
      checkChoiceAndContinue: {
        id: "checkChoiceAndContinue",
        always: spec.options.map(c => {
          return {
            cond: (context) => {
              return context.data[spec.id].key == c.key
            },
            target: c.target,
          }
        })
      },
    }
  };

  return connectOrCreateConfig;
}
