import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type AcceptMembershipResult = {
  __typename?: 'AcceptMembershipResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};

export enum AccountType {
  Person = 'Person',
  Organisation = 'Organisation'
}

export type AddMemberResult = {
  __typename?: 'AddMemberResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};

export type AggregatePayload = CrcBalances | Erc20Balances | Contacts | Memberships | Members;

export enum AggregateType {
  CrcBalances = 'CrcBalances',
  Erc20Balances = 'Erc20Balances',
  Contacts = 'Contacts',
  Memberships = 'Memberships',
  Members = 'Members',
  Sales = 'Sales'
}

export type AssetBalance = {
  __typename?: 'AssetBalance';
  token_symbol?: Maybe<Scalars['String']>;
  token_address: Scalars['String'];
  token_owner_address: Scalars['String'];
  token_owner_profile?: Maybe<Profile>;
  token_balance: Scalars['String'];
};

export type BaliVillage = {
  __typename?: 'BaliVillage';
  id: Scalars['Int'];
  desa: Scalars['String'];
  kecamatan: Scalars['String'];
  kabupaten: Scalars['String'];
};

export type BusinessCategory = {
  __typename?: 'BusinessCategory';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type Businesses = {
  __typename?: 'Businesses';
  id: Scalars['Int'];
  circlesAddress: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  picture?: Maybe<Scalars['String']>;
  businessHoursMonday?: Maybe<Scalars['String']>;
  businessHoursTuesday?: Maybe<Scalars['String']>;
  businessHoursWednesday?: Maybe<Scalars['String']>;
  businessHoursThursday?: Maybe<Scalars['String']>;
  businessHoursFriday?: Maybe<Scalars['String']>;
  businessHoursSaturday?: Maybe<Scalars['String']>;
  businessHoursSunday?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  locationName?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  businessCategory?: Maybe<Scalars['String']>;
  businessCategoryId?: Maybe<Scalars['Int']>;
};

export type Capability = {
  __typename?: 'Capability';
  type?: Maybe<CapabilityType>;
};

export enum CapabilityType {
  Verify = 'Verify',
  Invite = 'Invite',
  Translate = 'Translate',
  PreviewFeatures = 'PreviewFeatures',
  Tickets = 'Tickets',
  VerifiedByHumanode = 'VerifiedByHumanode'
}

export type ClaimInvitationResult = {
  __typename?: 'ClaimInvitationResult';
  success: Scalars['Boolean'];
  claimedInvitation?: Maybe<ClaimedInvitation>;
};

export type ClaimedInvitation = {
  __typename?: 'ClaimedInvitation';
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
  createdAt: Scalars['String'];
  claimedBy?: Maybe<Profile>;
  claimedByProfileId: Scalars['Int'];
  claimedAt: Scalars['String'];
};

export type CommonTrust = {
  __typename?: 'CommonTrust';
  type: Scalars['String'];
  safeAddress1: Scalars['String'];
  safeAddress2: Scalars['String'];
  profile?: Maybe<Profile>;
};

export type CompareTrustRelationsInput = {
  canSendTo: Scalars['String'];
  compareWith: Array<Scalars['String']>;
};

export type CompareTrustRelationsResult = {
  __typename?: 'CompareTrustRelationsResult';
  canSendTo: Scalars['String'];
  diffs: Array<TrustComparison>;
};

export type Contact = {
  __typename?: 'Contact';
  metadata: Array<ContactPoint>;
  lastContactAt: Scalars['String'];
  contactAddress: Scalars['String'];
  contactAddress_Profile?: Maybe<Profile>;
};

export type ContactAggregateFilter = {
  addresses: Array<Scalars['String']>;
};

export enum ContactDirection {
  In = 'In',
  Out = 'Out'
}

export type ContactFilter = {
  contactSource: Array<Scalars['String']>;
};

export type ContactPoint = {
  __typename?: 'ContactPoint';
  name: Scalars['String'];
  directions: Array<ContactDirection>;
  values: Array<Scalars['String']>;
  timestamps: Array<Scalars['String']>;
};

export type Contacts = IAggregatePayload & {
  __typename?: 'Contacts';
  lastUpdatedAt: Scalars['String'];
  contacts: Array<Contact>;
};

export type CrcBalanceAggregateFilter = {
  tokenAddresses: Array<Scalars['String']>;
};

export type CrcBalanceFilter = {
  lt?: Maybe<Scalars['String']>;
  gt?: Maybe<Scalars['String']>;
};

export type CrcBalances = IAggregatePayload & {
  __typename?: 'CrcBalances';
  lastUpdatedAt: Scalars['String'];
  total?: Maybe<Scalars['String']>;
  balances: Array<AssetBalance>;
};

export type CrcHubTransfer = IEventPayload & {
  __typename?: 'CrcHubTransfer';
  transaction_hash: Scalars['String'];
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  flow: Scalars['String'];
  transfers: Array<CrcTokenTransfer>;
  tags: Array<Tag>;
};

export type CrcMinting = IEventPayload & {
  __typename?: 'CrcMinting';
  transaction_hash: Scalars['String'];
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  value: Scalars['String'];
  token: Scalars['String'];
};

export type CrcSignup = IEventPayload & {
  __typename?: 'CrcSignup';
  transaction_hash: Scalars['String'];
  user: Scalars['String'];
  user_profile?: Maybe<Profile>;
  token: Scalars['String'];
};

export type CrcTokenTransfer = IEventPayload & {
  __typename?: 'CrcTokenTransfer';
  transaction_hash: Scalars['String'];
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  token: Scalars['String'];
  value: Scalars['String'];
};

export type CrcTrust = IEventPayload & {
  __typename?: 'CrcTrust';
  transaction_hash: Scalars['String'];
  address: Scalars['String'];
  address_profile?: Maybe<Profile>;
  can_send_to: Scalars['String'];
  can_send_to_profile?: Maybe<Profile>;
  limit: Scalars['Int'];
};

export type CreateInvitationResult = {
  __typename?: 'CreateInvitationResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  createdInviteEoas: Array<CreatedInvitation>;
};

export type CreateOrganisationResult = {
  __typename?: 'CreateOrganisationResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  organisation?: Maybe<Organisation>;
};

export type CreateTagInput = {
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type CreatedInvitation = {
  __typename?: 'CreatedInvitation';
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
  createdAt: Scalars['String'];
  claimedBy?: Maybe<Profile>;
  claimedByProfileId?: Maybe<Scalars['Int']>;
  claimedAt?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  address: Scalars['String'];
  balance: Scalars['String'];
  code: Scalars['String'];
};

export type CreatedInviteEoa = {
  __typename?: 'CreatedInviteEoa';
  for: Scalars['String'];
  address: Scalars['String'];
  fee: Scalars['String'];
};


export enum Direction {
  In = 'in',
  Out = 'out'
}

export enum DisplayCurrency {
  Crc = 'CRC',
  TimeCrc = 'TIME_CRC',
  Eurs = 'EURS'
}

export type Erc20Balances = IAggregatePayload & {
  __typename?: 'Erc20Balances';
  lastUpdatedAt: Scalars['String'];
  balances: Array<AssetBalance>;
};

export type Erc20Transfer = IEventPayload & {
  __typename?: 'Erc20Transfer';
  transaction_hash: Scalars['String'];
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  token: Scalars['String'];
  value: Scalars['String'];
};

export type EthTransfer = IEventPayload & {
  __typename?: 'EthTransfer';
  transaction_hash: Scalars['String'];
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  value: Scalars['String'];
  tags: Array<Tag>;
};

export type EventPayload = CrcSignup | CrcTrust | CrcTokenTransfer | CrcHubTransfer | CrcMinting | EthTransfer | Erc20Transfer | GnosisSafeEthTransfer | MembershipOffer | MembershipAccepted | MembershipRejected | WelcomeMessage | InvitationCreated | InvitationRedeemed | OrganisationCreated | MemberAdded | SafeVerified | NewUser;

export enum EventType {
  CrcSignup = 'CrcSignup',
  CrcTrust = 'CrcTrust',
  CrcTokenTransfer = 'CrcTokenTransfer',
  CrcHubTransfer = 'CrcHubTransfer',
  Erc20Transfer = 'Erc20Transfer',
  CrcMinting = 'CrcMinting',
  EthTransfer = 'EthTransfer',
  GnosisSafeEthTransfer = 'GnosisSafeEthTransfer',
  MembershipOffer = 'MembershipOffer',
  MembershipAccepted = 'MembershipAccepted',
  MembershipRejected = 'MembershipRejected',
  WelcomeMessage = 'WelcomeMessage',
  InvitationCreated = 'InvitationCreated',
  InvitationRedeemed = 'InvitationRedeemed',
  OrganisationCreated = 'OrganisationCreated',
  MemberAdded = 'MemberAdded',
  SafeVerified = 'SafeVerified',
  NewUser = 'NewUser'
}

export type ExchangeTokenResponse = {
  __typename?: 'ExchangeTokenResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
};

export type ExportProfile = {
  __typename?: 'ExportProfile';
  lastChange: Scalars['Date'];
  circlesAddress: Scalars['String'];
  displayName: Scalars['String'];
  avatarUrl?: Maybe<Scalars['String']>;
};

export type ExportTrustRelation = {
  __typename?: 'ExportTrustRelation';
  lastChange: Scalars['Date'];
  trusterAddress: Scalars['String'];
  trusteeAddress: Scalars['String'];
  trustLimit: Scalars['Int'];
};

export type Favorite = {
  __typename?: 'Favorite';
  createdAt: Scalars['String'];
  createdByAddress: Scalars['String'];
  favorite?: Maybe<Profile>;
  favoriteAddress: Scalars['String'];
  comment?: Maybe<Scalars['String']>;
};

export type FibonacciGoals = {
  __typename?: 'FibonacciGoals';
  lastGoal: Scalars['Int'];
  currentValue: Scalars['Int'];
  nextGoal: Scalars['Int'];
};

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
  Divers = 'DIVERS'
}

export type Geolocation = {
  lat: Scalars['Float'];
  lon: Scalars['Float'];
};

export type GnosisSafeEthTransfer = IEventPayload & {
  __typename?: 'GnosisSafeEthTransfer';
  transaction_hash: Scalars['String'];
  initiator: Scalars['String'];
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  value: Scalars['String'];
  tags: Array<Tag>;
};

export type IAggregatePayload = {
  lastUpdatedAt?: Maybe<Scalars['String']>;
};

export type IEventPayload = {
  transaction_hash?: Maybe<Scalars['String']>;
};

export type InvitationCreated = IEventPayload & {
  __typename?: 'InvitationCreated';
  transaction_hash?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  code: Scalars['String'];
};

export type InvitationRedeemed = IEventPayload & {
  __typename?: 'InvitationRedeemed';
  transaction_hash?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  code: Scalars['String'];
  redeemedBy?: Maybe<Scalars['String']>;
  redeemedBy_profile?: Maybe<Profile>;
};

export type LeaderboardEntry = {
  __typename?: 'LeaderboardEntry';
  createdByCirclesAddress: Scalars['String'];
  createdByProfile?: Maybe<Profile>;
  inviteCount: Scalars['Int'];
};

export enum LinkTargetType {
  Business = 'Business',
  Person = 'Person'
}

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
};

export type MarkAsReadResult = {
  __typename?: 'MarkAsReadResult';
  count: Scalars['Int'];
};

export type MemberAdded = IEventPayload & {
  __typename?: 'MemberAdded';
  transaction_hash?: Maybe<Scalars['String']>;
  createdBy: Scalars['String'];
  createdBy_profile?: Maybe<Profile>;
  member: Scalars['String'];
  member_profile?: Maybe<Profile>;
  isAdmin: Scalars['Boolean'];
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
};

export type Members = IAggregatePayload & {
  __typename?: 'Members';
  lastUpdatedAt: Scalars['String'];
  members: Array<ProfileOrOrganisation>;
};

export type Membership = {
  __typename?: 'Membership';
  createdAt: Scalars['String'];
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
  acceptedAt?: Maybe<Scalars['String']>;
  rejectedAt?: Maybe<Scalars['String']>;
  validTo?: Maybe<Scalars['String']>;
  isAdmin: Scalars['Boolean'];
  organisation: Organisation;
};

export type MembershipAccepted = IEventPayload & {
  __typename?: 'MembershipAccepted';
  transaction_hash?: Maybe<Scalars['String']>;
  createdBy: Scalars['String'];
  createdBy_profile?: Maybe<Profile>;
  member: Scalars['String'];
  member_profile?: Maybe<Profile>;
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
};

export type MembershipOffer = IEventPayload & {
  __typename?: 'MembershipOffer';
  transaction_hash?: Maybe<Scalars['String']>;
  createdBy: Scalars['String'];
  createdBy_profile?: Maybe<Profile>;
  isAdmin: Scalars['Boolean'];
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
};

export type MembershipRejected = IEventPayload & {
  __typename?: 'MembershipRejected';
  transaction_hash?: Maybe<Scalars['String']>;
  member: Scalars['String'];
  member_profile?: Maybe<Profile>;
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
};

export type Memberships = IAggregatePayload & {
  __typename?: 'Memberships';
  lastUpdatedAt: Scalars['String'];
  organisations: Array<Organisation>;
};

export type Mutation = {
  __typename?: 'Mutation';
  getNonce: Nonce;
  sendSignedTransaction: SendSignedTransactionResult;
  logout: LogoutResponse;
  upsertProfile: Profile;
  requestUpdateSafe: RequestUpdateSafeResponse;
  updateSafe: UpdateSafeResponse;
  upsertTag: Tag;
  upsertOrganisation: CreateOrganisationResult;
  addMember?: Maybe<AddMemberResult>;
  acceptMembership?: Maybe<AcceptMembershipResult>;
  removeMember?: Maybe<RemoveMemberResult>;
  rejectMembership?: Maybe<RejectMembershipResult>;
  acknowledge: Scalars['Boolean'];
  createTestInvitation: CreateInvitationResult;
  claimInvitation: ClaimInvitationResult;
  redeemClaimedInvitation: RedeemClaimedInvitationResult;
  tagTransaction: TagTransactionResult;
  sendMessage: SendMessageResult;
  surveyData: SurveyDataResult;
  requestSessionChallenge: Scalars['String'];
  verifySessionChallenge?: Maybe<ExchangeTokenResponse>;
  importOrganisationsOfAccount: Array<Organisation>;
  verifySafe: VerifySafeResult;
  revokeSafeVerification: VerifySafeResult;
  updateValue?: Maybe<I18n>;
  addNewLang?: Maybe<Scalars['Int']>;
  createNewStringAndKey?: Maybe<I18n>;
  setStringUpdateState?: Maybe<I18n>;
  setIsFavorite: Scalars['Boolean'];
  shareLink: Scalars['String'];
  markAsRead: MarkAsReadResult;
};


export type MutationGetNonceArgs = {
  data: NonceRequest;
};


export type MutationSendSignedTransactionArgs = {
  data: SendSignedTransactionInput;
};


export type MutationUpsertProfileArgs = {
  data: UpsertProfileInput;
};


export type MutationRequestUpdateSafeArgs = {
  data: RequestUpdateSafeInput;
};


export type MutationUpdateSafeArgs = {
  data: UpdateSafeInput;
};


export type MutationUpsertTagArgs = {
  data: UpsertTagInput;
};


export type MutationUpsertOrganisationArgs = {
  organisation: UpsertOrganisationInput;
};


export type MutationAddMemberArgs = {
  groupId: Scalars['String'];
  memberAddress: Scalars['String'];
};


export type MutationAcceptMembershipArgs = {
  membershipId: Scalars['Int'];
};


export type MutationRemoveMemberArgs = {
  groupId: Scalars['String'];
  memberAddress: Scalars['String'];
};


export type MutationRejectMembershipArgs = {
  membershipId: Scalars['Int'];
};


export type MutationAcknowledgeArgs = {
  until: Scalars['Date'];
  safeAddress?: Maybe<Scalars['String']>;
};


export type MutationClaimInvitationArgs = {
  code: Scalars['String'];
};


export type MutationTagTransactionArgs = {
  transactionHash: Scalars['String'];
  tag: CreateTagInput;
};


export type MutationSendMessageArgs = {
  fromSafeAddress?: Maybe<Scalars['String']>;
  toSafeAddress: Scalars['String'];
  content: Scalars['String'];
};


export type MutationSurveyDataArgs = {
  data: SurveyDataInput;
};


export type MutationRequestSessionChallengeArgs = {
  address: Scalars['String'];
};


export type MutationVerifySessionChallengeArgs = {
  challenge: Scalars['String'];
  signature: Scalars['String'];
};


export type MutationVerifySafeArgs = {
  safeAddress: Scalars['String'];
};


export type MutationRevokeSafeVerificationArgs = {
  safeAddress: Scalars['String'];
};


export type MutationUpdateValueArgs = {
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};


export type MutationAddNewLangArgs = {
  langToCreate?: Maybe<Scalars['String']>;
  langToCopyFrom?: Maybe<Scalars['String']>;
};


export type MutationCreateNewStringAndKeyArgs = {
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};


export type MutationSetStringUpdateStateArgs = {
  key?: Maybe<Scalars['String']>;
};


export type MutationSetIsFavoriteArgs = {
  circlesAddress: Scalars['String'];
  isFavorite: Scalars['Boolean'];
};


export type MutationShareLinkArgs = {
  targetType: LinkTargetType;
  targetKey: Scalars['String'];
};


export type MutationMarkAsReadArgs = {
  entries: Array<Scalars['Int']>;
};

export type MyInviteRank = {
  __typename?: 'MyInviteRank';
  rank: Scalars['Int'];
  redeemedInvitationsCount: Scalars['Int'];
};

export type NewUser = IEventPayload & {
  __typename?: 'NewUser';
  transaction_hash?: Maybe<Scalars['String']>;
  profile: Profile;
};

export type Nonce = {
  __typename?: 'Nonce';
  nonce: Scalars['Int'];
};

export type NonceRequest = {
  signature: Scalars['String'];
  address?: Maybe<Scalars['String']>;
};

export type NotificationEvent = {
  __typename?: 'NotificationEvent';
  type: Scalars['String'];
  from: Scalars['String'];
  to: Scalars['String'];
  itemId?: Maybe<Scalars['Int']>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type Organisation = {
  __typename?: 'Organisation';
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  circlesAddress?: Maybe<Scalars['String']>;
  circlesSafeOwner?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  largeBannerUrl?: Maybe<Scalars['String']>;
  smallBannerUrl?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  displayCurrency?: Maybe<DisplayCurrency>;
  members?: Maybe<Array<ProfileOrOrganisation>>;
  trustsYou?: Maybe<Scalars['Int']>;
  location?: Maybe<Scalars['String']>;
  locationName?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
};

export type OrganisationCreated = IEventPayload & {
  __typename?: 'OrganisationCreated';
  transaction_hash?: Maybe<Scalars['String']>;
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
};

export type PaginationArgs = {
  continueAt?: Maybe<Scalars['String']>;
  continueAtId?: Maybe<Scalars['Int']>;
  order: SortOrder;
  limit: Scalars['Int'];
};

export type Profile = {
  __typename?: 'Profile';
  id: Scalars['Int'];
  type?: Maybe<ProfileType>;
  origin?: Maybe<ProfileOrigin>;
  status?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  successorOfCirclesAddress?: Maybe<Scalars['String']>;
  circlesSafeOwner?: Maybe<Scalars['String']>;
  circlesTokenAddress?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  confirmedLegalAge?: Maybe<Scalars['Int']>;
  emailAddress?: Maybe<Scalars['String']>;
  askedForEmailAddress: Scalars['Boolean'];
  dream?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  largeBannerUrl?: Maybe<Scalars['String']>;
  smallBannerUrl?: Maybe<Scalars['String']>;
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  newsletter?: Maybe<Scalars['Boolean']>;
  displayTimeCircles?: Maybe<Scalars['Boolean']>;
  claimedInvitation?: Maybe<ClaimedInvitation>;
  canInvite?: Maybe<Scalars['Boolean']>;
  invitationTransaction?: Maybe<ProfileEvent>;
  invitationLink?: Maybe<Scalars['String']>;
  memberships?: Maybe<Array<Membership>>;
  members?: Maybe<Array<Profile>>;
  displayCurrency?: Maybe<DisplayCurrency>;
  verifications?: Maybe<Array<Verification>>;
  balances?: Maybe<ProfileBalances>;
  contacts?: Maybe<Array<Contact>>;
  provenUniqueness?: Maybe<Scalars['Boolean']>;
  age?: Maybe<Scalars['Int']>;
  gender?: Maybe<Gender>;
  location?: Maybe<Scalars['String']>;
  locationName?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  category?: Maybe<BusinessCategory>;
  surveyDataSessionId?: Maybe<Scalars['String']>;
};


export type ProfileBalancesArgs = {
  filter?: Maybe<CrcBalanceFilter>;
};


export type ProfileContactsArgs = {
  filter?: Maybe<ContactFilter>;
};

export type ProfileAggregate = {
  __typename?: 'ProfileAggregate';
  type: Scalars['String'];
  safe_address: Scalars['String'];
  safe_address_profile?: Maybe<Profile>;
  payload: AggregatePayload;
};

export type ProfileAggregateFilter = {
  contacts?: Maybe<ContactAggregateFilter>;
  crcBalance?: Maybe<CrcBalanceAggregateFilter>;
};

export type ProfileBalances = {
  __typename?: 'ProfileBalances';
  crcBalances?: Maybe<CrcBalances>;
  erc20Balances?: Maybe<Erc20Balances>;
};

export type ProfileEvent = {
  __typename?: 'ProfileEvent';
  timestamp: Scalars['String'];
  unread: Scalars['Boolean'];
  block_number?: Maybe<Scalars['Int']>;
  transaction_index?: Maybe<Scalars['Int']>;
  transaction_hash?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  safe_address: Scalars['String'];
  safe_address_profile?: Maybe<Profile>;
  contact_address?: Maybe<Scalars['String']>;
  contact_address_profile?: Maybe<Profile>;
  direction: Scalars['String'];
  value?: Maybe<Scalars['String']>;
  payload?: Maybe<EventPayload>;
  tags?: Maybe<Array<Tag>>;
};

export type ProfileEventFilter = {
  direction?: Maybe<Direction>;
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  with?: Maybe<Scalars['String']>;
  transactionHash?: Maybe<Scalars['String']>;
  unreadOnly?: Maybe<Scalars['Boolean']>;
  readOnly?: Maybe<Scalars['Boolean']>;
};

export type ProfileOrOrganisation = Profile | Organisation;

export enum ProfileOrigin {
  CirclesGarden = 'CirclesGarden',
  CirclesLand = 'CirclesLand',
  Unknown = 'Unknown'
}

export enum ProfileType {
  Person = 'PERSON',
  Organisation = 'ORGANISATION',
  Region = 'REGION'
}

export type PublicEvent = {
  __typename?: 'PublicEvent';
  timestamp: Scalars['String'];
  block_number?: Maybe<Scalars['Int']>;
  transaction_index?: Maybe<Scalars['Int']>;
  transaction_hash?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  contact_address?: Maybe<Scalars['String']>;
  contact_address_profile?: Maybe<Profile>;
  payload?: Maybe<EventPayload>;
};

export type Query = {
  __typename?: 'Query';
  version: Version;
  sessionInfo: SessionInfo;
  init: SessionInfo;
  compareTrustRelations: CompareTrustRelationsResult;
  claimedInvitation?: Maybe<ClaimedInvitation>;
  invitationTransaction?: Maybe<ProfileEvent>;
  hubSignupTransaction?: Maybe<ProfileEvent>;
  safeInfo?: Maybe<SafeInfo>;
  lastAcknowledgedAt?: Maybe<Scalars['Date']>;
  verifications: Array<Verification>;
  events: Array<ProfileEvent>;
  aggregates: Array<ProfileAggregate>;
  organisations: Array<Organisation>;
  regions: Array<Organisation>;
  organisationsByAddress: Array<Organisation>;
  myInvitations: Array<CreatedInvitation>;
  commonTrust: Array<CommonTrust>;
  trustRelations: Array<TrustRelation>;
  myProfile?: Maybe<Profile>;
  profilesById: Array<Profile>;
  recentProfiles: Array<Profile>;
  profilesBySafeAddress: Array<Profile>;
  findSafesByOwner: Array<SafeInfo>;
  search: Array<Profile>;
  stats: Stats;
  tags: Array<Tag>;
  tagById?: Maybe<Tag>;
  findInvitationCreator?: Maybe<Profile>;
  clientAssertionJwt: Scalars['String'];
  getStringByMaxVersion?: Maybe<I18n>;
  getAvailableLanguages?: Maybe<Array<Maybe<I18n>>>;
  getAllStringsByMaxVersion?: Maybe<Array<Maybe<I18n>>>;
  getAllStringsByMaxVersionAndLang?: Maybe<Array<Maybe<I18n>>>;
  getOlderVersionsByKeyAndLang?: Maybe<Array<Maybe<I18n>>>;
  getPaginatedStrings?: Maybe<Array<Maybe<I18n>>>;
  getPaginatedStringsToUpdate?: Maybe<Array<Maybe<I18n>>>;
  getStringsToBeUpdatedAmount?: Maybe<Scalars['Int']>;
  allProfiles: Array<Maybe<ExportProfile>>;
  allTrusts: Array<ExportTrustRelation>;
  getRandomAccount?: Maybe<RandomAccount>;
  signMessage: Scalars['String'];
  directPath: TransitivePath;
  paymentPath: TransitivePath;
  allBaliVillages: Array<BaliVillage>;
  allBusinessCategories: Array<BusinessCategory>;
  allBusinesses: Array<Businesses>;
  myFavorites: Array<Favorite>;
};


export type QueryCompareTrustRelationsArgs = {
  data: CompareTrustRelationsInput;
};


export type QuerySafeInfoArgs = {
  safeAddress?: Maybe<Scalars['String']>;
};


export type QueryLastAcknowledgedAtArgs = {
  safeAddress: Scalars['String'];
};


export type QueryVerificationsArgs = {
  pagination?: Maybe<PaginationArgs>;
  filter?: Maybe<VerifiedSafesFilter>;
};


export type QueryEventsArgs = {
  types: Array<EventType>;
  safeAddress: Scalars['String'];
  pagination: PaginationArgs;
  filter?: Maybe<ProfileEventFilter>;
};


export type QueryAggregatesArgs = {
  types: Array<AggregateType>;
  safeAddress: Scalars['String'];
  filter?: Maybe<ProfileAggregateFilter>;
};


export type QueryOrganisationsArgs = {
  pagination?: Maybe<PaginationArgs>;
};


export type QueryRegionsArgs = {
  pagination?: Maybe<PaginationArgs>;
};


export type QueryOrganisationsByAddressArgs = {
  addresses: Array<Scalars['String']>;
};


export type QueryCommonTrustArgs = {
  safeAddress1: Scalars['String'];
  safeAddress2: Scalars['String'];
};


export type QueryTrustRelationsArgs = {
  safeAddress: Scalars['String'];
};


export type QueryProfilesByIdArgs = {
  ids: Array<Scalars['Int']>;
};


export type QueryRecentProfilesArgs = {
  pagination?: Maybe<PaginationArgs>;
};


export type QueryProfilesBySafeAddressArgs = {
  safeAddresses: Array<Scalars['String']>;
};


export type QueryFindSafesByOwnerArgs = {
  owner: Scalars['String'];
};


export type QuerySearchArgs = {
  query: SearchInput;
};


export type QueryTagsArgs = {
  query: QueryTagsInput;
};


export type QueryTagByIdArgs = {
  id: Scalars['Int'];
};


export type QueryFindInvitationCreatorArgs = {
  code: Scalars['String'];
};


export type QueryGetStringByMaxVersionArgs = {
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
};


export type QueryGetAllStringsByMaxVersionAndLangArgs = {
  lang?: Maybe<Scalars['String']>;
};


export type QueryGetOlderVersionsByKeyAndLangArgs = {
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
};


export type QueryGetPaginatedStringsArgs = {
  pagination_key?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};


export type QueryGetPaginatedStringsToUpdateArgs = {
  pagination_key?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  needsUpdate?: Maybe<Scalars['Boolean']>;
};


export type QueryGetStringsToBeUpdatedAmountArgs = {
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
};


export type QueryAllProfilesArgs = {
  sinceLastChange?: Maybe<Scalars['Date']>;
};


export type QueryAllTrustsArgs = {
  sinceLastChange?: Maybe<Scalars['Date']>;
};


export type QuerySignMessageArgs = {
  message: Scalars['String'];
  key: Scalars['String'];
};


export type QueryDirectPathArgs = {
  from: Scalars['String'];
  to: Scalars['String'];
  amount: Scalars['String'];
};


export type QueryPaymentPathArgs = {
  from: Scalars['String'];
  to: Scalars['String'];
  amount: Scalars['String'];
};


export type QueryAllBusinessesArgs = {
  queryParams?: Maybe<QueryAllBusinessesParameters>;
};

export type QueryAllBusinessesConditions = {
  inCategories?: Maybe<Array<Scalars['Int']>>;
  inCirclesAddress?: Maybe<Array<Scalars['String']>>;
};

export type QueryAllBusinessesOrder = {
  orderBy: QueryAllBusinessesOrderOptions;
};

export enum QueryAllBusinessesOrderOptions {
  Favorites = 'Favorites',
  Newest = 'Newest',
  Oldest = 'Oldest',
  MostPopular = 'MostPopular',
  Nearest = 'Nearest',
  Alphabetical = 'Alphabetical'
}

export type QueryAllBusinessesParameters = {
  where?: Maybe<QueryAllBusinessesConditions>;
  order?: Maybe<QueryAllBusinessesOrder>;
  ownCoordinates?: Maybe<Geolocation>;
};

export type QueryProfileInput = {
  id?: Maybe<Array<Scalars['Int']>>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Array<Scalars['String']>>;
};

export type QueryTagsInput = {
  typeId_in: Array<Scalars['String']>;
  value_like?: Maybe<Scalars['String']>;
};

export type QueryUniqueProfileInput = {
  id: Scalars['Int'];
};

export type RandomAccount = {
  __typename?: 'RandomAccount';
  privateKey?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
};

export type RedeemClaimedInvitationResult = {
  __typename?: 'RedeemClaimedInvitationResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  transactionHash?: Maybe<Scalars['String']>;
};

export type RejectMembershipResult = {
  __typename?: 'RejectMembershipResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};

export type RemoveMemberResult = {
  __typename?: 'RemoveMemberResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};

export type RequestUpdateSafeInput = {
  newSafeAddress: Scalars['String'];
};

export type RequestUpdateSafeResponse = {
  __typename?: 'RequestUpdateSafeResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
  challenge?: Maybe<Scalars['String']>;
};

export type SafeAddressByOwnerResult = {
  __typename?: 'SafeAddressByOwnerResult';
  type: Scalars['String'];
  safeAddress: Scalars['String'];
};

export type SafeInfo = {
  __typename?: 'SafeInfo';
  type: AccountType;
  safeAddress: Scalars['String'];
  lastUbiAt?: Maybe<Scalars['String']>;
  tokenAddress?: Maybe<Scalars['String']>;
  randomValue?: Maybe<Scalars['String']>;
  safeProfile?: Maybe<Profile>;
};

export type SafeVerified = IEventPayload & {
  __typename?: 'SafeVerified';
  transaction_hash?: Maybe<Scalars['String']>;
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
  safe_address: Scalars['String'];
};

export type SearchInput = {
  searchString: Scalars['String'];
  profileType?: Maybe<ProfileType>;
};

export type SendMessageResult = {
  __typename?: 'SendMessageResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  event?: Maybe<ProfileEvent>;
};

export type SendSignedTransactionInput = {
  signedTransaction: Scalars['String'];
};

export type SendSignedTransactionResult = {
  __typename?: 'SendSignedTransactionResult';
  transactionHash: Scalars['String'];
};

export type Server = {
  __typename?: 'Server';
  version: Scalars['String'];
};

export type SessionInfo = {
  __typename?: 'SessionInfo';
  isLoggedOn: Scalars['Boolean'];
  hasProfile?: Maybe<Scalars['Boolean']>;
  profileId?: Maybe<Scalars['Int']>;
  sessionId?: Maybe<Scalars['String']>;
  profile?: Maybe<Profile>;
  capabilities: Array<Capability>;
  useShortSignup?: Maybe<Scalars['Boolean']>;
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Stats = {
  __typename?: 'Stats';
  profilesCount: Scalars['Int'];
  verificationsCount: Scalars['Int'];
  leaderboard: Array<LeaderboardEntry>;
  goals: FibonacciGoals;
  myRank: MyInviteRank;
};

export type Subscription = {
  __typename?: 'Subscription';
  events: NotificationEvent;
};

export type SurveyData = {
  __typename?: 'SurveyData';
  id?: Maybe<Scalars['Int']>;
  sesssionId: Scalars['String'];
  allConsentsGiven: Scalars['Boolean'];
  gender: Scalars['String'];
  villageId: Scalars['Int'];
  dateOfBirth: Scalars['Date'];
};

export type SurveyDataInput = {
  sessionId: Scalars['String'];
  allConsentsGiven: Scalars['Boolean'];
  gender: Scalars['String'];
  villageId: Scalars['Int'];
  dateOfBirth: Scalars['Date'];
};

export type SurveyDataResult = {
  __typename?: 'SurveyDataResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  surveyData?: Maybe<SurveyData>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['Int'];
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['Int']>;
};

export type TagTransactionResult = {
  __typename?: 'TagTransactionResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  tag?: Maybe<Tag>;
};

export type TransitivePath = {
  __typename?: 'TransitivePath';
  requestedAmount: Scalars['String'];
  flow: Scalars['String'];
  isValid: Scalars['Boolean'];
  transfers: Array<TransitiveTransfer>;
};

export type TransitiveTransfer = {
  __typename?: 'TransitiveTransfer';
  from: Scalars['String'];
  to: Scalars['String'];
  token?: Maybe<Scalars['String']>;
  tokenOwner: Scalars['String'];
  value: Scalars['String'];
};

export type TrustComparison = {
  __typename?: 'TrustComparison';
  canSendTo: Scalars['String'];
  differences: Array<TrustDifference>;
};

export type TrustDifference = {
  __typename?: 'TrustDifference';
  operation: Scalars['String'];
  user: Scalars['String'];
};

export enum TrustDirection {
  In = 'IN',
  Out = 'OUT',
  Mutual = 'MUTUAL'
}

export type TrustRelation = {
  __typename?: 'TrustRelation';
  safeAddress: Scalars['String'];
  safeAddressProfile?: Maybe<Profile>;
  otherSafeAddress: Scalars['String'];
  otherSafeAddressProfile?: Maybe<Profile>;
  direction: TrustDirection;
};

export type UpdateSafeInput = {
  signature: Scalars['String'];
};

export type UpdateSafeResponse = {
  __typename?: 'UpdateSafeResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
  newSafeAddress?: Maybe<Scalars['String']>;
};

export type UpsertOrganisationInput = {
  id?: Maybe<Scalars['Int']>;
  firstName: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  largeBannerUrl?: Maybe<Scalars['String']>;
  smallBannerUrl?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  displayCurrency?: Maybe<DisplayCurrency>;
  location?: Maybe<Scalars['String']>;
  locationName?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  businessCategoryId?: Maybe<Scalars['Int']>;
  businessHoursMonday?: Maybe<Scalars['String']>;
  businessHoursTuesday?: Maybe<Scalars['String']>;
  businessHoursWednesday?: Maybe<Scalars['String']>;
  businessHoursThursday?: Maybe<Scalars['String']>;
  businessHoursFriday?: Maybe<Scalars['String']>;
  businessHoursSaturday?: Maybe<Scalars['String']>;
  businessHoursSunday?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
};

export type UpsertProfileInput = {
  id?: Maybe<Scalars['Int']>;
  status: Scalars['String'];
  firstName: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  dream?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  emailAddress?: Maybe<Scalars['String']>;
  askedForEmailAddress?: Maybe<Scalars['Boolean']>;
  successorOfCirclesAddress?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  circlesSafeOwner?: Maybe<Scalars['String']>;
  circlesTokenAddress?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  newsletter?: Maybe<Scalars['Boolean']>;
  displayTimeCircles?: Maybe<Scalars['Boolean']>;
  displayCurrency?: Maybe<DisplayCurrency>;
  age?: Maybe<Scalars['Int']>;
  gender?: Maybe<Gender>;
  location?: Maybe<Scalars['String']>;
  locationName?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  surveyDataSessionId?: Maybe<Scalars['String']>;
};

export type UpsertTagInput = {
  id?: Maybe<Scalars['Int']>;
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type Verification = {
  __typename?: 'Verification';
  createdAt: Scalars['String'];
  verifierSafeAddress: Scalars['String'];
  verifierProfile?: Maybe<Organisation>;
  verifiedSafeAddress: Scalars['String'];
  verifiedProfile?: Maybe<Profile>;
  revokedAt?: Maybe<Scalars['String']>;
  revokedProfile?: Maybe<Profile>;
  verificationRewardTransactionHash: Scalars['String'];
  verificationRewardTransaction?: Maybe<ProfileEvent>;
};

export type VerifiedSafesFilter = {
  addresses?: Maybe<Array<Scalars['String']>>;
};

export type VerifySafeResult = {
  __typename?: 'VerifySafeResult';
  success: Scalars['Boolean'];
};

export type Version = {
  __typename?: 'Version';
  major: Scalars['Int'];
  minor: Scalars['Int'];
  revision: Scalars['Int'];
};

export type WelcomeMessage = IEventPayload & {
  __typename?: 'WelcomeMessage';
  transaction_hash?: Maybe<Scalars['String']>;
  invitedBy: Scalars['String'];
  invitedBy_profile?: Maybe<Profile>;
};

export type I18n = {
  __typename?: 'i18n';
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['String']>;
  pagination_key?: Maybe<Scalars['String']>;
  needsUpdate?: Maybe<Scalars['Boolean']>;
};

export type RequestSessionChallengeMutationVariables = Exact<{
  address: Scalars['String'];
}>;


export type RequestSessionChallengeMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'requestSessionChallenge'>
);

export type VerifySessionChallengeMutationVariables = Exact<{
  challenge: Scalars['String'];
  signature: Scalars['String'];
}>;


export type VerifySessionChallengeMutation = (
  { __typename?: 'Mutation' }
  & { verifySessionChallenge?: Maybe<(
    { __typename?: 'ExchangeTokenResponse' }
    & Pick<ExchangeTokenResponse, 'success' | 'errorMessage'>
  )> }
);

export type AddNewLangMutationVariables = Exact<{
  langToCreate?: Maybe<Scalars['String']>;
  langToCopyFrom?: Maybe<Scalars['String']>;
}>;


export type AddNewLangMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addNewLang'>
);

export type UpdateValueMutationVariables = Exact<{
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
}>;


export type UpdateValueMutation = (
  { __typename?: 'Mutation' }
  & { updateValue?: Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'value' | 'version'>
  )> }
);

export type CreateNewStringAndKeyMutationVariables = Exact<{
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['String']>;
}>;


export type CreateNewStringAndKeyMutation = (
  { __typename?: 'Mutation' }
  & { createNewStringAndKey?: Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value' | 'needsUpdate'>
  )> }
);

export type SetStringUpdateStateMutationVariables = Exact<{
  key?: Maybe<Scalars['String']>;
}>;


export type SetStringUpdateStateMutation = (
  { __typename?: 'Mutation' }
  & { setStringUpdateState?: Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value' | 'needsUpdate'>
  )> }
);

export type ClaimInvitationMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type ClaimInvitationMutation = (
  { __typename?: 'Mutation' }
  & { claimInvitation: (
    { __typename?: 'ClaimInvitationResult' }
    & Pick<ClaimInvitationResult, 'success'>
    & { claimedInvitation?: Maybe<(
      { __typename?: 'ClaimedInvitation' }
      & Pick<ClaimedInvitation, 'createdAt' | 'createdByProfileId' | 'claimedAt' | 'claimedByProfileId'>
    )> }
  ) }
);

export type AcknowledgeMutationVariables = Exact<{
  until: Scalars['Date'];
  safeAddress?: Maybe<Scalars['String']>;
}>;


export type AcknowledgeMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'acknowledge'>
);

export type AddMemberMutationVariables = Exact<{
  groupId: Scalars['String'];
  memberAddress: Scalars['String'];
}>;


export type AddMemberMutation = (
  { __typename?: 'Mutation' }
  & { addMember?: Maybe<(
    { __typename?: 'AddMemberResult' }
    & Pick<AddMemberResult, 'error' | 'success'>
  )> }
);

export type RemoveMemberMutationVariables = Exact<{
  groupId: Scalars['String'];
  memberAddress: Scalars['String'];
}>;


export type RemoveMemberMutation = (
  { __typename?: 'Mutation' }
  & { removeMember?: Maybe<(
    { __typename?: 'RemoveMemberResult' }
    & Pick<RemoveMemberResult, 'error' | 'success'>
  )> }
);

export type RedeemClaimedInvitationMutationVariables = Exact<{ [key: string]: never; }>;


export type RedeemClaimedInvitationMutation = (
  { __typename?: 'Mutation' }
  & { redeemClaimedInvitation: (
    { __typename?: 'RedeemClaimedInvitationResult' }
    & Pick<RedeemClaimedInvitationResult, 'success' | 'error' | 'transactionHash'>
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & { logout: (
    { __typename?: 'LogoutResponse' }
    & Pick<LogoutResponse, 'success'>
  ) }
);

export type TagTransactionMutationVariables = Exact<{
  transactionHash: Scalars['String'];
  tag: CreateTagInput;
}>;


export type TagTransactionMutation = (
  { __typename?: 'Mutation' }
  & { tagTransaction: (
    { __typename?: 'TagTransactionResult' }
    & Pick<TagTransactionResult, 'success' | 'error'>
    & { tag?: Maybe<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'typeId' | 'value'>
    )> }
  ) }
);

export type UpsertProfileMutationVariables = Exact<{
  id?: Maybe<Scalars['Int']>;
  firstName: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  emailAddress?: Maybe<Scalars['String']>;
  askedForEmailAddress: Scalars['Boolean'];
  dream?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  circlesSafeOwner?: Maybe<Scalars['String']>;
  newsletter?: Maybe<Scalars['Boolean']>;
  displayCurrency?: Maybe<DisplayCurrency>;
  displayTimeCircles?: Maybe<Scalars['Boolean']>;
  status: Scalars['String'];
  successorOfCirclesAddress?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  location?: Maybe<Scalars['String']>;
  locationName?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  surveyDataSessionId?: Maybe<Scalars['String']>;
}>;


export type UpsertProfileMutation = (
  { __typename?: 'Mutation' }
  & { upsertProfile: (
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'invitationLink' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'emailAddress' | 'askedForEmailAddress' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'newsletter' | 'displayTimeCircles' | 'gender' | 'location' | 'locationName' | 'lat' | 'lon'>
    & { memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'firstName' | 'description' | 'avatarUrl'>
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'firstName'>
      )> }
    )>> }
  ) }
);

export type UpsertOrganisationMutationVariables = Exact<{
  organisation: UpsertOrganisationInput;
}>;


export type UpsertOrganisationMutation = (
  { __typename?: 'Mutation' }
  & { upsertOrganisation: (
    { __typename?: 'CreateOrganisationResult' }
    & Pick<CreateOrganisationResult, 'success' | 'error'>
    & { organisation?: Maybe<(
      { __typename?: 'Organisation' }
      & Pick<Organisation, 'id' | 'avatarMimeType' | 'avatarUrl' | 'circlesAddress' | 'circlesSafeOwner' | 'createdAt' | 'description' | 'firstName' | 'location' | 'locationName' | 'lat' | 'lon'>
    )> }
  ) }
);

export type ImportOrganisationsMutationVariables = Exact<{ [key: string]: never; }>;


export type ImportOrganisationsMutation = (
  { __typename?: 'Mutation' }
  & { importOrganisationsOfAccount: Array<(
    { __typename?: 'Organisation' }
    & Pick<Organisation, 'id' | 'circlesAddress' | 'firstName' | 'description' | 'avatarUrl'>
  )> }
);

export type VerifySafeMutationVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type VerifySafeMutation = (
  { __typename?: 'Mutation' }
  & { verifySafe: (
    { __typename?: 'VerifySafeResult' }
    & Pick<VerifySafeResult, 'success'>
  ) }
);

export type RevokeSafeVerificationMutationVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type RevokeSafeVerificationMutation = (
  { __typename?: 'Mutation' }
  & { revokeSafeVerification: (
    { __typename?: 'VerifySafeResult' }
    & Pick<VerifySafeResult, 'success'>
  ) }
);

export type SetIsFavoriteMutationVariables = Exact<{
  circlesAddress: Scalars['String'];
  isFavorite: Scalars['Boolean'];
}>;


export type SetIsFavoriteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'setIsFavorite'>
);

export type ShareLinkMutationVariables = Exact<{
  targetType: LinkTargetType;
  targetKey: Scalars['String'];
}>;


export type ShareLinkMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'shareLink'>
);

export type SurveyDataMutationVariables = Exact<{
  surveyData: SurveyDataInput;
}>;


export type SurveyDataMutation = (
  { __typename?: 'Mutation' }
  & { surveyData: (
    { __typename?: 'SurveyDataResult' }
    & Pick<SurveyDataResult, 'success' | 'error'>
    & { surveyData?: Maybe<(
      { __typename?: 'SurveyData' }
      & Pick<SurveyData, 'id' | 'sesssionId'>
    )> }
  ) }
);

export type GetNonceForEoaMutationVariables = Exact<{
  signature: Scalars['String'];
}>;


export type GetNonceForEoaMutation = (
  { __typename?: 'Mutation' }
  & { getNonce: (
    { __typename?: 'Nonce' }
    & Pick<Nonce, 'nonce'>
  ) }
);

export type GetNonceForSafeMutationVariables = Exact<{
  signature: Scalars['String'];
  safeAddress: Scalars['String'];
}>;


export type GetNonceForSafeMutation = (
  { __typename?: 'Mutation' }
  & { getNonce: (
    { __typename?: 'Nonce' }
    & Pick<Nonce, 'nonce'>
  ) }
);

export type SendSignedTransactionMutationVariables = Exact<{
  signedTransaction: Scalars['String'];
}>;


export type SendSignedTransactionMutation = (
  { __typename?: 'Mutation' }
  & { sendSignedTransaction: (
    { __typename?: 'SendSignedTransactionResult' }
    & Pick<SendSignedTransactionResult, 'transactionHash'>
  ) }
);

export type InitQueryVariables = Exact<{ [key: string]: never; }>;


export type InitQuery = (
  { __typename?: 'Query' }
  & { init: (
    { __typename?: 'SessionInfo' }
    & Pick<SessionInfo, 'isLoggedOn' | 'hasProfile' | 'profileId' | 'useShortSignup'>
    & { capabilities: Array<(
      { __typename?: 'Capability' }
      & Pick<Capability, 'type'>
    )>, profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'invitationLink' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'emailAddress' | 'askedForEmailAddress' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'newsletter' | 'displayTimeCircles' | 'provenUniqueness' | 'location' | 'locationName' | 'lat' | 'lon' | 'canInvite' | 'circlesTokenAddress'>
      & { memberships?: Maybe<Array<(
        { __typename?: 'Membership' }
        & Pick<Membership, 'isAdmin'>
        & { organisation: (
          { __typename?: 'Organisation' }
          & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'firstName' | 'description' | 'avatarUrl'>
        ) }
      )>>, verifications?: Maybe<Array<(
        { __typename?: 'Verification' }
        & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
        & { verifierProfile?: Maybe<(
          { __typename?: 'Organisation' }
          & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'firstName'>
        )> }
      )>>, claimedInvitation?: Maybe<(
        { __typename?: 'ClaimedInvitation' }
        & Pick<ClaimedInvitation, 'claimedAt'>
      )>, invitationTransaction?: Maybe<(
        { __typename?: 'ProfileEvent' }
        & Pick<ProfileEvent, 'timestamp' | 'transaction_hash'>
      )> }
    )> }
  ) }
);

export type LastAcknowledgedAtQueryVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type LastAcknowledgedAtQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'lastAcknowledgedAt'>
);

export type SessionInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type SessionInfoQuery = (
  { __typename?: 'Query' }
  & { sessionInfo: (
    { __typename?: 'SessionInfo' }
    & Pick<SessionInfo, 'isLoggedOn' | 'hasProfile' | 'profileId' | 'sessionId' | 'useShortSignup'>
    & { capabilities: Array<(
      { __typename?: 'Capability' }
      & Pick<Capability, 'type'>
    )> }
  ) }
);

export type ClaimedInvitationQueryVariables = Exact<{ [key: string]: never; }>;


export type ClaimedInvitationQuery = (
  { __typename?: 'Query' }
  & { claimedInvitation?: Maybe<(
    { __typename?: 'ClaimedInvitation' }
    & Pick<ClaimedInvitation, 'createdAt' | 'createdByProfileId' | 'claimedAt' | 'claimedByProfileId'>
  )> }
);

export type InvitationTransactionQueryVariables = Exact<{ [key: string]: never; }>;


export type InvitationTransactionQuery = (
  { __typename?: 'Query' }
  & { invitationTransaction?: Maybe<(
    { __typename?: 'ProfileEvent' }
    & Pick<ProfileEvent, 'transaction_hash'>
  )> }
);

export type HubSignupTransactionQueryVariables = Exact<{ [key: string]: never; }>;


export type HubSignupTransactionQuery = (
  { __typename?: 'Query' }
  & { hubSignupTransaction?: Maybe<(
    { __typename?: 'ProfileEvent' }
    & Pick<ProfileEvent, 'transaction_hash'>
    & { payload?: Maybe<(
      { __typename?: 'CrcSignup' }
      & Pick<CrcSignup, 'token'>
    ) | { __typename?: 'CrcTrust' } | { __typename?: 'CrcTokenTransfer' } | { __typename?: 'CrcHubTransfer' } | { __typename?: 'CrcMinting' } | { __typename?: 'EthTransfer' } | { __typename?: 'Erc20Transfer' } | { __typename?: 'GnosisSafeEthTransfer' } | { __typename?: 'MembershipOffer' } | { __typename?: 'MembershipAccepted' } | { __typename?: 'MembershipRejected' } | { __typename?: 'WelcomeMessage' } | { __typename?: 'InvitationCreated' } | { __typename?: 'InvitationRedeemed' } | { __typename?: 'OrganisationCreated' } | { __typename?: 'MemberAdded' } | { __typename?: 'SafeVerified' } | { __typename?: 'NewUser' }> }
  )> }
);

export type SafeInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type SafeInfoQuery = (
  { __typename?: 'Query' }
  & { safeInfo?: Maybe<(
    { __typename?: 'SafeInfo' }
    & Pick<SafeInfo, 'lastUbiAt' | 'safeAddress' | 'tokenAddress' | 'randomValue'>
  )> }
);

export type FindSafesByOwnerQueryVariables = Exact<{
  owner: Scalars['String'];
}>;


export type FindSafesByOwnerQuery = (
  { __typename?: 'Query' }
  & { findSafesByOwner: Array<(
    { __typename?: 'SafeInfo' }
    & Pick<SafeInfo, 'type' | 'safeAddress' | 'lastUbiAt' | 'randomValue' | 'tokenAddress'>
    & { safeProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'avatarUrl'>
    )> }
  )> }
);

export type MyInvitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyInvitationsQuery = (
  { __typename?: 'Query' }
  & { myInvitations: Array<(
    { __typename?: 'CreatedInvitation' }
    & Pick<CreatedInvitation, 'createdAt' | 'claimedAt' | 'name' | 'address' | 'balance' | 'code'>
    & { claimedBy?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl'>
    )> }
  )> }
);

export type MyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProfileQuery = (
  { __typename?: 'Query' }
  & { myProfile?: Maybe<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'invitationLink' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'emailAddress' | 'askedForEmailAddress' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'newsletter' | 'displayTimeCircles' | 'canInvite' | 'provenUniqueness' | 'location' | 'locationName' | 'type'>
    & { memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'firstName' | 'description' | 'avatarUrl' | 'location' | 'locationName'>
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'firstName'>
      )> }
    )>> }
  )> }
);

export type ProfilesQueryVariables = Exact<{
  id: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type ProfilesQuery = (
  { __typename?: 'Query' }
  & { profilesById: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'avatarUrl' | 'type' | 'provenUniqueness'>
    & { memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'firstName' | 'description' | 'avatarUrl'>
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'firstName' | 'displayName'>
      )> }
    )>> }
  )> }
);

export type ProfilesByNameQueryVariables = Exact<{
  searchString: Scalars['String'];
  profileType?: Maybe<ProfileType>;
}>;


export type ProfilesByNameQuery = (
  { __typename?: 'Query' }
  & { search: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'origin' | 'circlesSafeOwner' | 'circlesAddress' | 'displayCurrency' | 'successorOfCirclesAddress' | 'avatarUrl' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'country' | 'type' | 'provenUniqueness'>
    & { verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'firstName' | 'displayName'>
      )> }
    )>> }
  )> }
);

export type GetRecentProfilesQueryVariables = Exact<{
  pagination?: Maybe<PaginationArgs>;
}>;


export type GetRecentProfilesQuery = (
  { __typename?: 'Query' }
  & { recentProfiles: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'origin' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'provenUniqueness'>
    & { verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'firstName' | 'displayName'>
      )> }
    )>> }
  )> }
);

export type ProfilesByCirclesAddressQueryVariables = Exact<{
  circlesAddresses: Array<Scalars['String']> | Scalars['String'];
}>;


export type ProfilesByCirclesAddressQuery = (
  { __typename?: 'Query' }
  & { profilesBySafeAddress: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'origin' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'avatarUrl' | 'provenUniqueness' | 'location' | 'locationName' | 'lat' | 'lon' | 'type'>
    & { memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'firstName' | 'description' | 'avatarUrl'>
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'firstName' | 'displayName'>
      )> }
    )>> }
  )> }
);

export type ProfilesByIdsQueryVariables = Exact<{
  id: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type ProfilesByIdsQuery = (
  { __typename?: 'Query' }
  & { profilesById: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'origin' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'avatarUrl' | 'provenUniqueness' | 'location' | 'locationName' | 'lat' | 'lon'>
    & { verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'firstName' | 'displayName'>
      )> }
    )>> }
  )> }
);

export type TrustRelationsQueryVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type TrustRelationsQuery = (
  { __typename?: 'Query' }
  & { trustRelations: Array<(
    { __typename?: 'TrustRelation' }
    & Pick<TrustRelation, 'safeAddress' | 'direction' | 'otherSafeAddress'>
    & { safeAddressProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'origin' | 'avatarUrl' | 'successorOfCirclesAddress' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness' | 'location' | 'locationName' | 'lat' | 'lon'>
    )>, otherSafeAddressProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'successorOfCirclesAddress' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness' | 'location' | 'locationName' | 'lat' | 'lon'>
      & { verifications?: Maybe<Array<(
        { __typename?: 'Verification' }
        & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
        & { verifierProfile?: Maybe<(
          { __typename?: 'Organisation' }
          & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'firstName'>
        )> }
      )>> }
    )> }
  )> }
);

export type ProfileByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ProfileByIdQuery = (
  { __typename?: 'Query' }
  & { profilesById: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'successorOfCirclesAddress' | 'circlesSafeOwner' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'provenUniqueness' | 'location' | 'locationName' | 'lat' | 'lon'>
    & { verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'firstName' | 'displayName'>
      )> }
    )>> }
  )> }
);

export type ProfileBySafeAddressQueryVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type ProfileBySafeAddressQuery = (
  { __typename?: 'Query' }
  & { profilesBySafeAddress: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'invitationLink' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'emailAddress' | 'askedForEmailAddress' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'newsletter' | 'canInvite' | 'displayTimeCircles' | 'provenUniqueness' | 'location' | 'locationName' | 'lat' | 'lon' | 'circlesTokenAddress'>
    & { memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'firstName' | 'description' | 'avatarUrl'>
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'firstName'>
      )> }
    )>>, claimedInvitation?: Maybe<(
      { __typename?: 'ClaimedInvitation' }
      & Pick<ClaimedInvitation, 'claimedAt'>
    )>, invitationTransaction?: Maybe<(
      { __typename?: 'ProfileEvent' }
      & Pick<ProfileEvent, 'timestamp' | 'transaction_hash'>
    )> }
  )> }
);

export type TagsQueryVariables = Exact<{
  typeId_in: Array<Scalars['String']> | Scalars['String'];
  value_like?: Maybe<Scalars['String']>;
}>;


export type TagsQuery = (
  { __typename?: 'Query' }
  & { tags: Array<(
    { __typename?: 'Tag' }
    & Pick<Tag, 'typeId' | 'id' | 'value' | 'order'>
  )> }
);

export type OrganisationsQueryVariables = Exact<{
  pagination?: Maybe<PaginationArgs>;
}>;


export type OrganisationsQuery = (
  { __typename?: 'Query' }
  & { organisations: Array<(
    { __typename?: 'Organisation' }
    & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'createdAt' | 'firstName' | 'avatarUrl' | 'location' | 'locationName'>
  )> }
);

export type RegionsQueryVariables = Exact<{ [key: string]: never; }>;


export type RegionsQuery = (
  { __typename?: 'Query' }
  & { regions: Array<(
    { __typename?: 'Organisation' }
    & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'createdAt' | 'firstName' | 'avatarUrl'>
  )> }
);

export type OrganisationsByAddressQueryVariables = Exact<{
  addresses: Array<Scalars['String']> | Scalars['String'];
}>;


export type OrganisationsByAddressQuery = (
  { __typename?: 'Query' }
  & { organisationsByAddress: Array<(
    { __typename?: 'Organisation' }
    & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'createdAt' | 'firstName' | 'avatarUrl' | 'displayName' | 'location' | 'locationName'>
    & { members?: Maybe<Array<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'successorOfCirclesAddress' | 'circlesSafeOwner' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'provenUniqueness'>
      & { verifications?: Maybe<Array<(
        { __typename?: 'Verification' }
        & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
        & { verifierProfile?: Maybe<(
          { __typename?: 'Organisation' }
          & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'firstName'>
        )> }
      )>> }
    ) | (
      { __typename?: 'Organisation' }
      & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'createdAt' | 'firstName' | 'displayName' | 'avatarUrl'>
    )>> }
  )> }
);

export type CommonTrustQueryVariables = Exact<{
  safeAddress1: Scalars['String'];
  safeAddress2: Scalars['String'];
}>;


export type CommonTrustQuery = (
  { __typename?: 'Query' }
  & { commonTrust: Array<(
    { __typename?: 'CommonTrust' }
    & Pick<CommonTrust, 'type' | 'safeAddress1' | 'safeAddress2'>
    & { profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'successorOfCirclesAddress' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
    )> }
  )> }
);

export type TagByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type TagByIdQuery = (
  { __typename?: 'Query' }
  & { tagById?: Maybe<(
    { __typename?: 'Tag' }
    & Pick<Tag, 'id' | 'typeId' | 'value'>
  )> }
);

export type StreamQueryVariables = Exact<{
  types: Array<EventType> | EventType;
  safeAddress: Scalars['String'];
  pagination: PaginationArgs;
  filter?: Maybe<ProfileEventFilter>;
}>;


export type StreamQuery = (
  { __typename?: 'Query' }
  & { events: Array<(
    { __typename?: 'ProfileEvent' }
    & Pick<ProfileEvent, 'timestamp' | 'transaction_hash' | 'block_number' | 'safe_address' | 'contact_address' | 'direction' | 'type' | 'unread'>
    & { contact_address_profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'type' | 'successorOfCirclesAddress' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'provenUniqueness'>
    )>, payload?: Maybe<(
      { __typename?: 'CrcSignup' }
      & Pick<CrcSignup, 'transaction_hash' | 'user' | 'token'>
    ) | (
      { __typename?: 'CrcTrust' }
      & Pick<CrcTrust, 'transaction_hash' | 'address' | 'can_send_to' | 'limit'>
      & { can_send_to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )> }
    ) | { __typename?: 'CrcTokenTransfer' } | (
      { __typename?: 'CrcHubTransfer' }
      & Pick<CrcHubTransfer, 'transaction_hash' | 'from' | 'to' | 'flow'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, transfers: Array<(
        { __typename?: 'CrcTokenTransfer' }
        & Pick<CrcTokenTransfer, 'token' | 'from' | 'to' | 'value'>
        & { from_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
        )>, to_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
        )> }
      )>, tags: Array<(
        { __typename?: 'Tag' }
        & Pick<Tag, 'id' | 'typeId' | 'value'>
      )> }
    ) | (
      { __typename?: 'CrcMinting' }
      & Pick<CrcMinting, 'transaction_hash' | 'token' | 'from' | 'to' | 'value'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )> }
    ) | (
      { __typename?: 'EthTransfer' }
      & Pick<EthTransfer, 'transaction_hash' | 'from' | 'to' | 'value'>
    ) | (
      { __typename?: 'Erc20Transfer' }
      & Pick<Erc20Transfer, 'transaction_hash' | 'from' | 'to' | 'value'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )> }
    ) | (
      { __typename?: 'GnosisSafeEthTransfer' }
      & Pick<GnosisSafeEthTransfer, 'transaction_hash' | 'initiator' | 'from' | 'to' | 'value'>
    ) | (
      { __typename?: 'MembershipOffer' }
      & Pick<MembershipOffer, 'createdBy' | 'organisation' | 'isAdmin'>
      & { createdBy_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'firstName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'locationName' | 'location'>
      )> }
    ) | (
      { __typename?: 'MembershipAccepted' }
      & Pick<MembershipAccepted, 'createdBy' | 'member' | 'organisation'>
      & { member_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'firstName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'locationName' | 'location'>
      )> }
    ) | (
      { __typename?: 'MembershipRejected' }
      & Pick<MembershipRejected, 'member' | 'organisation'>
      & { member_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'firstName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'locationName' | 'location'>
      )> }
    ) | (
      { __typename?: 'WelcomeMessage' }
      & Pick<WelcomeMessage, 'invitedBy'>
      & { invitedBy_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )> }
    ) | (
      { __typename?: 'InvitationCreated' }
      & Pick<InvitationCreated, 'name' | 'code'>
    ) | (
      { __typename?: 'InvitationRedeemed' }
      & Pick<InvitationRedeemed, 'name' | 'code' | 'redeemedBy'>
      & { redeemedBy_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )> }
    ) | (
      { __typename?: 'OrganisationCreated' }
      & Pick<OrganisationCreated, 'organisation'>
      & { organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'firstName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'locationName' | 'location'>
      )> }
    ) | (
      { __typename?: 'MemberAdded' }
      & Pick<MemberAdded, 'createdBy' | 'isAdmin' | 'member' | 'organisation'>
      & { organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'firstName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'locationName' | 'location'>
      )> }
    ) | (
      { __typename?: 'SafeVerified' }
      & Pick<SafeVerified, 'safe_address'>
      & { organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'firstName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'locationName' | 'location'>
      )> }
    ) | (
      { __typename?: 'NewUser' }
      & { profile: (
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      ) }
    )> }
  )> }
);

export type AggregatesQueryVariables = Exact<{
  types: Array<AggregateType> | AggregateType;
  safeAddress: Scalars['String'];
  filter?: Maybe<ProfileAggregateFilter>;
}>;


export type AggregatesQuery = (
  { __typename?: 'Query' }
  & { aggregates: Array<(
    { __typename?: 'ProfileAggregate' }
    & Pick<ProfileAggregate, 'type' | 'safe_address'>
    & { safe_address_profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
    )>, payload: (
      { __typename?: 'CrcBalances' }
      & Pick<CrcBalances, 'lastUpdatedAt'>
      & { balances: Array<(
        { __typename?: 'AssetBalance' }
        & Pick<AssetBalance, 'token_address' | 'token_owner_address' | 'token_balance'>
        & { token_owner_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
        )> }
      )> }
    ) | (
      { __typename?: 'Erc20Balances' }
      & Pick<Erc20Balances, 'lastUpdatedAt'>
      & { balances: Array<(
        { __typename?: 'AssetBalance' }
        & Pick<AssetBalance, 'token_address' | 'token_owner_address' | 'token_balance'>
        & { token_owner_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
        )> }
      )> }
    ) | (
      { __typename?: 'Contacts' }
      & Pick<Contacts, 'lastUpdatedAt'>
      & { contacts: Array<(
        { __typename?: 'Contact' }
        & Pick<Contact, 'lastContactAt' | 'contactAddress'>
        & { metadata: Array<(
          { __typename?: 'ContactPoint' }
          & Pick<ContactPoint, 'name' | 'directions' | 'values' | 'timestamps'>
        )>, contactAddress_Profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'type' | 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
          & { memberships?: Maybe<Array<(
            { __typename?: 'Membership' }
            & Pick<Membership, 'isAdmin'>
            & { organisation: (
              { __typename?: 'Organisation' }
              & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'firstName' | 'description' | 'avatarUrl' | 'locationName' | 'location'>
            ) }
          )>>, members?: Maybe<Array<(
            { __typename?: 'Profile' }
            & Pick<Profile, 'type' | 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
          )>>, verifications?: Maybe<Array<(
            { __typename?: 'Verification' }
            & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
            & { verifierProfile?: Maybe<(
              { __typename?: 'Organisation' }
              & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'firstName'>
            )> }
          )>> }
        )> }
      )> }
    ) | (
      { __typename?: 'Memberships' }
      & Pick<Memberships, 'lastUpdatedAt'>
      & { organisations: Array<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'firstName' | 'description' | 'avatarUrl'>
      )> }
    ) | (
      { __typename?: 'Members' }
      & Pick<Members, 'lastUpdatedAt'>
      & { members: Array<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'successorOfCirclesAddress' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      ) | (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'circlesAddress' | 'displayCurrency'>
      )> }
    ) }
  )> }
);

export type GetAllStringsByMaxVersionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStringsByMaxVersionQuery = (
  { __typename?: 'Query' }
  & { getAllStringsByMaxVersion?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value'>
  )>>> }
);

export type GetAllStringsByMaxVersionAndLangQueryVariables = Exact<{
  lang?: Maybe<Scalars['String']>;
}>;


export type GetAllStringsByMaxVersionAndLangQuery = (
  { __typename?: 'Query' }
  & { getAllStringsByMaxVersionAndLang?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value' | 'needsUpdate'>
  )>>> }
);

export type GetStringsToBeUpdatedAmountQueryVariables = Exact<{
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
}>;


export type GetStringsToBeUpdatedAmountQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'getStringsToBeUpdatedAmount'>
);

export type GetStringByMaxVersionQueryVariables = Exact<{
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
}>;


export type GetStringByMaxVersionQuery = (
  { __typename?: 'Query' }
  & { getStringByMaxVersion?: Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value'>
  )> }
);

export type GetOlderVersionsByKeyAndLangQueryVariables = Exact<{
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
}>;


export type GetOlderVersionsByKeyAndLangQuery = (
  { __typename?: 'Query' }
  & { getOlderVersionsByKeyAndLang?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value'>
  )>>> }
);

export type GetPaginatedStringsQueryVariables = Exact<{
  pagination_key?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
}>;


export type GetPaginatedStringsQuery = (
  { __typename?: 'Query' }
  & { getPaginatedStrings?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value' | 'pagination_key'>
  )>>> }
);

export type GetPaginatedStringsToUpdateQueryVariables = Exact<{
  pagination_key?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
}>;


export type GetPaginatedStringsToUpdateQuery = (
  { __typename?: 'Query' }
  & { getPaginatedStringsToUpdate?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value' | 'pagination_key'>
  )>>> }
);

export type GetAvailableLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailableLanguagesQuery = (
  { __typename?: 'Query' }
  & { getAvailableLanguages?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang'>
  )>>> }
);

export type DirectPathQueryVariables = Exact<{
  from: Scalars['String'];
  to: Scalars['String'];
  amount: Scalars['String'];
}>;


export type DirectPathQuery = (
  { __typename?: 'Query' }
  & { directPath: (
    { __typename?: 'TransitivePath' }
    & Pick<TransitivePath, 'flow' | 'isValid'>
    & { transfers: Array<(
      { __typename?: 'TransitiveTransfer' }
      & Pick<TransitiveTransfer, 'from' | 'to' | 'token' | 'tokenOwner' | 'value'>
    )> }
  ) }
);

export type VerificationsQueryVariables = Exact<{
  pagination?: Maybe<PaginationArgs>;
  filter?: Maybe<VerifiedSafesFilter>;
}>;


export type VerificationsQuery = (
  { __typename?: 'Query' }
  & { verifications: Array<(
    { __typename?: 'Verification' }
    & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress' | 'verifiedSafeAddress'>
    & { verifierProfile?: Maybe<(
      { __typename?: 'Organisation' }
      & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'firstName'>
    )>, verifiedProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
    )> }
  )> }
);

export type FindInvitationCreatorQueryVariables = Exact<{
  code: Scalars['String'];
}>;


export type FindInvitationCreatorQuery = (
  { __typename?: 'Query' }
  & { findInvitationCreator?: Maybe<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'circlesAddress' | 'displayCurrency' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl'>
  )> }
);

export type ClientAssertionJwtQueryVariables = Exact<{ [key: string]: never; }>;


export type ClientAssertionJwtQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'clientAssertionJwt'>
);

export type AllBusinessesQueryVariables = Exact<{
  queryParams?: Maybe<QueryAllBusinessesParameters>;
}>;


export type AllBusinessesQuery = (
  { __typename?: 'Query' }
  & { allBusinesses: Array<(
    { __typename?: 'Businesses' }
    & Pick<Businesses, 'id' | 'circlesAddress' | 'name' | 'description' | 'picture' | 'phoneNumber' | 'location' | 'locationName' | 'lat' | 'lon' | 'businessHoursMonday' | 'businessHoursTuesday' | 'businessHoursWednesday' | 'businessHoursThursday' | 'businessHoursFriday' | 'businessHoursSaturday' | 'businessHoursSunday' | 'businessCategoryId' | 'businessCategory'>
  )> }
);

export type AllBusinessCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllBusinessCategoriesQuery = (
  { __typename?: 'Query' }
  & { allBusinessCategories: Array<(
    { __typename?: 'BusinessCategory' }
    & Pick<BusinessCategory, 'id' | 'name'>
  )> }
);

export type AllBaliVillagesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllBaliVillagesQuery = (
  { __typename?: 'Query' }
  & { allBaliVillages: Array<(
    { __typename?: 'BaliVillage' }
    & Pick<BaliVillage, 'id' | 'desa' | 'kecamatan' | 'kabupaten'>
  )> }
);

export type MyFavoritesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyFavoritesQuery = (
  { __typename?: 'Query' }
  & { myFavorites: Array<(
    { __typename?: 'Favorite' }
    & Pick<Favorite, 'createdAt' | 'createdByAddress' | 'favoriteAddress' | 'comment'>
  )> }
);

export type CompareTrustRelationsQueryVariables = Exact<{
  canSendTo: Scalars['String'];
  compareWith: Array<Scalars['String']> | Scalars['String'];
}>;


export type CompareTrustRelationsQuery = (
  { __typename?: 'Query' }
  & { compareTrustRelations: (
    { __typename?: 'CompareTrustRelationsResult' }
    & Pick<CompareTrustRelationsResult, 'canSendTo'>
    & { diffs: Array<(
      { __typename?: 'TrustComparison' }
      & Pick<TrustComparison, 'canSendTo'>
      & { differences: Array<(
        { __typename?: 'TrustDifference' }
        & Pick<TrustDifference, 'operation' | 'user'>
      )> }
    )> }
  ) }
);

export type EventsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type EventsSubscription = (
  { __typename?: 'Subscription' }
  & { events: (
    { __typename?: 'NotificationEvent' }
    & Pick<NotificationEvent, 'type' | 'from' | 'to' | 'itemId' | 'transaction_hash'>
  ) }
);


export const RequestSessionChallengeDocument = gql`
    mutation requestSessionChallenge($address: String!) {
  requestSessionChallenge(address: $address)
}
    `;
export const VerifySessionChallengeDocument = gql`
    mutation verifySessionChallenge($challenge: String!, $signature: String!) {
  verifySessionChallenge(challenge: $challenge, signature: $signature) {
    success
    errorMessage
  }
}
    `;
export const AddNewLangDocument = gql`
    mutation addNewLang($langToCreate: String, $langToCopyFrom: String) {
  addNewLang(langToCreate: $langToCreate, langToCopyFrom: $langToCopyFrom)
}
    `;
export const UpdateValueDocument = gql`
    mutation updateValue($lang: String, $key: String, $createdBy: String, $value: String) {
  updateValue(lang: $lang, key: $key, createdBy: $createdBy, value: $value) {
    lang
    key
    createdBy
    value
    version
  }
}
    `;
export const CreateNewStringAndKeyDocument = gql`
    mutation createNewStringAndKey($lang: String, $key: String, $createdBy: String, $version: Int, $value: String) {
  createNewStringAndKey(
    lang: $lang
    key: $key
    createdBy: $createdBy
    version: $version
    value: $value
  ) {
    lang
    key
    createdBy
    version
    value
    needsUpdate
  }
}
    `;
export const SetStringUpdateStateDocument = gql`
    mutation setStringUpdateState($key: String) {
  setStringUpdateState(key: $key) {
    lang
    key
    createdBy
    version
    value
    needsUpdate
  }
}
    `;
export const ClaimInvitationDocument = gql`
    mutation claimInvitation($code: String!) {
  claimInvitation(code: $code) {
    success
    claimedInvitation {
      createdAt
      createdByProfileId
      claimedAt
      claimedByProfileId
    }
  }
}
    `;
export const AcknowledgeDocument = gql`
    mutation acknowledge($until: Date!, $safeAddress: String) {
  acknowledge(until: $until, safeAddress: $safeAddress)
}
    `;
export const AddMemberDocument = gql`
    mutation addMember($groupId: String!, $memberAddress: String!) {
  addMember(groupId: $groupId, memberAddress: $memberAddress) {
    error
    success
  }
}
    `;
export const RemoveMemberDocument = gql`
    mutation removeMember($groupId: String!, $memberAddress: String!) {
  removeMember(groupId: $groupId, memberAddress: $memberAddress) {
    error
    success
  }
}
    `;
export const RedeemClaimedInvitationDocument = gql`
    mutation redeemClaimedInvitation {
  redeemClaimedInvitation {
    success
    error
    transactionHash
  }
}
    `;
export const LogoutDocument = gql`
    mutation logout {
  logout {
    success
  }
}
    `;
export const TagTransactionDocument = gql`
    mutation tagTransaction($transactionHash: String!, $tag: CreateTagInput!) {
  tagTransaction(transactionHash: $transactionHash, tag: $tag) {
    success
    error
    tag {
      id
      typeId
      value
    }
  }
}
    `;
export const UpsertProfileDocument = gql`
    mutation upsertProfile($id: Int, $firstName: String!, $lastName: String, $emailAddress: String, $askedForEmailAddress: Boolean!, $dream: String, $country: String, $avatarUrl: String, $avatarCid: String, $avatarMimeType: String, $circlesAddress: String, $circlesSafeOwner: String, $newsletter: Boolean, $displayCurrency: DisplayCurrency, $displayTimeCircles: Boolean, $status: String!, $successorOfCirclesAddress: String, $gender: Gender, $location: String, $locationName: String, $lat: Float, $lon: Float, $surveyDataSessionId: String) {
  upsertProfile(
    data: {id: $id, firstName: $firstName, lastName: $lastName, emailAddress: $emailAddress, askedForEmailAddress: $askedForEmailAddress, dream: $dream, country: $country, avatarUrl: $avatarUrl, avatarCid: $avatarCid, avatarMimeType: $avatarMimeType, circlesAddress: $circlesAddress, circlesSafeOwner: $circlesSafeOwner, newsletter: $newsletter, displayCurrency: $displayCurrency, displayTimeCircles: $displayTimeCircles, status: $status, successorOfCirclesAddress: $successorOfCirclesAddress, gender: $gender, location: $location, locationName: $locationName, lat: $lat, lon: $lon, surveyDataSessionId: $surveyDataSessionId}
  ) {
    id
    circlesAddress
    displayCurrency
    circlesSafeOwner
    invitationLink
    successorOfCirclesAddress
    displayName
    firstName
    lastName
    emailAddress
    askedForEmailAddress
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    newsletter
    displayTimeCircles
    displayCurrency
    gender
    location
    locationName
    lat
    lon
    memberships {
      isAdmin
      organisation {
        id
        circlesAddress
        displayCurrency
        displayName
        circlesSafeOwner
        firstName
        description
        avatarUrl
      }
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        firstName
      }
    }
  }
}
    `;
export const UpsertOrganisationDocument = gql`
    mutation upsertOrganisation($organisation: UpsertOrganisationInput!) {
  upsertOrganisation(organisation: $organisation) {
    success
    error
    organisation {
      id
      avatarMimeType
      avatarUrl
      circlesAddress
      circlesSafeOwner
      createdAt
      description
      firstName
      location
      locationName
      lat
      lon
    }
  }
}
    `;
export const ImportOrganisationsDocument = gql`
    mutation importOrganisations {
  importOrganisationsOfAccount {
    id
    circlesAddress
    firstName
    description
    avatarUrl
  }
}
    `;
export const VerifySafeDocument = gql`
    mutation verifySafe($safeAddress: String!) {
  verifySafe(safeAddress: $safeAddress) {
    success
  }
}
    `;
export const RevokeSafeVerificationDocument = gql`
    mutation revokeSafeVerification($safeAddress: String!) {
  revokeSafeVerification(safeAddress: $safeAddress) {
    success
  }
}
    `;
export const SetIsFavoriteDocument = gql`
    mutation setIsFavorite($circlesAddress: String!, $isFavorite: Boolean!) {
  setIsFavorite(circlesAddress: $circlesAddress, isFavorite: $isFavorite)
}
    `;
export const ShareLinkDocument = gql`
    mutation shareLink($targetType: LinkTargetType!, $targetKey: String!) {
  shareLink(targetType: $targetType, targetKey: $targetKey)
}
    `;
export const SurveyDataDocument = gql`
    mutation surveyData($surveyData: SurveyDataInput!) {
  surveyData(data: $surveyData) {
    success
    error
    surveyData {
      id
      sesssionId
    }
  }
}
    `;
export const GetNonceForEoaDocument = gql`
    mutation getNonceForEoa($signature: String!) {
  getNonce(data: {signature: $signature}) {
    nonce
  }
}
    `;
export const GetNonceForSafeDocument = gql`
    mutation getNonceForSafe($signature: String!, $safeAddress: String!) {
  getNonce(data: {signature: $signature, address: $safeAddress}) {
    nonce
  }
}
    `;
export const SendSignedTransactionDocument = gql`
    mutation sendSignedTransaction($signedTransaction: String!) {
  sendSignedTransaction(data: {signedTransaction: $signedTransaction}) {
    transactionHash
  }
}
    `;
export const InitDocument = gql`
    query init {
  init {
    isLoggedOn
    hasProfile
    profileId
    capabilities {
      type
    }
    useShortSignup
    profile {
      id
      circlesAddress
      displayCurrency
      circlesSafeOwner
      invitationLink
      successorOfCirclesAddress
      displayName
      firstName
      lastName
      emailAddress
      askedForEmailAddress
      dream
      country
      avatarUrl
      avatarCid
      avatarMimeType
      newsletter
      displayTimeCircles
      displayCurrency
      provenUniqueness
      location
      locationName
      lat
      lon
      memberships {
        isAdmin
        organisation {
          id
          circlesAddress
          displayCurrency
          displayName
          circlesSafeOwner
          firstName
          description
          avatarUrl
        }
      }
      verifications {
        createdAt
        revokedAt
        verifierSafeAddress
        verifierProfile {
          id
          circlesAddress
          displayCurrency
          avatarUrl
          firstName
        }
      }
      canInvite
      claimedInvitation {
        claimedAt
      }
      invitationTransaction {
        timestamp
        transaction_hash
      }
      circlesTokenAddress
    }
  }
}
    `;
export const LastAcknowledgedAtDocument = gql`
    query lastAcknowledgedAt($safeAddress: String!) {
  lastAcknowledgedAt(safeAddress: $safeAddress)
}
    `;
export const SessionInfoDocument = gql`
    query sessionInfo {
  sessionInfo {
    isLoggedOn
    hasProfile
    profileId
    sessionId
    capabilities {
      type
    }
    useShortSignup
  }
}
    `;
export const ClaimedInvitationDocument = gql`
    query claimedInvitation {
  claimedInvitation {
    createdAt
    createdByProfileId
    claimedAt
    claimedByProfileId
  }
}
    `;
export const InvitationTransactionDocument = gql`
    query invitationTransaction {
  invitationTransaction {
    transaction_hash
  }
}
    `;
export const HubSignupTransactionDocument = gql`
    query hubSignupTransaction {
  hubSignupTransaction {
    transaction_hash
    payload {
      ... on CrcSignup {
        token
      }
    }
  }
}
    `;
export const SafeInfoDocument = gql`
    query safeInfo {
  safeInfo {
    lastUbiAt
    safeAddress
    tokenAddress
    randomValue
  }
}
    `;
export const FindSafesByOwnerDocument = gql`
    query findSafesByOwner($owner: String!) {
  findSafesByOwner(owner: $owner) {
    type
    safeAddress
    lastUbiAt
    randomValue
    tokenAddress
    safeProfile {
      id
      circlesAddress
      displayCurrency
      circlesSafeOwner
      displayName
      firstName
      lastName
      dream
      avatarUrl
    }
  }
}
    `;
export const MyInvitationsDocument = gql`
    query myInvitations {
  myInvitations {
    createdAt
    claimedAt
    claimedBy {
      circlesAddress
      displayCurrency
      circlesSafeOwner
      displayName
      firstName
      lastName
      avatarUrl
    }
    name
    address
    balance
    code
  }
}
    `;
export const MyProfileDocument = gql`
    query myProfile {
  myProfile {
    id
    circlesAddress
    displayCurrency
    circlesSafeOwner
    invitationLink
    successorOfCirclesAddress
    displayName
    firstName
    lastName
    emailAddress
    askedForEmailAddress
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    newsletter
    displayTimeCircles
    canInvite
    displayCurrency
    provenUniqueness
    location
    locationName
    type
    memberships {
      isAdmin
      organisation {
        id
        circlesAddress
        displayCurrency
        displayName
        circlesSafeOwner
        firstName
        description
        avatarUrl
        location
        locationName
      }
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        firstName
      }
    }
  }
}
    `;
export const ProfilesDocument = gql`
    query profiles($id: [Int!]!) {
  profilesById(ids: $id) {
    id
    circlesAddress
    displayCurrency
    circlesSafeOwner
    successorOfCirclesAddress
    displayName
    firstName
    lastName
    dream
    avatarUrl
    type
    displayCurrency
    provenUniqueness
    memberships {
      isAdmin
      organisation {
        id
        circlesAddress
        displayCurrency
        displayName
        circlesSafeOwner
        firstName
        description
        avatarUrl
      }
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        firstName
        displayName
      }
    }
  }
}
    `;
export const ProfilesByNameDocument = gql`
    query profilesByName($searchString: String!, $profileType: ProfileType) {
  search(query: {searchString: $searchString, profileType: $profileType}) {
    id
    origin
    circlesSafeOwner
    circlesAddress
    displayCurrency
    successorOfCirclesAddress
    avatarUrl
    displayName
    firstName
    lastName
    dream
    country
    type
    displayCurrency
    provenUniqueness
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        firstName
        displayName
      }
    }
  }
}
    `;
export const GetRecentProfilesDocument = gql`
    query getRecentProfiles($pagination: PaginationArgs) {
  recentProfiles(pagination: $pagination) {
    id
    circlesAddress
    displayCurrency
    origin
    successorOfCirclesAddress
    displayName
    firstName
    lastName
    dream
    country
    avatarUrl
    provenUniqueness
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        firstName
        displayName
      }
    }
  }
}
    `;
export const ProfilesByCirclesAddressDocument = gql`
    query profilesByCirclesAddress($circlesAddresses: [String!]!) {
  profilesBySafeAddress(safeAddresses: $circlesAddresses) {
    id
    circlesAddress
    displayCurrency
    origin
    successorOfCirclesAddress
    displayName
    firstName
    lastName
    dream
    avatarUrl
    provenUniqueness
    location
    locationName
    lat
    lon
    type
    memberships {
      isAdmin
      organisation {
        id
        circlesAddress
        displayCurrency
        displayName
        circlesSafeOwner
        firstName
        description
        avatarUrl
      }
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        firstName
        displayName
      }
    }
  }
}
    `;
export const ProfilesByIdsDocument = gql`
    query profilesByIds($id: [Int!]!) {
  profilesById(ids: $id) {
    id
    circlesAddress
    displayCurrency
    origin
    successorOfCirclesAddress
    displayName
    firstName
    lastName
    dream
    avatarUrl
    provenUniqueness
    location
    locationName
    lat
    lon
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        firstName
        displayName
      }
    }
  }
}
    `;
export const TrustRelationsDocument = gql`
    query trustRelations($safeAddress: String!) {
  trustRelations(safeAddress: $safeAddress) {
    safeAddress
    safeAddressProfile {
      id
      displayName
      firstName
      lastName
      origin
      avatarUrl
      successorOfCirclesAddress
      circlesAddress
      displayCurrency
      provenUniqueness
      location
      locationName
      lat
      lon
    }
    direction
    otherSafeAddress
    otherSafeAddressProfile {
      id
      displayName
      firstName
      lastName
      avatarUrl
      successorOfCirclesAddress
      circlesAddress
      displayCurrency
      provenUniqueness
      location
      locationName
      lat
      lon
      verifications {
        createdAt
        revokedAt
        verifierSafeAddress
        verifierProfile {
          id
          circlesAddress
          displayCurrency
          avatarUrl
          firstName
        }
      }
    }
  }
}
    `;
export const ProfileByIdDocument = gql`
    query profileById($id: Int!) {
  profilesById(ids: [$id]) {
    id
    successorOfCirclesAddress
    circlesSafeOwner
    circlesAddress
    displayCurrency
    avatarUrl
    displayName
    firstName
    lastName
    dream
    provenUniqueness
    location
    locationName
    lat
    lon
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        firstName
        displayName
      }
    }
  }
}
    `;
export const ProfileBySafeAddressDocument = gql`
    query profileBySafeAddress($safeAddress: String!) {
  profilesBySafeAddress(safeAddresses: [$safeAddress]) {
    id
    circlesAddress
    displayCurrency
    circlesSafeOwner
    invitationLink
    successorOfCirclesAddress
    displayName
    firstName
    lastName
    emailAddress
    askedForEmailAddress
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    newsletter
    canInvite
    displayTimeCircles
    displayCurrency
    provenUniqueness
    location
    locationName
    lat
    lon
    memberships {
      isAdmin
      organisation {
        id
        circlesAddress
        displayCurrency
        displayName
        circlesSafeOwner
        firstName
        description
        avatarUrl
      }
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        firstName
      }
    }
    claimedInvitation {
      claimedAt
    }
    invitationTransaction {
      timestamp
      transaction_hash
    }
    circlesTokenAddress
  }
}
    `;
export const TagsDocument = gql`
    query tags($typeId_in: [String!]!, $value_like: String) {
  tags(query: {typeId_in: $typeId_in, value_like: $value_like}) {
    typeId
    id
    value
    order
  }
}
    `;
export const OrganisationsDocument = gql`
    query organisations($pagination: PaginationArgs) {
  organisations(pagination: $pagination) {
    id
    circlesAddress
    displayCurrency
    createdAt
    firstName
    avatarUrl
    location
    locationName
  }
}
    `;
export const RegionsDocument = gql`
    query regions {
  regions {
    id
    circlesAddress
    displayCurrency
    createdAt
    firstName
    avatarUrl
  }
}
    `;
export const OrganisationsByAddressDocument = gql`
    query organisationsByAddress($addresses: [String!]!) {
  organisationsByAddress(addresses: $addresses) {
    id
    circlesAddress
    displayCurrency
    createdAt
    firstName
    avatarUrl
    displayName
    location
    locationName
    members {
      ... on Organisation {
        id
        circlesAddress
        displayCurrency
        createdAt
        firstName
        displayName
        avatarUrl
      }
      ... on Profile {
        id
        successorOfCirclesAddress
        circlesSafeOwner
        circlesAddress
        displayCurrency
        avatarUrl
        displayName
        firstName
        lastName
        dream
        provenUniqueness
        verifications {
          createdAt
          revokedAt
          verifierSafeAddress
          verifierProfile {
            id
            circlesAddress
            displayCurrency
            avatarUrl
            firstName
          }
        }
      }
    }
  }
}
    `;
export const CommonTrustDocument = gql`
    query commonTrust($safeAddress1: String!, $safeAddress2: String!) {
  commonTrust(safeAddress1: $safeAddress1, safeAddress2: $safeAddress2) {
    type
    safeAddress1
    safeAddress2
    profile {
      id
      displayName
      firstName
      lastName
      avatarUrl
      successorOfCirclesAddress
      circlesAddress
      displayCurrency
      provenUniqueness
    }
  }
}
    `;
export const TagByIdDocument = gql`
    query tagById($id: Int!) {
  tagById(id: $id) {
    id
    typeId
    value
  }
}
    `;
export const StreamDocument = gql`
    query stream($types: [EventType!]!, $safeAddress: String!, $pagination: PaginationArgs!, $filter: ProfileEventFilter) {
  events(
    types: $types
    safeAddress: $safeAddress
    pagination: $pagination
    filter: $filter
  ) {
    timestamp
    transaction_hash
    block_number
    safe_address
    contact_address
    contact_address_profile {
      type
      successorOfCirclesAddress
      circlesAddress
      displayCurrency
      displayName
      firstName
      lastName
      avatarUrl
      provenUniqueness
    }
    direction
    type
    unread
    payload {
      ... on CrcHubTransfer {
        transaction_hash
        from
        from_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        to
        to_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        flow
        transfers {
          token
          from
          from_profile {
            id
            displayName
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
            provenUniqueness
          }
          to
          to_profile {
            id
            displayName
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
            provenUniqueness
          }
          value
        }
        tags {
          id
          typeId
          value
        }
      }
      ... on CrcTrust {
        transaction_hash
        address
        can_send_to
        can_send_to_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        limit
      }
      ... on CrcSignup {
        transaction_hash
        user
        token
      }
      ... on CrcMinting {
        transaction_hash
        token
        from
        from_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        to
        to_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        value
      }
      ... on EthTransfer {
        transaction_hash
        from
        to
        value
      }
      ... on Erc20Transfer {
        transaction_hash
        from
        from_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        to
        to_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        value
      }
      ... on GnosisSafeEthTransfer {
        transaction_hash
        initiator
        from
        to
        value
      }
      ... on MembershipOffer {
        createdBy
        createdBy_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        organisation
        organisation_profile {
          firstName
          avatarUrl
          circlesAddress
          displayCurrency
          locationName
          location
        }
        isAdmin
      }
      ... on MembershipAccepted {
        createdBy
        member
        member_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        organisation
        organisation_profile {
          firstName
          avatarUrl
          circlesAddress
          displayCurrency
          locationName
          location
        }
      }
      ... on MembershipRejected {
        member
        member_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        organisation
        organisation_profile {
          firstName
          avatarUrl
          circlesAddress
          displayCurrency
          locationName
          location
        }
      }
      ... on WelcomeMessage {
        invitedBy
        invitedBy_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
      }
      ... on InvitationCreated {
        name
        code
      }
      ... on InvitationRedeemed {
        name
        code
        redeemedBy
        redeemedBy_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
      }
      ... on OrganisationCreated {
        organisation
        organisation_profile {
          firstName
          avatarUrl
          circlesAddress
          displayCurrency
          displayCurrency
          locationName
          location
        }
      }
      ... on MemberAdded {
        createdBy
        isAdmin
        member
        organisation
        organisation_profile {
          firstName
          avatarUrl
          circlesAddress
          displayCurrency
          displayCurrency
          locationName
          location
        }
      }
      ... on SafeVerified {
        safe_address
        organisation_profile {
          firstName
          avatarUrl
          circlesAddress
          displayCurrency
          displayCurrency
          locationName
          location
        }
      }
      ... on NewUser {
        profile {
          id
          displayName
          firstName
          lastName
          dream
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
      }
    }
  }
}
    `;
export const AggregatesDocument = gql`
    query aggregates($types: [AggregateType!]!, $safeAddress: String!, $filter: ProfileAggregateFilter) {
  aggregates(types: $types, safeAddress: $safeAddress, filter: $filter) {
    type
    safe_address
    safe_address_profile {
      id
      displayName
      firstName
      lastName
      avatarUrl
      circlesAddress
      displayCurrency
      provenUniqueness
    }
    payload {
      ... on CrcBalances {
        lastUpdatedAt
        balances {
          token_address
          token_owner_address
          token_owner_profile {
            id
            displayName
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
            provenUniqueness
          }
          token_balance
        }
      }
      ... on Erc20Balances {
        lastUpdatedAt
        balances {
          token_address
          token_owner_address
          token_owner_profile {
            id
            displayName
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
            provenUniqueness
          }
          token_balance
        }
      }
      ... on Contacts {
        lastUpdatedAt
        contacts {
          metadata {
            name
            directions
            values
            timestamps
          }
          lastContactAt
          contactAddress
          contactAddress_Profile {
            type
            id
            displayName
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
            provenUniqueness
            memberships {
              isAdmin
              organisation {
                id
                circlesAddress
                displayCurrency
                displayName
                circlesSafeOwner
                firstName
                description
                avatarUrl
                locationName
                location
              }
            }
            members {
              type
              id
              displayName
              firstName
              lastName
              avatarUrl
              circlesAddress
              displayCurrency
            }
            verifications {
              createdAt
              revokedAt
              verifierSafeAddress
              verifierProfile {
                id
                circlesAddress
                displayCurrency
                avatarUrl
                firstName
              }
            }
          }
        }
      }
      ... on Members {
        lastUpdatedAt
        members {
          ... on Profile {
            successorOfCirclesAddress
            circlesAddress
            displayCurrency
            provenUniqueness
          }
          ... on Organisation {
            circlesAddress
            displayCurrency
          }
        }
      }
      ... on Memberships {
        lastUpdatedAt
        organisations {
          id
          circlesAddress
          displayCurrency
          displayName
          circlesSafeOwner
          firstName
          description
          avatarUrl
        }
      }
    }
  }
}
    `;
export const GetAllStringsByMaxVersionDocument = gql`
    query getAllStringsByMaxVersion {
  getAllStringsByMaxVersion {
    lang
    key
    createdBy
    version
    value
  }
}
    `;
export const GetAllStringsByMaxVersionAndLangDocument = gql`
    query getAllStringsByMaxVersionAndLang($lang: String) {
  getAllStringsByMaxVersionAndLang(lang: $lang) {
    lang
    key
    createdBy
    version
    value
    needsUpdate
  }
}
    `;
export const GetStringsToBeUpdatedAmountDocument = gql`
    query getStringsToBeUpdatedAmount($lang: String, $key: String) {
  getStringsToBeUpdatedAmount(lang: $lang, key: $key)
}
    `;
export const GetStringByMaxVersionDocument = gql`
    query getStringByMaxVersion($lang: String, $key: String) {
  getStringByMaxVersion(lang: $lang, key: $key) {
    lang
    key
    createdBy
    version
    value
  }
}
    `;
export const GetOlderVersionsByKeyAndLangDocument = gql`
    query getOlderVersionsByKeyAndLang($key: String, $lang: String) {
  getOlderVersionsByKeyAndLang(lang: $lang, key: $key) {
    lang
    key
    createdBy
    version
    value
  }
}
    `;
export const GetPaginatedStringsDocument = gql`
    query getPaginatedStrings($pagination_key: String, $key: String, $lang: String, $value: String) {
  getPaginatedStrings(
    pagination_key: $pagination_key
    key: $key
    lang: $lang
    value: $value
  ) {
    lang
    key
    createdBy
    version
    value
    pagination_key
  }
}
    `;
export const GetPaginatedStringsToUpdateDocument = gql`
    query getPaginatedStringsToUpdate($pagination_key: String, $key: String, $lang: String, $value: String) {
  getPaginatedStringsToUpdate(
    pagination_key: $pagination_key
    key: $key
    lang: $lang
    value: $value
  ) {
    lang
    key
    createdBy
    version
    value
    pagination_key
  }
}
    `;
export const GetAvailableLanguagesDocument = gql`
    query getAvailableLanguages {
  getAvailableLanguages {
    lang
  }
}
    `;
export const DirectPathDocument = gql`
    query directPath($from: String!, $to: String!, $amount: String!) {
  directPath(from: $from, to: $to, amount: $amount) {
    flow
    isValid
    transfers {
      from
      to
      token
      tokenOwner
      value
    }
  }
}
    `;
export const VerificationsDocument = gql`
    query verifications($pagination: PaginationArgs, $filter: VerifiedSafesFilter) {
  verifications(pagination: $pagination, filter: $filter) {
    createdAt
    revokedAt
    verifierSafeAddress
    verifierProfile {
      id
      circlesAddress
      displayCurrency
      avatarUrl
      firstName
    }
    verifiedSafeAddress
    verifiedProfile {
      id
      displayName
      firstName
      lastName
      avatarUrl
      circlesAddress
      displayCurrency
      provenUniqueness
    }
  }
}
    `;
export const FindInvitationCreatorDocument = gql`
    query findInvitationCreator($code: String!) {
  findInvitationCreator(code: $code) {
    circlesAddress
    displayCurrency
    displayName
    firstName
    lastName
    avatarUrl
  }
}
    `;
export const ClientAssertionJwtDocument = gql`
    query clientAssertionJwt {
  clientAssertionJwt
}
    `;
export const AllBusinessesDocument = gql`
    query allBusinesses($queryParams: QueryAllBusinessesParameters) {
  allBusinesses(queryParams: $queryParams) {
    id
    circlesAddress
    name
    description
    picture
    phoneNumber
    location
    locationName
    lat
    lon
    businessHoursMonday
    businessHoursTuesday
    businessHoursWednesday
    businessHoursThursday
    businessHoursFriday
    businessHoursSaturday
    businessHoursSunday
    businessCategoryId
    businessCategory
  }
}
    `;
export const AllBusinessCategoriesDocument = gql`
    query allBusinessCategories {
  allBusinessCategories {
    id
    name
  }
}
    `;
export const AllBaliVillagesDocument = gql`
    query allBaliVillages {
  allBaliVillages {
    id
    desa
    kecamatan
    kabupaten
  }
}
    `;
export const MyFavoritesDocument = gql`
    query myFavorites {
  myFavorites {
    createdAt
    createdByAddress
    favoriteAddress
    comment
  }
}
    `;
export const CompareTrustRelationsDocument = gql`
    query compareTrustRelations($canSendTo: String!, $compareWith: [String!]!) {
  compareTrustRelations(data: {canSendTo: $canSendTo, compareWith: $compareWith}) {
    canSendTo
    diffs {
      canSendTo
      differences {
        operation
        user
      }
    }
  }
}
    `;
export const EventsDocument = gql`
    subscription events {
  events {
    type
    from
    to
    itemId
    transaction_hash
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    requestSessionChallenge(variables: RequestSessionChallengeMutationVariables): Promise<RequestSessionChallengeMutation> {
      return withWrapper(() => client.request<RequestSessionChallengeMutation>(print(RequestSessionChallengeDocument), variables));
    },
    verifySessionChallenge(variables: VerifySessionChallengeMutationVariables): Promise<VerifySessionChallengeMutation> {
      return withWrapper(() => client.request<VerifySessionChallengeMutation>(print(VerifySessionChallengeDocument), variables));
    },
    addNewLang(variables?: AddNewLangMutationVariables): Promise<AddNewLangMutation> {
      return withWrapper(() => client.request<AddNewLangMutation>(print(AddNewLangDocument), variables));
    },
    updateValue(variables?: UpdateValueMutationVariables): Promise<UpdateValueMutation> {
      return withWrapper(() => client.request<UpdateValueMutation>(print(UpdateValueDocument), variables));
    },
    createNewStringAndKey(variables?: CreateNewStringAndKeyMutationVariables): Promise<CreateNewStringAndKeyMutation> {
      return withWrapper(() => client.request<CreateNewStringAndKeyMutation>(print(CreateNewStringAndKeyDocument), variables));
    },
    setStringUpdateState(variables?: SetStringUpdateStateMutationVariables): Promise<SetStringUpdateStateMutation> {
      return withWrapper(() => client.request<SetStringUpdateStateMutation>(print(SetStringUpdateStateDocument), variables));
    },
    claimInvitation(variables: ClaimInvitationMutationVariables): Promise<ClaimInvitationMutation> {
      return withWrapper(() => client.request<ClaimInvitationMutation>(print(ClaimInvitationDocument), variables));
    },
    acknowledge(variables: AcknowledgeMutationVariables): Promise<AcknowledgeMutation> {
      return withWrapper(() => client.request<AcknowledgeMutation>(print(AcknowledgeDocument), variables));
    },
    addMember(variables: AddMemberMutationVariables): Promise<AddMemberMutation> {
      return withWrapper(() => client.request<AddMemberMutation>(print(AddMemberDocument), variables));
    },
    removeMember(variables: RemoveMemberMutationVariables): Promise<RemoveMemberMutation> {
      return withWrapper(() => client.request<RemoveMemberMutation>(print(RemoveMemberDocument), variables));
    },
    redeemClaimedInvitation(variables?: RedeemClaimedInvitationMutationVariables): Promise<RedeemClaimedInvitationMutation> {
      return withWrapper(() => client.request<RedeemClaimedInvitationMutation>(print(RedeemClaimedInvitationDocument), variables));
    },
    logout(variables?: LogoutMutationVariables): Promise<LogoutMutation> {
      return withWrapper(() => client.request<LogoutMutation>(print(LogoutDocument), variables));
    },
    tagTransaction(variables: TagTransactionMutationVariables): Promise<TagTransactionMutation> {
      return withWrapper(() => client.request<TagTransactionMutation>(print(TagTransactionDocument), variables));
    },
    upsertProfile(variables: UpsertProfileMutationVariables): Promise<UpsertProfileMutation> {
      return withWrapper(() => client.request<UpsertProfileMutation>(print(UpsertProfileDocument), variables));
    },
    upsertOrganisation(variables: UpsertOrganisationMutationVariables): Promise<UpsertOrganisationMutation> {
      return withWrapper(() => client.request<UpsertOrganisationMutation>(print(UpsertOrganisationDocument), variables));
    },
    importOrganisations(variables?: ImportOrganisationsMutationVariables): Promise<ImportOrganisationsMutation> {
      return withWrapper(() => client.request<ImportOrganisationsMutation>(print(ImportOrganisationsDocument), variables));
    },
    verifySafe(variables: VerifySafeMutationVariables): Promise<VerifySafeMutation> {
      return withWrapper(() => client.request<VerifySafeMutation>(print(VerifySafeDocument), variables));
    },
    revokeSafeVerification(variables: RevokeSafeVerificationMutationVariables): Promise<RevokeSafeVerificationMutation> {
      return withWrapper(() => client.request<RevokeSafeVerificationMutation>(print(RevokeSafeVerificationDocument), variables));
    },
    setIsFavorite(variables: SetIsFavoriteMutationVariables): Promise<SetIsFavoriteMutation> {
      return withWrapper(() => client.request<SetIsFavoriteMutation>(print(SetIsFavoriteDocument), variables));
    },
    shareLink(variables: ShareLinkMutationVariables): Promise<ShareLinkMutation> {
      return withWrapper(() => client.request<ShareLinkMutation>(print(ShareLinkDocument), variables));
    },
    surveyData(variables: SurveyDataMutationVariables): Promise<SurveyDataMutation> {
      return withWrapper(() => client.request<SurveyDataMutation>(print(SurveyDataDocument), variables));
    },
    getNonceForEoa(variables: GetNonceForEoaMutationVariables): Promise<GetNonceForEoaMutation> {
      return withWrapper(() => client.request<GetNonceForEoaMutation>(print(GetNonceForEoaDocument), variables));
    },
    getNonceForSafe(variables: GetNonceForSafeMutationVariables): Promise<GetNonceForSafeMutation> {
      return withWrapper(() => client.request<GetNonceForSafeMutation>(print(GetNonceForSafeDocument), variables));
    },
    sendSignedTransaction(variables: SendSignedTransactionMutationVariables): Promise<SendSignedTransactionMutation> {
      return withWrapper(() => client.request<SendSignedTransactionMutation>(print(SendSignedTransactionDocument), variables));
    },
    init(variables?: InitQueryVariables): Promise<InitQuery> {
      return withWrapper(() => client.request<InitQuery>(print(InitDocument), variables));
    },
    lastAcknowledgedAt(variables: LastAcknowledgedAtQueryVariables): Promise<LastAcknowledgedAtQuery> {
      return withWrapper(() => client.request<LastAcknowledgedAtQuery>(print(LastAcknowledgedAtDocument), variables));
    },
    sessionInfo(variables?: SessionInfoQueryVariables): Promise<SessionInfoQuery> {
      return withWrapper(() => client.request<SessionInfoQuery>(print(SessionInfoDocument), variables));
    },
    claimedInvitation(variables?: ClaimedInvitationQueryVariables): Promise<ClaimedInvitationQuery> {
      return withWrapper(() => client.request<ClaimedInvitationQuery>(print(ClaimedInvitationDocument), variables));
    },
    invitationTransaction(variables?: InvitationTransactionQueryVariables): Promise<InvitationTransactionQuery> {
      return withWrapper(() => client.request<InvitationTransactionQuery>(print(InvitationTransactionDocument), variables));
    },
    hubSignupTransaction(variables?: HubSignupTransactionQueryVariables): Promise<HubSignupTransactionQuery> {
      return withWrapper(() => client.request<HubSignupTransactionQuery>(print(HubSignupTransactionDocument), variables));
    },
    safeInfo(variables?: SafeInfoQueryVariables): Promise<SafeInfoQuery> {
      return withWrapper(() => client.request<SafeInfoQuery>(print(SafeInfoDocument), variables));
    },
    findSafesByOwner(variables: FindSafesByOwnerQueryVariables): Promise<FindSafesByOwnerQuery> {
      return withWrapper(() => client.request<FindSafesByOwnerQuery>(print(FindSafesByOwnerDocument), variables));
    },
    myInvitations(variables?: MyInvitationsQueryVariables): Promise<MyInvitationsQuery> {
      return withWrapper(() => client.request<MyInvitationsQuery>(print(MyInvitationsDocument), variables));
    },
    myProfile(variables?: MyProfileQueryVariables): Promise<MyProfileQuery> {
      return withWrapper(() => client.request<MyProfileQuery>(print(MyProfileDocument), variables));
    },
    profiles(variables: ProfilesQueryVariables): Promise<ProfilesQuery> {
      return withWrapper(() => client.request<ProfilesQuery>(print(ProfilesDocument), variables));
    },
    profilesByName(variables: ProfilesByNameQueryVariables): Promise<ProfilesByNameQuery> {
      return withWrapper(() => client.request<ProfilesByNameQuery>(print(ProfilesByNameDocument), variables));
    },
    getRecentProfiles(variables?: GetRecentProfilesQueryVariables): Promise<GetRecentProfilesQuery> {
      return withWrapper(() => client.request<GetRecentProfilesQuery>(print(GetRecentProfilesDocument), variables));
    },
    profilesByCirclesAddress(variables: ProfilesByCirclesAddressQueryVariables): Promise<ProfilesByCirclesAddressQuery> {
      return withWrapper(() => client.request<ProfilesByCirclesAddressQuery>(print(ProfilesByCirclesAddressDocument), variables));
    },
    profilesByIds(variables: ProfilesByIdsQueryVariables): Promise<ProfilesByIdsQuery> {
      return withWrapper(() => client.request<ProfilesByIdsQuery>(print(ProfilesByIdsDocument), variables));
    },
    trustRelations(variables: TrustRelationsQueryVariables): Promise<TrustRelationsQuery> {
      return withWrapper(() => client.request<TrustRelationsQuery>(print(TrustRelationsDocument), variables));
    },
    profileById(variables: ProfileByIdQueryVariables): Promise<ProfileByIdQuery> {
      return withWrapper(() => client.request<ProfileByIdQuery>(print(ProfileByIdDocument), variables));
    },
    profileBySafeAddress(variables: ProfileBySafeAddressQueryVariables): Promise<ProfileBySafeAddressQuery> {
      return withWrapper(() => client.request<ProfileBySafeAddressQuery>(print(ProfileBySafeAddressDocument), variables));
    },
    tags(variables: TagsQueryVariables): Promise<TagsQuery> {
      return withWrapper(() => client.request<TagsQuery>(print(TagsDocument), variables));
    },
    organisations(variables?: OrganisationsQueryVariables): Promise<OrganisationsQuery> {
      return withWrapper(() => client.request<OrganisationsQuery>(print(OrganisationsDocument), variables));
    },
    regions(variables?: RegionsQueryVariables): Promise<RegionsQuery> {
      return withWrapper(() => client.request<RegionsQuery>(print(RegionsDocument), variables));
    },
    organisationsByAddress(variables: OrganisationsByAddressQueryVariables): Promise<OrganisationsByAddressQuery> {
      return withWrapper(() => client.request<OrganisationsByAddressQuery>(print(OrganisationsByAddressDocument), variables));
    },
    commonTrust(variables: CommonTrustQueryVariables): Promise<CommonTrustQuery> {
      return withWrapper(() => client.request<CommonTrustQuery>(print(CommonTrustDocument), variables));
    },
    tagById(variables: TagByIdQueryVariables): Promise<TagByIdQuery> {
      return withWrapper(() => client.request<TagByIdQuery>(print(TagByIdDocument), variables));
    },
    stream(variables: StreamQueryVariables): Promise<StreamQuery> {
      return withWrapper(() => client.request<StreamQuery>(print(StreamDocument), variables));
    },
    aggregates(variables: AggregatesQueryVariables): Promise<AggregatesQuery> {
      return withWrapper(() => client.request<AggregatesQuery>(print(AggregatesDocument), variables));
    },
    getAllStringsByMaxVersion(variables?: GetAllStringsByMaxVersionQueryVariables): Promise<GetAllStringsByMaxVersionQuery> {
      return withWrapper(() => client.request<GetAllStringsByMaxVersionQuery>(print(GetAllStringsByMaxVersionDocument), variables));
    },
    getAllStringsByMaxVersionAndLang(variables?: GetAllStringsByMaxVersionAndLangQueryVariables): Promise<GetAllStringsByMaxVersionAndLangQuery> {
      return withWrapper(() => client.request<GetAllStringsByMaxVersionAndLangQuery>(print(GetAllStringsByMaxVersionAndLangDocument), variables));
    },
    getStringsToBeUpdatedAmount(variables?: GetStringsToBeUpdatedAmountQueryVariables): Promise<GetStringsToBeUpdatedAmountQuery> {
      return withWrapper(() => client.request<GetStringsToBeUpdatedAmountQuery>(print(GetStringsToBeUpdatedAmountDocument), variables));
    },
    getStringByMaxVersion(variables?: GetStringByMaxVersionQueryVariables): Promise<GetStringByMaxVersionQuery> {
      return withWrapper(() => client.request<GetStringByMaxVersionQuery>(print(GetStringByMaxVersionDocument), variables));
    },
    getOlderVersionsByKeyAndLang(variables?: GetOlderVersionsByKeyAndLangQueryVariables): Promise<GetOlderVersionsByKeyAndLangQuery> {
      return withWrapper(() => client.request<GetOlderVersionsByKeyAndLangQuery>(print(GetOlderVersionsByKeyAndLangDocument), variables));
    },
    getPaginatedStrings(variables?: GetPaginatedStringsQueryVariables): Promise<GetPaginatedStringsQuery> {
      return withWrapper(() => client.request<GetPaginatedStringsQuery>(print(GetPaginatedStringsDocument), variables));
    },
    getPaginatedStringsToUpdate(variables?: GetPaginatedStringsToUpdateQueryVariables): Promise<GetPaginatedStringsToUpdateQuery> {
      return withWrapper(() => client.request<GetPaginatedStringsToUpdateQuery>(print(GetPaginatedStringsToUpdateDocument), variables));
    },
    getAvailableLanguages(variables?: GetAvailableLanguagesQueryVariables): Promise<GetAvailableLanguagesQuery> {
      return withWrapper(() => client.request<GetAvailableLanguagesQuery>(print(GetAvailableLanguagesDocument), variables));
    },
    directPath(variables: DirectPathQueryVariables): Promise<DirectPathQuery> {
      return withWrapper(() => client.request<DirectPathQuery>(print(DirectPathDocument), variables));
    },
    verifications(variables?: VerificationsQueryVariables): Promise<VerificationsQuery> {
      return withWrapper(() => client.request<VerificationsQuery>(print(VerificationsDocument), variables));
    },
    findInvitationCreator(variables: FindInvitationCreatorQueryVariables): Promise<FindInvitationCreatorQuery> {
      return withWrapper(() => client.request<FindInvitationCreatorQuery>(print(FindInvitationCreatorDocument), variables));
    },
    clientAssertionJwt(variables?: ClientAssertionJwtQueryVariables): Promise<ClientAssertionJwtQuery> {
      return withWrapper(() => client.request<ClientAssertionJwtQuery>(print(ClientAssertionJwtDocument), variables));
    },
    allBusinesses(variables?: AllBusinessesQueryVariables): Promise<AllBusinessesQuery> {
      return withWrapper(() => client.request<AllBusinessesQuery>(print(AllBusinessesDocument), variables));
    },
    allBusinessCategories(variables?: AllBusinessCategoriesQueryVariables): Promise<AllBusinessCategoriesQuery> {
      return withWrapper(() => client.request<AllBusinessCategoriesQuery>(print(AllBusinessCategoriesDocument), variables));
    },
    allBaliVillages(variables?: AllBaliVillagesQueryVariables): Promise<AllBaliVillagesQuery> {
      return withWrapper(() => client.request<AllBaliVillagesQuery>(print(AllBaliVillagesDocument), variables));
    },
    myFavorites(variables?: MyFavoritesQueryVariables): Promise<MyFavoritesQuery> {
      return withWrapper(() => client.request<MyFavoritesQuery>(print(MyFavoritesDocument), variables));
    },
    compareTrustRelations(variables: CompareTrustRelationsQueryVariables): Promise<CompareTrustRelationsQuery> {
      return withWrapper(() => client.request<CompareTrustRelationsQuery>(print(CompareTrustRelationsDocument), variables));
    },
    events(variables?: EventsSubscriptionVariables): Promise<EventsSubscription> {
      return withWrapper(() => client.request<EventsSubscription>(print(EventsDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;