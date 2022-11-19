import {EthAdapter, MetaTransactionData} from "@gnosis.pm/safe-core-sdk-types";
import Safe, {SafeTransactionOptionalProps} from "@gnosis.pm/safe-core-sdk";
import {OperationType} from "@gnosis.pm/safe-core-sdk-types/dist/src/types";
import {Contract, ContractReceipt, ethers, Signer, Wallet} from "ethers";
import {CirclesNetworkConfig} from "../circlesNetworkConfig";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import {defaultNetworkConfig} from "../defaultNetworkConfig";
import {Utilities} from "../utilities";

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

export class DefaultExecutionContext implements ActionExecutionContext {
  readonly ethAdapter: EthAdapter;
  readonly networkConfig: CirclesNetworkConfig;
  readonly signer: Signer;

  static fromKey(privateKey:string) : DefaultExecutionContext {
    const provider = new ethers.providers.JsonRpcProvider({
      url: defaultNetworkConfig.rpcUrl ,
    });
    const signer = new Wallet(privateKey, provider);
    const ethAdapter = new EthersAdapter({
      ethers,
      signer: signer
    });
    return new DefaultExecutionContext(signer, ethAdapter, defaultNetworkConfig);
  }

  static readonly() : DefaultExecutionContext {
    const provider = new ethers.providers.JsonRpcProvider({
      url: defaultNetworkConfig.rpcUrl ,
    });
    const randomKey = Utilities.generateRandomKey();
    const signer = new Wallet(randomKey.privateKey, provider);
    const ethAdapter = new EthersAdapter({
      ethers,
      signer: signer
    });
    return new DefaultExecutionContext(signer, ethAdapter, defaultNetworkConfig);
  }

  constructor(signer: Signer, ethAdapter:EthAdapter, networkConfig: CirclesNetworkConfig) {
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

  async callContract(safeAddress:string, contractAddress: string, callData: string) : Promise<ContractReceipt> {
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
    return await txResult.transactionResponse.wait();
  }

  async getTokenAddress(safeAddress: string): Promise<string | undefined | null> {
    const crcHubContract = new Contract(
      this.networkConfig.crcHubAddress,
      this.networkConfig.crcHubAbi);

    return await crcHubContract.userToToken(safeAddress);
  }
}