import {Action} from "./action";
import {ActionExecutionContext} from "./actionExecutionContext";

export type RemoveOwnerResultData = {
  safeAddress:string;
  txHash:string;
  newOwners:string[];
  newSignatureThreshold:number;
};

export class RemoveOwner implements Action<RemoveOwnerResultData> {
  readonly safeAddress:string;
  readonly oldOwner:string;
  readonly signatureThreshold?:number;

  constructor(safeAddress:string, oldOwner:string, signatureThreshold?:number) {
    this.safeAddress = safeAddress;
    this.oldOwner = oldOwner;
    this.signatureThreshold = signatureThreshold;
  }

  async execute(context: ActionExecutionContext): Promise<any> {
    const safe = await context.getSafe(this.safeAddress);

    const tx = await safe.createRemoveOwnerTx({
      ownerAddress: this.oldOwner,
      threshold: !this.signatureThreshold
        ? await safe.getThreshold()
        : this.signatureThreshold
    });

    const txResult = await safe.executeTransaction(tx);
    const receipt = await txResult.promiEvent;

    return {
      newOwners: await safe.getOwners(),
      newSignatureThreshold: await safe.getThreshold(),
      safeAddress: safe.getAddress(),
      txHash: receipt.transactionHash
    };
  }
}