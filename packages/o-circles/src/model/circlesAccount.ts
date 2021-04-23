import {CirclesHub} from "../circles/circlesHub";
import {CirclesToken} from "./circlesToken";
import {GnosisSafeProxy} from "../safe/gnosisSafeProxy";
import {HUB_ADDRESS, ZERO_ADDRESS} from "../consts";
import {Erc20Token} from "../token/erc20Token";
import {BN} from "ethereumjs-util";
import {SafeOps} from "./safeOps";
import {Observable, Subject} from "rxjs";
import {BlockchainEvent} from "@o-platform/o-events/dist/blockchainEvent";
import {RpcGateway} from "../rpcGateway";

export interface CirclesAccountModel
{
  readonly safeAddress: string;
}

export class CirclesAccount implements CirclesAccountModel
{
  readonly safeAddress: string;

  private readonly web3 = RpcGateway.get();
  private readonly hub:CirclesHub;

  constructor(safeAddress: string)
  {
    this.safeAddress = this.web3.utils.toChecksumAddress(safeAddress);
    this.hub = new CirclesHub(this.web3, HUB_ADDRESS);
  }

  async getUBI(privateKey: string, safe: GnosisSafeProxy): Promise<any>
  {
    const ownToken = await this.tryGetMyToken();
    if (!ownToken)
    {
      throw new Error(`Couldn't find a personal circles token for the safe '${safe.address}'.`);
    }

    const erc20Contract = new Erc20Token(this.web3, ownToken.tokenAddress);
    const txData = erc20Contract.contract.methods.update().encodeABI();

    return await safe.execTransaction(
      privateKey,
      {
        to: ownToken.tokenAddress,
        data: txData,
        value: new BN("0"),
        refundReceiver: ZERO_ADDRESS,
        gasToken: ZERO_ADDRESS,
        operation: SafeOps.CALL
      });
  }

  async tryGetMyToken(): Promise<CirclesToken|null>
  {
    if (!this.safeAddress) {
      throw new Error(`The safe address is not known. Your token cannot be loaded.`)
    }
    const result = await this.hub.queryEvents(CirclesHub.queryPastSignup(this.safeAddress)).toArray();
    if (result.length == 0)
    {
      return null;
    }

    const signupEvent = result[0];

    return new CirclesToken(
        this.safeAddress,
        signupEvent.returnValues.token,
        signupEvent.returnValues.user,
        signupEvent.blockNumber,
        signupEvent.blockNumber
    );
  }

  async tryGetTokensBySafeAddress(safeAddresses: string[]): Promise<CirclesToken[]>
  {
    if (safeAddresses.length == 0) {
      throw new Error(`Trying to get tokens by safe address failed because an empty array was supplied.`)
    }
    const tokensBySafeAddress = await this.hub.queryEvents(
      CirclesHub.queryPastSignups(safeAddresses)
    ).toArray();

    return tokensBySafeAddress.map(signupEvent =>
    {
      return new CirclesToken(
          this.safeAddress,
          signupEvent.returnValues.token,
          signupEvent.returnValues.user,
          signupEvent.blockNumber,
          signupEvent.blockNumber
      );
    });
  }

  async tryGetXDaiBalance(safeOwner?: string): Promise<{
    mySafeXDaiBalance?: BN,
    myAccountXDaiBalance?: BN
  }>
  {
    const balances: {
      mySafeXDaiBalance?: BN,
      myAccountXDaiBalance?: BN
    } = {};

    if (this.safeAddress)
    {
      balances.mySafeXDaiBalance = new BN(await this.web3.eth.getBalance(this.safeAddress))
    }

    if (safeOwner)
    {
      balances.myAccountXDaiBalance = new BN(await this.web3.eth.getBalance(safeOwner))
    }

    return balances;
  }

  subscribeToMyContacts(): Observable<BlockchainEvent>
  {
    const subject = new Subject<BlockchainEvent>();

    if (!this.safeAddress) {
      throw new Error(`The safe address is not known. Your contacts cannot be loaded.`)
    }
    const myIncomingTrusts = this.hub.queryEvents(CirclesHub.queryPastTrusts(undefined, this.safeAddress));
    myIncomingTrusts.events.subscribe(trustEvent =>
    {
      subject.next(trustEvent);
    });

    myIncomingTrusts.execute();

    const myOutgoingTrusts = this.hub.queryEvents(CirclesHub.queryPastTrusts(this.safeAddress, undefined));
    myOutgoingTrusts.events.subscribe(trustEvent =>
    {
      subject.next(trustEvent);
    });

    myOutgoingTrusts.execute();

    return subject;
  }
}
