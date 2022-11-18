import {Action, ActionExecutionContext} from "./action";
import {ethers} from "ethers";

export type RequestUbiResultData = {
  safeAddress:string;
  txHash:string;
};

export class RequestUbi implements Action<RequestUbiResultData> {
  readonly safeAddress:string;

  constructor(safeAddress:string) {
    this.safeAddress = safeAddress;
  }

  async execute(context: ActionExecutionContext): Promise<any> {
    const crcTokenAddress = await context.getTokenAddress(this.safeAddress);
    const crcTokenInterface = new ethers.utils.Interface(context.networkConfig.crcTokenAbi)
    const getUbiCallData = crcTokenInterface.encodeFunctionData("update", []);
    const receipt = await context.callContract(this.safeAddress, crcTokenAddress, getUbiCallData);

    return {
      safeAddress: this.safeAddress,
      txHash: receipt.transactionHash
    };
  }
}