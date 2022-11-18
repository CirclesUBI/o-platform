import {Action, ActionExecutionContext} from "./action";
import {ethers} from "ethers";

export type HubSignupOrganizationResultData = {
  safeAddress:string;
  txHash:string;
};

export class HubSignupOrganization implements Action<HubSignupOrganizationResultData> {
  readonly safeAddress:string;

  constructor(safeAddress:string) {
    this.safeAddress = safeAddress;
  }

  async execute(context: ActionExecutionContext): Promise<HubSignupOrganizationResultData> {
    const crcHubInterface = new ethers.utils.Interface(context.networkConfig.crcHubAbi);
    const callData = crcHubInterface.encodeFunctionData("organizationSignup", []);

    const signupReceipt = await context.callContract(
      this.safeAddress,
      context.networkConfig.crcHubAddress,
      callData);

    return {
      safeAddress: this.safeAddress,
      txHash: signupReceipt.transactionHash
    }
  }
}