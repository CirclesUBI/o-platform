import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import {BN} from "ethereumjs-util";
import {TagTransactionDocument} from "../../../shared/api/data/types";
import {CirclesSafe} from "../chain/circlesSafe";
import {TransferThroughResultData} from "../chain/actions/transferThrough";
import {DefaultExecutionContext} from "../chain/actions/defaultExecutionContext";

export type TransferCirclesContextData = {
  safeAddress: string;
  recipientAddress: string;
  message: string;
  amount: string;
  privateKey: string;
  transitivePath?: TransitivePath;
  receipt:TransferThroughResultData;
  pathToRecipient?: {
    tokenOwners: string[];
    sources: string[];
    destinations: string[],
    values: string[]
  };
};


export type TransferCirclesContext = ProcessContext<TransferCirclesContextData>;

export type TransitivePathStep = {
  from: string,
  to: string,
  token: string,
  tokenOwner: string,
  value: string
}
export type TransitivePath = {
  flow: string,
  transfers: TransitivePathStep[]
}

const processDefinition = (processId: string) =>
  createMachine<TransferCirclesContext, any>({
    id: `${processId}:transferCircles`,
    initial: "transferCircles",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<TransferCirclesContext, any>("error"),
      transferCircles: {
        id: "transferCircles",
        invoke: {
          src: async (context) => {
            const tokenOwners = [];
            const sources = [];
            const destinations = [];
            const values = [];

            context.data.transitivePath.transfers.forEach(transfer => {
              tokenOwners.push(transfer.tokenOwner);
              sources.push(transfer.from);
              destinations.push(transfer.to);
              values.push(new BN(transfer.value));
            });

            const transferTroughResult = await new CirclesSafe(
              context.data.safeAddress,
              DefaultExecutionContext.fromKey(context.data.privateKey))
              .transferTrough(tokenOwners, sources, destinations, values);

            if (transferTroughResult && context.data.message) {
              const api = await window.o.apiClient.client.subscribeToResult();
              await api.mutate({
                mutation: TagTransactionDocument,
                variables: {
                  tag: {
                    typeId: "o-banking:transfer:message:1",
                    value: context.data.message
                  },
                  transactionHash: transferTroughResult.txHash
                }
              });
            }
            return transferTroughResult;

          },
          onDone: "#success",
          onError: "#error",
        },
      },
      success: {
        id: 'success',
        type: 'final',
        data: (context) => {
          return context.data;
        }
      }
    },
  });

export const transferCircles: ProcessDefinition<void, TransferCirclesContextData> = {
  name: "transferCircles",
  stateMachine: <any>processDefinition,
};
