import { EoaData, ProfileData, RegistrationData, SafeData, UbiData } from "./initEvent";
import { ClaimedInvitation, Profile, ProfileEvent, SafeInfo, SessionInfo } from "../../../shared/api/data/types";
import type { OpenloginUserInfo } from "../../../shared/openLogin";

export type InitContext = {
  localStorageSchemaVersion: 1;
  useMockProfileIndex?: number;
  session?: SessionInfo;
  openLoginUserInfo: OpenloginUserInfo;
  registration?: RegistrationData;
  invitation?: ClaimedInvitation;
  profile?: Profile;
  eoa?: EoaData;
  eoaInvitationTransaction?: ProfileEvent;
  safe?: SafeData;
  ubi?: UbiData;
};
