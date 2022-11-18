import {EthAdapter, MetaTransactionData} from "@gnosis.pm/safe-core-sdk-types";
import Safe, {SafeTransactionOptionalProps} from "@gnosis.pm/safe-core-sdk";
import {OperationType} from "@gnosis.pm/safe-core-sdk-types/dist/src/types";
import {TransactionReceipt} from "web3-core";
import {Contract} from "ethers";
import {CirclesNetworkConfig} from "../circlesNetworkConfig";

export interface Action<TResult> {
  execute(context: ActionExecutionContext) : Promise<TResult>;
}

export interface ActionExecutionContext {
  networkConfig: CirclesNetworkConfig;
  ethAdapter: EthAdapter;
  getSafe(safeAddress:string) : Promise<Safe>;
  callContract(safeAddress:string, contractAddress: string, callData: string) : Promise<TransactionReceipt>;
  getTokenAddress(safeAddress:string): Promise<string|undefined>;
}

export class DefaultExecutionContext implements ActionExecutionContext {
  readonly ethAdapter: EthAdapter;
  readonly networkConfig: CirclesNetworkConfig;

  constructor(ethAdapter:EthAdapter, networkConfig: CirclesNetworkConfig) {
    this.ethAdapter = ethAdapter;
    this.networkConfig = networkConfig;
  }

  async getSafe(safeAddress: string): Promise<Safe> {
    const networkId = await this.ethAdapter.getChainId()
    return await Safe.create({
      ethAdapter: this.ethAdapter,
      safeAddress: safeAddress,
      contractNetworks: {[networkId]: this.networkConfig}
    });
  }

  async callContract(safeAddress:string, contractAddress: string, callData: string) : Promise<TransactionReceipt> {
    const transactions: MetaTransactionData[] = [{
      to: contractAddress,
      data: callData,
      value: "0x00",
      operation: OperationType.Call
    }]

    const safe = await this.getSafe(safeAddress);
    const options: SafeTransactionOptionalProps = {}

    const transaction = await safe.createTransaction({
      safeTransactionData: transactions,
      options: options
    });

    await safe.signTransaction(transaction);

    const txResult = await safe.executeTransaction(transaction);
    return txResult.promiEvent;
  }

  async getTokenAddress(safeAddress: string): Promise<string | undefined | null> {
    const crcHubContract = new Contract(
      this.networkConfig.crcHubAddress,
      this.networkConfig.crcHubAbi);

    return await crcHubContract.userToToken(safeAddress);
  }
}