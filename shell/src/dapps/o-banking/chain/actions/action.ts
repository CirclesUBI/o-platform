import {EthAdapter} from "@gnosis.pm/safe-core-sdk-types";
import Safe from "@gnosis.pm/safe-core-sdk";
import {ContractReceipt, Signer} from "ethers";
import {CirclesNetworkConfig} from "../circlesNetworkConfig";

export interface Action<TResult> {
  execute(context: ActionExecutionContext) : Promise<TResult>;
}

export interface ActionExecutionContext {
  networkConfig: CirclesNetworkConfig;
  ethAdapter: EthAdapter;
  signer: Signer;
  getSafe(safeAddress:string) : Promise<Safe>;
  callContract(safeAddress:string, contractAddress: string, callData: string) : Promise<ContractReceipt>;
  getTokenAddress(safeAddress:string): Promise<string|undefined>;
}
