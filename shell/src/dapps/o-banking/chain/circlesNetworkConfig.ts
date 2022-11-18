import {ContractNetworkConfig} from "@gnosis.pm/safe-core-sdk/dist/src/types";

/**
 * Encapsulates all required contract addresses and ABIs for CirclesSafe on a specific network.
 */
export interface CirclesNetworkConfig extends ContractNetworkConfig {
  multiSendAddress: string;
  safeMasterCopyAddress: string;
  safeProxyFactoryAddress: string;
  crcHubAddress:string;
  crcHubAbi:any[];
  crcTokenAbi:any[];
  rpcUrl: string;
}