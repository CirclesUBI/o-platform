import {Action, ActionExecutionContext} from "./action";
import {ethers} from "ethers";

export type HubSignupPersonResultData = {
  safeAddress:string;
  tokenAddress:string;
  txHash:string;
};

export class HubSignupPerson implements Action<HubSignupPersonResultData> {
  readonly safeAddress:string;

  constructor(safeAddress:string) {
    this.safeAddress = safeAddress;
  }

  async execute(context: ActionExecutionContext): Promise<HubSignupPersonResultData> {
    const crcHubInterface = new ethers.utils.Interface(context.networkConfig.crcHubAbi);
    const callData = crcHubInterface.encodeFunctionData("signup", []);

    const signupReceipt = await context.callContract(
      this.safeAddress,
      context.networkConfig.crcHubAddress,
      callData);

    const tokenAddress = await context.getTokenAddress(this.safeAddress);

    return {
      safeAddress: this.safeAddress,
      txHash: signupReceipt.transactionHash,
      tokenAddress: tokenAddress
    }
  }
}