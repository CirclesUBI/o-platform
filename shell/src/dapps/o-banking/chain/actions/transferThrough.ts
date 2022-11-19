import {Action} from "./action";
import {BigNumber, ethers} from "ethers";
import {ActionExecutionContext} from "./actionExecutionContext";

export type TransferThroughResultData = {
  safeAddress:string;
  txHash:string;
  blockHash:string;
  blockNumber:number;
};

export class TransferThrough implements Action<TransferThroughResultData> {
  readonly safeAddress: string;
  readonly tokenOwners: string[];
  readonly sources: string[];
  readonly destinations: string[];
  readonly values: BigNumber[];

  constructor(
    safeAddress: string,
    tokenOwners: string[],
    sources: string[],
    destinations: string[],
    values: BigNumber[]) {
    this.safeAddress = safeAddress;
    this.tokenOwners = tokenOwners;
    this.sources = sources;
    this.destinations = destinations;
    this.values = values;
  }

  async execute(context: ActionExecutionContext): Promise<TransferThroughResultData> {
    const crcHubInterface = new ethers.utils.Interface(context.networkConfig.crcHubAbi);
    const callData = crcHubInterface.encodeFunctionData(
      "transferThrough",
      [
        this.tokenOwners,
        this.sources,
        this.destinations,
        this.values.map(o => o.toString())
      ]
    );

    const transferThroughReceipt = await context.callContract(
      this.safeAddress,
      context.networkConfig.crcHubAddress,
      callData);

    return {
      safeAddress: this.safeAddress,
      txHash: transferThroughReceipt.transactionHash,
      blockHash: transferThroughReceipt.blockHash,
      blockNumber: transferThroughReceipt.blockNumber
    }
  }
}