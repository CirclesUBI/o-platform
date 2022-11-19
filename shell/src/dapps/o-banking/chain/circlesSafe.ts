import {Action} from "./actions/action";
import {AddOwner, AddOwnerResultData} from "./actions/addOwner";
import {HubSignupOrganization, HubSignupOrganizationResultData} from "./actions/hubSignupOrganization";
import {HubSignupPerson, HubSignupPersonResultData} from "./actions/hubSignupPerson";
import {RemoveOwner, RemoveOwnerResultData} from "./actions/removeOwner";
import {RequestUbi, RequestUbiResultData} from "./actions/requestUbi";
import {SetTrust, SetTrustResultData} from "./actions/setTrust";
import {TransferThrough, TransferThroughResultData} from "./actions/transferThrough";
import {BigNumber, Signer} from "ethers";
import {EthAdapter} from "@gnosis.pm/safe-core-sdk-types";
import {CirclesNetworkConfig} from "./circlesNetworkConfig";
import {DeploySafe} from "./actions/deploySafe";
import {DefaultExecutionContext} from "./actions/defaultExecutionContext";
import {ActionExecutionContext} from "./actions/actionExecutionContext";

export class CirclesSafe {
  readonly safeAddress: string;
  readonly actionExecutionContext: ActionExecutionContext;

  constructor(safeAddress: string, actionExecutionContext: ActionExecutionContext) {
    this.safeAddress = safeAddress;
    this.actionExecutionContext = actionExecutionContext;
  }

  static async deploySafe(
    owners: string[],
    signatureThreshold: number,
    signer: Signer,
    ethAdapter: EthAdapter,
    networkConfig: CirclesNetworkConfig): Promise<CirclesSafe> {

    const actionExecutionContext = new DefaultExecutionContext(signer, ethAdapter, networkConfig);
    const deploySafeResult = await new DeploySafe(owners, signatureThreshold).execute(actionExecutionContext);
    return new CirclesSafe(deploySafeResult.safeAddress, actionExecutionContext);
  }

  async executeAction<T>(action:Action<T>) {
    try {
      return await action.execute(this.actionExecutionContext);
    }
    catch (e) {
      console.error(`An error occurred while executing an action on the chain:`, e);
      throw e;
    }
  }

  async getOwners() : Promise<string[]> {
    const safe = await this.actionExecutionContext.getSafe(this.safeAddress)
    return safe.getOwners();
  }

  async getNonce() {
    const safe = await this.actionExecutionContext.getSafe(this.safeAddress)
    return safe.getNonce();
  }

  async addOwner(newOwner: string): Promise<AddOwnerResultData> {
    return this.executeAction(new AddOwner(this.safeAddress, newOwner));
  }

  async hubSignupOrganization(): Promise<HubSignupOrganizationResultData> {
    return this.executeAction(new HubSignupOrganization(this.safeAddress));
  }

  async hubSignupPerson(): Promise<HubSignupPersonResultData> {
    return this.executeAction(new HubSignupPerson(this.safeAddress));
  }

  async removeOwner(oldOwner: string): Promise<RemoveOwnerResultData> {
    return this.executeAction(new RemoveOwner(this.safeAddress, oldOwner));
  }

  async requestUbi(): Promise<RequestUbiResultData> {
    return this.executeAction(new RequestUbi(this.safeAddress));
  }

  async setTrust(trustAddress: string, trustLimit: number): Promise<SetTrustResultData> {
    return this.executeAction(new SetTrust(this.safeAddress, trustAddress, trustLimit));
  }

  async transferTrough(tokenOwners: string[],
                       sources: string[],
                       destinations: string[],
                       values: BigNumber[]): Promise<TransferThroughResultData> {
    return this.executeAction(new TransferThrough(this.safeAddress, tokenOwners, sources, destinations, values));
  }
}