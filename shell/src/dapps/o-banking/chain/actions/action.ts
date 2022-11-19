import {ActionExecutionContext} from "./actionExecutionContext";

export interface Action<TResult> {
  execute(context: ActionExecutionContext) : Promise<TResult>;
}