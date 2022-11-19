import {ActionExecutionContext} from "./actions/action";
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

  async getOwners() : Promise<string[]> {
    const safe = await this.actionExecutionContext.getSafe(this.safeAddress)
    return safe.getOwners();
  }

  async getNonce() {
    const safe = await this.actionExecutionContext.getSafe(this.safeAddress)
    return safe.getNonce();
  }

  async addOwner(newOwner: string): Promise<AddOwnerResultData> {
    return new AddOwner(this.safeAddress, newOwner)
      .execute(this.actionExecutionContext);
  }

  async hubSignupOrganization(): Promise<HubSignupOrganizationResultData> {
    return new HubSignupOrganization(this.safeAddress)
      .execute(this.actionExecutionContext);
  }

  async hubSignupPerson(): Promise<HubSignupPersonResultData> {
    return new HubSignupPerson(this.safeAddress)
      .execute(this.actionExecutionContext);
  }

  async removeOwner(oldOwner: string): Promise<RemoveOwnerResultData> {
    return new RemoveOwner(this.safeAddress, oldOwner)
      .execute(this.actionExecutionContext);
  }

  async requestUbi(): Promise<RequestUbiResultData> {
    return new RequestUbi(this.safeAddress)
      .execute(this.actionExecutionContext);
  }

  async setTrust(trustAddress: string, trustLimit: number): Promise<SetTrustResultData> {
    return new SetTrust(this.safeAddress, trustAddress, trustLimit)
      .execute(this.actionExecutionContext);
  }

  async transferTrough(tokenOwners: string[],
                       sources: string[],
                       destinations: string[],
                       values: BigNumber[]): Promise<TransferThroughResultData> {
    return new TransferThrough(this.safeAddress, tokenOwners, sources, destinations, values)
      .execute(this.actionExecutionContext);
  }
}