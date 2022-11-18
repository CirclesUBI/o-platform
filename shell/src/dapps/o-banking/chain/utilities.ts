import {ethers} from "ethers";
import {BigNumber, BigNumberish} from "@ethersproject/bignumber";
import {ActionExecutionContext} from "./actions/action";
import {HDNode} from "ethers/lib/utils";

export class Utilities {
  isAddress(value: string): boolean {
    try {
      return !!ethers.utils.getAddress(value);
    } catch {
      return false;
    }
  }

  fromWei(value: BigNumberish): string {
    return ethers.utils.formatEther(value);
  }

  toWei(value: number|string): BigNumber {
    return ethers.utils.parseEther(value.toString());
  }

  mnemonicToPrivateKey(mnemonic:string) : {
    address: string,
    privateKey: string
  } {
    const hdNode = HDNode.fromMnemonic(mnemonic);
    return {
      address: hdNode.address,
      privateKey: hdNode.privateKey
    };
  }

  addressFromPrivateKey(privateKey:string) : string {
    return new ethers.Wallet(privateKey, undefined).address;
  }

  async getBalance(context: ActionExecutionContext, address: string): Promise<BigNumber> {
    return context.ethAdapter.getBalance(address);
  }
}