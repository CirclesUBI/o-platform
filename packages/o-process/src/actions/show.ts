import { bubble } from "./bubble";
import { Prompt } from "../events/prompt";
import { ProcessContext } from "../interfaces/processContext";
import { AnyEventObject } from "xstate";
import {Schema} from "yup";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export type PromptSpec = {
  passDataByReference?: boolean; // If the value of 'context.data' should be passed by reference (default: no)
  fieldName?: string;
  component: any;
  params?: {
    [x: string]: any;
  };
  /**
   * If set to 'true' tries to avoid to be saved in the browser's form auto-fill.
   */
  isSensitive?: boolean;
  navigation?: {
    canGoBack?: (
        context: ProcessContext<any>,
        event: AnyEventObject
    ) => boolean;
    canSkip?: (context: ProcessContext<any>, event: AnyEventObject) => boolean;
  };
  dataSchema?: Schema<any,any>;
};

export type PromptSpecOrFactory<TContext extends ProcessContext<any>, TEvent extends PlatformEvent>
    = PromptSpec | ((context:TContext, event:TEvent) => PromptSpec)

/**
 * Bubbles a 'process.prompt' event in order to show the specified component to the user.
 * @param spec
 */
export function show<TContext extends ProcessContext<any>, TEvent extends PlatformEvent>(spec: PromptSpecOrFactory<TContext, TEvent>) {
  return bubble((context: TContext, event: any) => {
    const concreteSpec = typeof spec === "function" ? spec(context, event) : <PromptSpec>spec;
    const canGoBack = !concreteSpec.navigation?.canGoBack
      ? false
      : concreteSpec.navigation.canGoBack(context, event);
    const canSkip = !concreteSpec.navigation?.canSkip
      ? false
      : concreteSpec.navigation.canSkip(context, event);
    return <Prompt>{
      type: "process.prompt",
      fieldName: concreteSpec.fieldName,
      component: concreteSpec.component,
      data: concreteSpec.passDataByReference
        ? context.data
        : JSON.parse(JSON.stringify(context.data)),
      dirtyFlags: context.dirtyFlags,
      messages: context.messages,
      params: concreteSpec.params,
      isSensitive: concreteSpec.isSensitive,
      navigation: {
        canGoBack,
        canSkip,
      },
      dataSchema: concreteSpec.dataSchema,
    };
  });
}
