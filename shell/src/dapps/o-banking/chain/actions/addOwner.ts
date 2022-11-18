import {Action, ActionExecutionContext} from "./action";

export type AddOwnerResultData = {
  safeAddress:string;
  txHash:string;
  newOwners:string[];
  newSignatureThreshold:number;
};

export class AddOwner implements Action<AddOwnerResultData> {
  readonly safeAddress:string;
  readonly newOwner:string;
  readonly signatureThreshold?:number;

  /**
   * @param safeAddress The safe address
   * @param newOwner The address that should be added as owner
   * @param signatureThreshold The new signature threshold or 'null|undefined' to keep the current threshold (Cannot be zero).
   */
  constructor(safeAddress:string, newOwner:string, signatureThreshold?:number) {
    this.safeAddress = safeAddress;
    this.newOwner = newOwner;
    this.signatureThreshold = signatureThreshold;
  }

  async execute(context: ActionExecutionContext): Promise<AddOwnerResultData> {
    const safe = await context.getSafe(this.safeAddress);

    const tx = await safe.createAddOwnerTx({
      ownerAddress: this.newOwner,
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