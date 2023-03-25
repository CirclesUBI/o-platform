import {
  MyProfileDocument, MyProfileQueryVariables,
  Profile, ProfileBySafeAddressDocument, ProfileBySafeAddressQueryVariables,
  ProfilesDocument,
  ProfilesQueryVariables
} from "../../../../../shared/api/data/types";
import {ApiClient} from "../../../../../shared/apiConnection";

export const loadProfile = async (profileIdOrAddress?:number|string) => {
  if (typeof profileIdOrAddress === 'number') {
    const profiles = await ApiClient.query<Profile[], ProfilesQueryVariables>(ProfilesDocument, {
      id: [profileIdOrAddress]
    });
    return profiles && profiles.length > 0
        ? profiles[0]
        : undefined;
  } else if (typeof profileIdOrAddress === 'string') {
    const profiles = await ApiClient.query<Profile[], ProfileBySafeAddressQueryVariables>(ProfileBySafeAddressDocument, {
      safeAddress: profileIdOrAddress
    });
    return profiles && profiles.length > 0
        ? profiles[0]
        : undefined;
  } else {
    const myProfile = await ApiClient.query<Profile, MyProfileQueryVariables>(MyProfileDocument, {});
    return myProfile;
  }
}
