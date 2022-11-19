import {CirclesNetworkConfig} from "../circlesNetworkConfig";
import {EthAdapter} from "@gnosis.pm/safe-core-sdk-types";
import {ContractReceipt, Signer} from "ethers";
import Safe from "@gnosis.pm/safe-core-sdk";

export interface ActionExecutionContext {
  networkConfig: CirclesNetworkConfig;
  ethAdapter: EthAdapter;
  signer: Signer;
  getSafe(safeAddress:string) : Promise<Safe>;
  callContract(safeAddress:string, contractAddress: string, callData: string) : Promise<ContractReceipt>;
  getTokenAddress(safeAddress:string): Promise<string|undefined>;
  signMessage(message: string): Promise<string>;
}
