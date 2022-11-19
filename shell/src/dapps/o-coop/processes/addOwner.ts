import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { show } from "@o-platform/o-process/dist/actions/show";
import ErrorView from "../../../shared/atoms/Error.svelte";
import { AddMemberDocument } from "../../../shared/api/data/types";
import { promptCirclesSafe } from "../../../shared/api/promptCirclesSafe";
import { loadProfileBySafeAddress } from "../../../shared/api/loadProfileBySafeAddress";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import HtmlViewer from "../../../../../packages/o-editors/src/HtmlViewer.svelte";
import {setWindowLastError} from "../../../shared/processes/actions/setWindowLastError";
import {CirclesSafe} from "../../o-banking/chain/circlesSafe";
import {DefaultExecutionContext} from "../../o-banking/chain/actions/defaultExecutionContext";

export type AddOwnerContextData = {
  successAction: (data: AddOwnerContextData) => void;
  groupId?: number;
  memberAddress?: string;
};

export type AddOwnerContext = ProcessContext<AddOwnerContextData>;

const processDefinition = (processId: string) =>
  createMachine<AddOwnerContext, any>({
    id: `${processId}:addOwner`,
    initial: "memberAddress",
    states: {
      ...fatalError<AddOwnerContext, any>("error"),

      memberAddress: promptCirclesSafe<AddOwnerContext, any>({
        field: "memberAddress",
        onlyWhenDirty: false,
        params: {
          view: {
            title: window.o.i18n("dapps.o-coop.processes.addMembers.memberAddress.title"),
            description: "",
            placeholder: window.o.i18n("dapps.o-coop.processes.addMembers.memberAddress.placeholder"),
            submitButtonText: window.o.i18n("dapps.o-coop.processes.addMembers.memberAddress.submitButtonText"),
          },
          placeholder: window.o.i18n("dapps.o-coop.processes.addMembers.memberAddress.placeholder"),
          submitButtonText: window.o.i18n("dapps.o-coop.processes.addMembers.memberAddress.submitButtonText"),
        },
        navigation: {
          next: "#addMember",
        },
      }),
      addMember: {
        id: "addMember",
        invoke: {
          src: async (context) => {
            const memberProfile = await loadProfileBySafeAddress(context.data.memberAddress);
            if (!memberProfile) {
              throw new Error(`Couldn't load a profile for safe address ${context.data.memberAddress}`);
            }

            if (!memberProfile.circlesSafeOwner) {
              throw new Error(`The owner eoa address for safe ${context.data.memberAddress} is not known.`);
            }

            const circlesSafe = new CirclesSafe(
              context.data.groupId.toString(),
              DefaultExecutionContext.fromKey(sessionStorage.getItem("circlesKey")));

            const addOwnerResult = await circlesSafe.addOwner(memberProfile.circlesSafeOwner);
            console.log(addOwnerResult);

            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: AddMemberDocument,
              variables: {
                groupId: context.data.groupId,
                memberAddress: context.data.memberAddress,
              },
            });
            console.log(`AddMember result:`, result);
          },
          onDone: "#showSuccess",
          onError: {
            actions: setWindowLastError,
            target: "#showError",
          },
        },
      },
      showError: {
        id: "showError",
        entry: show({
          component: ErrorView,
          params: {},
          field: {
            name: "",
            get: () => undefined,
            set: (_) => {},
          },
        }),
      },
      showSuccess: prompt({
        id: "showSuccess",
        field: "__",
        component: HtmlViewer,
        params: {
          view: "",
          html: () => "A new owner was successfully added.",
          hideNav: false,
        },
        navigation: {
          next: "#success",
        },
      }),
      success: {
        type: "final",
        id: "success",
        entry: (context) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        },
        data: (context) => {
          return context.data;
        },
      },
    },
  });

export const addOwner: ProcessDefinition<void, AddOwnerContext> = {
  name: "addOwner",
  stateMachine: <any>processDefinition,
};
