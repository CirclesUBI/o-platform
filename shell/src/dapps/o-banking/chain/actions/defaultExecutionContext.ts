import {EthAdapter, MetaTransactionData} from "@gnosis.pm/safe-core-sdk-types";
import {CirclesNetworkConfig} from "../circlesNetworkConfig";
import {Contract, ContractReceipt, ethers, Signer, Wallet} from "ethers";
import {defaultNetworkConfig} from "../defaultNetworkConfig";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import {Utilities} from "../utilities";
import Safe, {SafeTransactionOptionalProps} from "@gnosis.pm/safe-core-sdk";
import {OperationType} from "@gnosis.pm/safe-core-sdk-types/dist/src/types";
import {ActionExecutionContext} from "./actionExecutionContext";

export class DefaultExecutionContext implements ActionExecutionContext {
  readonly ethAdapter: EthAdapter;
  readonly networkConfig: CirclesNetworkConfig;
  readonly signer: Signer;

  static get readonly(): ActionExecutionContext {
    if (!this._readonlyExecutionContext)
      this._readonlyExecutionContext = DefaultExecutionContext._readonly();

    return this._readonlyExecutionContext;
  }
  private static _readonlyExecutionContext: ActionExecutionContext|undefined;

  static fromKey(privateKey:string) : ActionExecutionContext {
    const provider = new ethers.providers.JsonRpcProvider({
      url: defaultNetworkConfig.rpcUrl
    });
    const signer = new Wallet(privateKey, provider);
    const ethAdapter = new EthersAdapter({
      ethers,
      signer: signer
    });
    return new DefaultExecutionContext(signer, ethAdapter, defaultNetworkConfig);
  }

  private static _readonly() : ActionExecutionContext {
    const provider = new ethers.providers.JsonRpcProvider({
      url: defaultNetworkConfig.rpcUrl
    });
    const randomKey = Utilities.generateRandomKey();
    const signer = new Wallet(randomKey.privateKey, provider);
    const ethAdapter = new EthersAdapter({
      ethers,
      signer: signer
    });
    return new DefaultExecutionContext(signer, ethAdapter, defaultNetworkConfig);
  }

  async signMessage(message: string): Promise<string> {
    const messageHash = ethers.utils.solidityKeccak256(['string'], [message]);
    return this.ethAdapter.signMessage(messageHash);
  }

  constructor(signer: Signer, ethAdapter:EthAdapter, networkConfig: CirclesNetworkConfig) {
    this.signer = signer;
    this.ethAdapter = ethAdapter;
    this.networkConfig = networkConfig;
  }

  async getSafe(safeAddress: string): Promise<Safe> {
    return await Safe.create({
      ethAdapter: this.ethAdapter,
      safeAddress: safeAddress,
      contractNetworks: {[this.networkConfig.chainId]: this.networkConfig}
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
      this.networkConfig.crcHubAbi,
      DefaultExecutionContext.readonly.signer);

    return await crcHubContract.userToToken(safeAddress);
  }
}