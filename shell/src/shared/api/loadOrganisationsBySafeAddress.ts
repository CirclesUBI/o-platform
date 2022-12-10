import {Organisation, OrganisationsByAddressDocument, OrganisationsByAddressQueryVariables} from "./data/types";
import {ApiClient} from "../apiConnection";

export async function loadOrganisationsBySafeAddress(addresses: string[]) : Promise<Organisation[]> {
  return await ApiClient.query<Organisation[], OrganisationsByAddressQueryVariables>(
    OrganisationsByAddressDocument, {
      addresses: addresses.map(o => o.toLowerCase())
    });
}