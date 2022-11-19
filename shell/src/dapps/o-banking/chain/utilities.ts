import {ethers} from "ethers";
import {BigNumber, BigNumberish} from "@ethersproject/bignumber";
import {ActionExecutionContext} from "./actions/action";
import {HDNode} from "ethers/lib/utils";
import {TransactionReceipt} from "@ethersproject/abstract-provider";

export class Utilities {
  static isAddress(value: string): boolean {
    try {
      return !!ethers.utils.getAddress(value);
    } catch {
      return false;
    }
  }

  static generateRandomKey() : {
    address: string,
    privateKey: string
  } {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey
    }
  }

  static toChecksumAddress(address: string): string {
    return ethers.utils.getAddress(address);
  }

  static fromWei(value: BigNumberish): string {
    return ethers.utils.formatEther(value);
  }

  static toWei(value: number|string): BigNumber {
    return ethers.utils.parseEther(value.toString());
  }

  static mnemonicToPrivateKey(mnemonic:string) : {
    address: string,
    privateKey: string
  } {
    const hdNode = HDNode.fromMnemonic(mnemonic);
    return {
      address: hdNode.address,
      privateKey: hdNode.privateKey
    };
  }

  static addressFromPrivateKey(privateKey:string) : string {
    return new ethers.Wallet(privateKey, undefined).address;
  }

  static async getBalance(context: ActionExecutionContext, address: string): Promise<BigNumber> {
    return context.ethAdapter.getBalance(address);
  }

  static async transferEth(context: ActionExecutionContext, fromAddress: string, toAddress: string, weiValue: BigNumber) : Promise<TransactionReceipt> {
    const transactionResponse = await context.signer.sendTransaction({
      from: fromAddress,
      to: toAddress,
      value: weiValue.toString(),
      data: "0x"
    });

    return await transactionResponse.wait();
  }
}