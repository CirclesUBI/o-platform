import {Action} from "./action";
import {BigNumber, ethers} from "ethers";
import {ActionExecutionContext} from "./actionExecutionContext";

export type SetTrustResultData = {
  safeAddress:string;
  txHash:string;
  trustAddress:string;
  trustLimit:number;
};

export class SetTrust implements Action<SetTrustResultData> {
  readonly safeAddress:string;
  readonly trustAddress:string;
  readonly trustLimit:number;

  constructor(safeAddress:string, trustAddress:string, trustLimit:number) {
    this.safeAddress = safeAddress;
    this.trustAddress = trustAddress;
    this.trustLimit = trustLimit;
  }

  async execute(context: ActionExecutionContext): Promise<SetTrustResultData> {
    const crcHubInterface = new ethers.utils.Interface(context.networkConfig.crcHubAbi);
    const callData = crcHubInterface.encodeFunctionData(
      "trust",
      [
        this.trustAddress,
        BigNumber.from(this.trustLimit)
      ]
    );

    const trustReceipt = await context.callContract(
      this.safeAddress,
      context.networkConfig.crcHubAddress,
      callData);

    return {
      safeAddress: this.safeAddress,
      txHash: trustReceipt.transactionHash,
      trustAddress: this.trustAddress,
      trustLimit: this.trustLimit // TODO: Get the actual limit from the chain
    }
  }
}