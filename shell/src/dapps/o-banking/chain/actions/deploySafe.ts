import {Action} from "./action";
import {SafeAccountConfig, SafeFactory} from "@gnosis.pm/safe-core-sdk";
import {ActionExecutionContext} from "./actionExecutionContext";

export type DeploySafeResultData = {
  safeAddress:string;
  txHash:string;
  owners:string[];
  signatureThreshold:number;
};

export class DeploySafe implements Action<DeploySafeResultData> {
  readonly newOwners:string[];
  readonly signatureThreshold:number;

  constructor(newOwners:string[], signatureThreshold:number) {
    this.newOwners = newOwners;
    this.signatureThreshold = signatureThreshold;
  }

  async execute(context: ActionExecutionContext): Promise<DeploySafeResultData> {
    const safeFactory = await SafeFactory.create({ ethAdapter: context.ethAdapter });
    const safeAccountConfig: SafeAccountConfig = {
      owners: this.newOwners,
      threshold: this.signatureThreshold
    }

    let txHash: string;
    const safe = await safeFactory.deploySafe({
      safeAccountConfig,
      callback: hash => txHash = hash
    });

    const safeAddress = safe.getAddress();
    const owners = await safe.getOwners();
    const signatureThreshold = await safe.getThreshold();

    return <DeploySafeResultData> {
      safeAddress,
      txHash,
      owners,
      signatureThreshold
    };
  }
}