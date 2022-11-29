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
  /** A date and time value in JSON format. */
  Date: any;
};



export type AcceptMembershipResult = {
  __typename?: 'AcceptMembershipResult';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export enum AccountType {
  Organisation = 'Organisation',
  Person = 'Person'
}

export type AddMemberResult = {
  __typename?: 'AddMemberResult';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type AggregatePayload = Contacts | CrcBalances | Erc20Balances | Members | Memberships;

export enum AggregateType {
  Contacts = 'Contacts',
  CrcBalances = 'CrcBalances',
  Erc20Balances = 'Erc20Balances',
  Members = 'Members',
  Memberships = 'Memberships',
  Sales = 'Sales'
}

export type AssetBalance = {
  __typename?: 'AssetBalance';
  token_address: Scalars['String'];
  token_balance: Scalars['String'];
  token_owner_address: Scalars['String'];
  token_owner_profile?: Maybe<Profile>;
  token_symbol?: Maybe<Scalars['String']>;
};

export type BusinessCategory = {
  __typename?: 'BusinessCategory';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type Businesses = {
  __typename?: 'Businesses';
  businessCategory?: Maybe<Scalars['String']>;
  businessCategoryId?: Maybe<Scalars['Int']>;
  businessHoursFriday?: Maybe<Scalars['String']>;
  businessHoursMonday?: Maybe<Scalars['String']>;
  businessHoursSaturday?: Maybe<Scalars['String']>;
  businessHoursSunday?: Maybe<Scalars['String']>;
  businessHoursThursday?: Maybe<Scalars['String']>;
  businessHoursTuesday?: Maybe<Scalars['String']>;
  businessHoursWednesday?: Maybe<Scalars['String']>;
  circlesAddress: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  lat?: Maybe<Scalars['Float']>;
  location?: Maybe<Scalars['String']>;
  locationName?: Maybe<Scalars['String']>;
  lon?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  picture?: Maybe<Scalars['String']>;
};

export type Capability = {
  __typename?: 'Capability';
  type?: Maybe<CapabilityType>;
};

export enum CapabilityType {
  Invite = 'Invite',
  PreviewFeatures = 'PreviewFeatures',
  Tickets = 'Tickets',
  Translate = 'Translate',
  VerifiedByHumanode = 'VerifiedByHumanode',
  Verify = 'Verify'
}

export type ClaimInvitationResult = {
  __typename?: 'ClaimInvitationResult';
  claimedInvitation?: Maybe<ClaimedInvitation>;
  success: Scalars['Boolean'];
};

export type ClaimedInvitation = {
  __typename?: 'ClaimedInvitation';
  claimedAt: Scalars['String'];
  claimedBy?: Maybe<Profile>;
  claimedByProfileId: Scalars['Int'];
  createdAt: Scalars['String'];
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
};

export type CommonTrust = {
  __typename?: 'CommonTrust';
  profile?: Maybe<Profile>;
  safeAddress1: Scalars['String'];
  safeAddress2: Scalars['String'];
  type: Scalars['String'];
};

export type Contact = {
  __typename?: 'Contact';
  contactAddress: Scalars['String'];
  contactAddress_Profile?: Maybe<Profile>;
  lastContactAt: Scalars['String'];
  metadata: Array<ContactPoint>;
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
  directions: Array<ContactDirection>;
  name: Scalars['String'];
  timestamps: Array<Scalars['String']>;
  values: Array<Scalars['String']>;
};

export type Contacts = IAggregatePayload & {
  __typename?: 'Contacts';
  contacts: Array<Contact>;
  lastUpdatedAt: Scalars['String'];
};

export type CrcBalanceAggregateFilter = {
  tokenAddresses: Array<Scalars['String']>;
};

export type CrcBalanceFilter = {
  gt?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
};

export type CrcBalances = IAggregatePayload & {
  __typename?: 'CrcBalances';
  balances: Array<AssetBalance>;
  lastUpdatedAt: Scalars['String'];
  total?: Maybe<Scalars['String']>;
};

export type CrcHubTransfer = IEventPayload & {
  __typename?: 'CrcHubTransfer';
  flow: Scalars['String'];
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  tags: Array<Tag>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  transaction_hash: Scalars['String'];
  transfers: Array<CrcTokenTransfer>;
};

export type CrcMinting = IEventPayload & {
  __typename?: 'CrcMinting';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  token: Scalars['String'];
  transaction_hash: Scalars['String'];
  value: Scalars['String'];
};

export type CrcSignup = IEventPayload & {
  __typename?: 'CrcSignup';
  token: Scalars['String'];
  transaction_hash: Scalars['String'];
  user: Scalars['String'];
  user_profile?: Maybe<Profile>;
};

export type CrcTokenTransfer = IEventPayload & {
  __typename?: 'CrcTokenTransfer';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  token: Scalars['String'];
  transaction_hash: Scalars['String'];
  value: Scalars['String'];
};

export type CrcTrust = IEventPayload & {
  __typename?: 'CrcTrust';
  address: Scalars['String'];
  address_profile?: Maybe<Profile>;
  can_send_to: Scalars['String'];
  can_send_to_profile?: Maybe<Profile>;
  limit: Scalars['Int'];
  transaction_hash: Scalars['String'];
};

export type CreateInvitationResult = {
  __typename?: 'CreateInvitationResult';
  createdInviteEoas: Array<CreatedInvitation>;
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type CreateOrganisationResult = {
  __typename?: 'CreateOrganisationResult';
  error?: Maybe<Scalars['String']>;
  organisation?: Maybe<Organisation>;
  success: Scalars['Boolean'];
};

export type CreateTagInput = {
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type CreatedInvitation = {
  __typename?: 'CreatedInvitation';
  address: Scalars['String'];
  balance: Scalars['String'];
  claimedAt?: Maybe<Scalars['String']>;
  claimedBy?: Maybe<Profile>;
  claimedByProfileId?: Maybe<Scalars['Int']>;
  code: Scalars['String'];
  createdAt: Scalars['String'];
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
  name: Scalars['String'];
};

export type CreatedInviteEoa = {
  __typename?: 'CreatedInviteEoa';
  address: Scalars['String'];
  fee: Scalars['String'];
  for: Scalars['String'];
};


export enum Direction {
  In = 'in',
  Out = 'out'
}

export enum DisplayCurrency {
  Crc = 'CRC',
  Eurs = 'EURS',
  TimeCrc = 'TIME_CRC'
}

export type Erc20Balances = IAggregatePayload & {
  __typename?: 'Erc20Balances';
  balances: Array<AssetBalance>;
  lastUpdatedAt: Scalars['String'];
};

export type Erc20Transfer = IEventPayload & {
  __typename?: 'Erc20Transfer';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  token: Scalars['String'];
  transaction_hash: Scalars['String'];
  value: Scalars['String'];
};

export type EthTransfer = IEventPayload & {
  __typename?: 'EthTransfer';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  tags: Array<Tag>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  transaction_hash: Scalars['String'];
  value: Scalars['String'];
};

export type EventPayload = CrcHubTransfer | CrcMinting | CrcSignup | CrcTokenTransfer | CrcTrust | Erc20Transfer | EthTransfer | GnosisSafeEthTransfer | InvitationCreated | InvitationRedeemed | MemberAdded | MembershipAccepted | MembershipOffer | MembershipRejected | NewUser | OrganisationCreated | SafeVerified | WelcomeMessage;

export enum EventType {
  CrcHubTransfer = 'CrcHubTransfer',
  CrcMinting = 'CrcMinting',
  CrcSignup = 'CrcSignup',
  CrcTokenTransfer = 'CrcTokenTransfer',
  CrcTrust = 'CrcTrust',
  Erc20Transfer = 'Erc20Transfer',
  EthTransfer = 'EthTransfer',
  GnosisSafeEthTransfer = 'GnosisSafeEthTransfer',
  InvitationCreated = 'InvitationCreated',
  InvitationRedeemed = 'InvitationRedeemed',
  MemberAdded = 'MemberAdded',
  MembershipAccepted = 'MembershipAccepted',
  MembershipOffer = 'MembershipOffer',
  MembershipRejected = 'MembershipRejected',
  NewUser = 'NewUser',
  OrganisationCreated = 'OrganisationCreated',
  SafeVerified = 'SafeVerified',
  WelcomeMessage = 'WelcomeMessage'
}

export type ExchangeTokenResponse = {
  __typename?: 'ExchangeTokenResponse';
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type ExportProfile = {
  __typename?: 'ExportProfile';
  avatarUrl?: Maybe<Scalars['String']>;
  circlesAddress: Scalars['String'];
  displayName: Scalars['String'];
  lastChange: Scalars['Date'];
};

export type ExportTrustRelation = {
  __typename?: 'ExportTrustRelation';
  lastChange: Scalars['Date'];
  trustLimit: Scalars['Int'];
  trusteeAddress: Scalars['String'];
  trusterAddress: Scalars['String'];
};

export type Favorite = {
  __typename?: 'Favorite';
  comment?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  createdByAddress: Scalars['String'];
  favorite?: Maybe<Profile>;
  favoriteAddress: Scalars['String'];
};

export type FibonacciGoals = {
  __typename?: 'FibonacciGoals';
  currentValue: Scalars['Int'];
  lastGoal: Scalars['Int'];
  nextGoal: Scalars['Int'];
};

export enum Gender {
  Divers = 'DIVERS',
  Female = 'FEMALE',
  Male = 'MALE'
}

export type Geolocation = {
  lat: Scalars['Float'];
  lon: Scalars['Float'];
};

export type GnosisSafeEthTransfer = IEventPayload & {
  __typename?: 'GnosisSafeEthTransfer';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  initiator: Scalars['String'];
  tags: Array<Tag>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  transaction_hash: Scalars['String'];
  value: Scalars['String'];
};

export type IAggregatePayload = {
  lastUpdatedAt?: Maybe<Scalars['String']>;
};

export type IEventPayload = {
  transaction_hash?: Maybe<Scalars['String']>;
};

export type InvitationCreated = IEventPayload & {
  __typename?: 'InvitationCreated';
  code: Scalars['String'];
  name: Scalars['String'];
  transaction_hash?: Maybe<Scalars['String']>;
};

export type InvitationRedeemed = IEventPayload & {
  __typename?: 'InvitationRedeemed';
  code: Scalars['String'];
  name: Scalars['String'];
  redeemedBy?: Maybe<Scalars['String']>;
  redeemedBy_profile?: Maybe<Profile>;
  transaction_hash?: Maybe<Scalars['String']>;
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
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type MemberAdded = IEventPayload & {
  __typename?: 'MemberAdded';
  createdBy: Scalars['String'];
  createdBy_profile?: Maybe<Profile>;
  isAdmin: Scalars['Boolean'];
  member: Scalars['String'];
  member_profile?: Maybe<Profile>;
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type Members = IAggregatePayload & {
  __typename?: 'Members';
  lastUpdatedAt: Scalars['String'];
  members: Array<ProfileOrOrganisation>;
};

export type Membership = {
  __typename?: 'Membership';
  acceptedAt?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
  isAdmin: Scalars['Boolean'];
  organisation: Organisation;
  rejectedAt?: Maybe<Scalars['String']>;
  validTo?: Maybe<Scalars['String']>;
};

export type MembershipAccepted = IEventPayload & {
  __typename?: 'MembershipAccepted';
  createdBy: Scalars['String'];
  createdBy_profile?: Maybe<Profile>;
  member: Scalars['String'];
  member_profile?: Maybe<Profile>;
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type MembershipOffer = IEventPayload & {
  __typename?: 'MembershipOffer';
  createdBy: Scalars['String'];
  createdBy_profile?: Maybe<Profile>;
  isAdmin: Scalars['Boolean'];
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type MembershipRejected = IEventPayload & {
  __typename?: 'MembershipRejected';
  member: Scalars['String'];
  member_profile?: Maybe<Profile>;
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type Memberships = IAggregatePayload & {
  __typename?: 'Memberships';
  lastUpdatedAt: Scalars['String'];
  organisations: Array<Organisation>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptMembership?: Maybe<AcceptMembershipResult>;
  acknowledge: Scalars['Boolean'];
  addMember?: Maybe<AddMemberResult>;
  addNewLang?: Maybe<Scalars['Int']>;
  claimInvitation: ClaimInvitationResult;
  createNewStringAndKey?: Maybe<I18n>;
  createTestInvitation: CreateInvitationResult;
  importOrganisationsOfAccount: Array<Organisation>;
  logout: LogoutResponse;
  proofUniqueness: ProofUniquenessResult;
  redeemClaimedInvitation: RedeemClaimedInvitationResult;
  rejectMembership?: Maybe<RejectMembershipResult>;
  removeMember?: Maybe<RemoveMemberResult>;
  requestSessionChallenge: Scalars['String'];
  requestUpdateSafe: RequestUpdateSafeResponse;
  revokeSafeVerification: VerifySafeResult;
  sendMessage: SendMessageResult;
  setIsFavorite: Scalars['Boolean'];
  setStringUpdateState?: Maybe<I18n>;
  shareLink: Scalars['String'];
  tagTransaction: TagTransactionResult;
  updateSafe: UpdateSafeResponse;
  updateValue?: Maybe<I18n>;
  upsertOrganisation: CreateOrganisationResult;
  upsertProfile: Profile;
  upsertTag: Tag;
  verifySafe: VerifySafeResult;
  verifySessionChallenge?: Maybe<ExchangeTokenResponse>;
};


export type MutationAcceptMembershipArgs = {
  membershipId: Scalars['Int'];
};


export type MutationAcknowledgeArgs = {
  safeAddress?: Maybe<Scalars['String']>;
  until: Scalars['Date'];
};


export type MutationAddMemberArgs = {
  groupId: Scalars['String'];
  memberAddress: Scalars['String'];
};


export type MutationAddNewLangArgs = {
  langToCopyFrom?: Maybe<Scalars['String']>;
  langToCreate?: Maybe<Scalars['String']>;
};


export type MutationClaimInvitationArgs = {
  code: Scalars['String'];
};


export type MutationCreateNewStringAndKeyArgs = {
  createdBy?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};


export type MutationProofUniquenessArgs = {
  humanodeToken: Scalars['String'];
};


export type MutationRejectMembershipArgs = {
  membershipId: Scalars['Int'];
};


export type MutationRemoveMemberArgs = {
  groupId: Scalars['String'];
  memberAddress: Scalars['String'];
};


export type MutationRequestSessionChallengeArgs = {
  address: Scalars['String'];
};


export type MutationRequestUpdateSafeArgs = {
  data: RequestUpdateSafeInput;
};


export type MutationRevokeSafeVerificationArgs = {
  safeAddress: Scalars['String'];
};


export type MutationSendMessageArgs = {
  content: Scalars['String'];
  fromSafeAddress?: Maybe<Scalars['String']>;
  toSafeAddress: Scalars['String'];
};


export type MutationSetIsFavoriteArgs = {
  circlesAddress: Scalars['String'];
  isFavorite: Scalars['Boolean'];
};


export type MutationSetStringUpdateStateArgs = {
  key?: Maybe<Scalars['String']>;
};


export type MutationShareLinkArgs = {
  targetKey: Scalars['String'];
  targetType: LinkTargetType;
};


export type MutationTagTransactionArgs = {
  tag: CreateTagInput;
  transactionHash: Scalars['String'];
};


export type MutationUpdateSafeArgs = {
  data: UpdateSafeInput;
};


export type MutationUpdateValueArgs = {
  createdBy?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};


export type MutationUpsertOrganisationArgs = {
  organisation: UpsertOrganisationInput;
};


export type MutationUpsertProfileArgs = {
  data: UpsertProfileInput;
};


export type MutationUpsertTagArgs = {
  data: UpsertTagInput;
};


export type MutationVerifySafeArgs = {
  safeAddress: Scalars['String'];
};


export type MutationVerifySessionChallengeArgs = {
  challenge: Scalars['String'];
  signature: Scalars['String'];
};

export type MyInviteRank = {
  __typename?: 'MyInviteRank';
  rank: Scalars['Int'];
  redeemedInvitationsCount: Scalars['Int'];
};

export type NewUser = IEventPayload & {
  __typename?: 'NewUser';
  profile: Profile;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type NotificationEvent = {
  __typename?: 'NotificationEvent';
  from: Scalars['String'];
  itemId?: Maybe<Scalars['Int']>;
  to: Scalars['String'];
  transaction_hash?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type Organisation = {
  __typename?: 'Organisation';
  avatarMimeType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  circlesSafeOwner?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  displayCurrency?: Maybe<DisplayCurrency>;
  displayName?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  largeBannerUrl?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  location?: Maybe<Scalars['String']>;
  locationName?: Maybe<Scalars['String']>;
  lon?: Maybe<Scalars['Float']>;
  members?: Maybe<Array<ProfileOrOrganisation>>;
  name: Scalars['String'];
  smallBannerUrl?: Maybe<Scalars['String']>;
  trustsYou?: Maybe<Scalars['Int']>;
};

export type OrganisationCreated = IEventPayload & {
  __typename?: 'OrganisationCreated';
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type PaginationArgs = {
  continueAt?: Maybe<Scalars['String']>;
  continueAtId?: Maybe<Scalars['Int']>;
  limit: Scalars['Int'];
  order: SortOrder;
};

export type Profile = {
  __typename?: 'Profile';
  age?: Maybe<Scalars['Int']>;
  askedForEmailAddress: Scalars['Boolean'];
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  balances?: Maybe<ProfileBalances>;
  category?: Maybe<BusinessCategory>;
  circlesAddress?: Maybe<Scalars['String']>;
  circlesSafeOwner?: Maybe<Scalars['String']>;
  circlesTokenAddress?: Maybe<Scalars['String']>;
  claimedInvitation?: Maybe<ClaimedInvitation>;
  confirmedLegalAge?: Maybe<Scalars['Int']>;
  contacts?: Maybe<Array<Contact>>;
  country?: Maybe<Scalars['String']>;
  displayCurrency?: Maybe<DisplayCurrency>;
  displayName?: Maybe<Scalars['String']>;
  displayTimeCircles?: Maybe<Scalars['Boolean']>;
  dream?: Maybe<Scalars['String']>;
  emailAddress?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  gender?: Maybe<Gender>;
  id: Scalars['Int'];
  invitationLink?: Maybe<Scalars['String']>;
  invitationTransaction?: Maybe<ProfileEvent>;
  largeBannerUrl?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  location?: Maybe<Scalars['String']>;
  locationName?: Maybe<Scalars['String']>;
  lon?: Maybe<Scalars['Float']>;
  members?: Maybe<Array<Profile>>;
  memberships?: Maybe<Array<Membership>>;
  newsletter?: Maybe<Scalars['Boolean']>;
  origin?: Maybe<ProfileOrigin>;
  provenUniqueness?: Maybe<Scalars['Boolean']>;
  smallBannerUrl?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  successorOfCirclesAddress?: Maybe<Scalars['String']>;
  type?: Maybe<ProfileType>;
  verifications?: Maybe<Array<Verification>>;
};


export type ProfileBalancesArgs = {
  filter?: Maybe<CrcBalanceFilter>;
};


export type ProfileContactsArgs = {
  filter?: Maybe<ContactFilter>;
};

export type ProfileAggregate = {
  __typename?: 'ProfileAggregate';
  payload: AggregatePayload;
  safe_address: Scalars['String'];
  safe_address_profile?: Maybe<Profile>;
  type: Scalars['String'];
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
  block_number?: Maybe<Scalars['Int']>;
  contact_address?: Maybe<Scalars['String']>;
  contact_address_profile?: Maybe<Profile>;
  direction: Scalars['String'];
  payload?: Maybe<EventPayload>;
  safe_address: Scalars['String'];
  safe_address_profile?: Maybe<Profile>;
  tags?: Maybe<Array<Tag>>;
  timestamp: Scalars['String'];
  transaction_hash?: Maybe<Scalars['String']>;
  transaction_index?: Maybe<Scalars['Int']>;
  type: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type ProfileEventFilter = {
  direction?: Maybe<Direction>;
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  transactionHash?: Maybe<Scalars['String']>;
  with?: Maybe<Scalars['String']>;
};

export type ProfileOrOrganisation = Organisation | Profile;

export enum ProfileOrigin {
  CirclesGarden = 'CirclesGarden',
  CirclesLand = 'CirclesLand',
  Unknown = 'Unknown'
}

export enum ProfileType {
  Organisation = 'ORGANISATION',
  Person = 'PERSON',
  Region = 'REGION'
}

export type ProofUniquenessResult = {
  __typename?: 'ProofUniquenessResult';
  existingSafe?: Maybe<Scalars['String']>;
};

export type PublicEvent = {
  __typename?: 'PublicEvent';
  block_number?: Maybe<Scalars['Int']>;
  contact_address?: Maybe<Scalars['String']>;
  contact_address_profile?: Maybe<Profile>;
  payload?: Maybe<EventPayload>;
  timestamp: Scalars['String'];
  transaction_hash?: Maybe<Scalars['String']>;
  transaction_index?: Maybe<Scalars['Int']>;
  type: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  aggregates: Array<ProfileAggregate>;
  allBusinessCategories: Array<BusinessCategory>;
  allBusinesses: Array<Businesses>;
  allProfiles: Array<Maybe<ExportProfile>>;
  allTrusts: Array<ExportTrustRelation>;
  claimedInvitation?: Maybe<ClaimedInvitation>;
  clientAssertionJwt: Scalars['String'];
  commonTrust: Array<CommonTrust>;
  directPath: TransitivePath;
  events: Array<ProfileEvent>;
  findInvitationCreator?: Maybe<Profile>;
  findSafesByOwner: Array<SafeInfo>;
  getAllStringsByMaxVersion?: Maybe<Array<Maybe<I18n>>>;
  getAllStringsByMaxVersionAndLang?: Maybe<Array<Maybe<I18n>>>;
  getAvailableLanguages?: Maybe<Array<Maybe<I18n>>>;
  getOlderVersionsByKeyAndLang?: Maybe<Array<Maybe<I18n>>>;
  getPaginatedStrings?: Maybe<Array<Maybe<I18n>>>;
  getPaginatedStringsToUpdate?: Maybe<Array<Maybe<I18n>>>;
  getRandomAccount?: Maybe<RandomAccount>;
  getStringByMaxVersion?: Maybe<I18n>;
  getStringsToBeUpdatedAmount?: Maybe<Scalars['Int']>;
  hubSignupTransaction?: Maybe<ProfileEvent>;
  init: SessionInfo;
  invitationTransaction?: Maybe<ProfileEvent>;
  lastAcknowledgedAt?: Maybe<Scalars['Date']>;
  myFavorites: Array<Favorite>;
  myInvitations: Array<CreatedInvitation>;
  myProfile?: Maybe<Profile>;
  organisations: Array<Organisation>;
  organisationsByAddress: Array<Organisation>;
  paymentPath: TransitivePath;
  profilesById: Array<Profile>;
  profilesBySafeAddress: Array<Profile>;
  recentProfiles: Array<Profile>;
  regions: Array<Organisation>;
  safeInfo?: Maybe<SafeInfo>;
  search: Array<Profile>;
  sessionInfo: SessionInfo;
  signMessage: Scalars['String'];
  stats: Stats;
  tagById?: Maybe<Tag>;
  tags: Array<Tag>;
  trustRelations: Array<TrustRelation>;
  verifications: Array<Verification>;
  version: Version;
};


export type QueryAggregatesArgs = {
  filter?: Maybe<ProfileAggregateFilter>;
  safeAddress: Scalars['String'];
  types: Array<AggregateType>;
};


export type QueryAllBusinessesArgs = {
  queryParams?: Maybe<QueryAllBusinessesParameters>;
};


export type QueryAllProfilesArgs = {
  sinceLastChange?: Maybe<Scalars['Date']>;
};


export type QueryAllTrustsArgs = {
  sinceLastChange?: Maybe<Scalars['Date']>;
};


export type QueryCommonTrustArgs = {
  safeAddress1: Scalars['String'];
  safeAddress2: Scalars['String'];
};


export type QueryDirectPathArgs = {
  amount: Scalars['String'];
  from: Scalars['String'];
  to: Scalars['String'];
};


export type QueryEventsArgs = {
  filter?: Maybe<ProfileEventFilter>;
  pagination: PaginationArgs;
  safeAddress: Scalars['String'];
  types: Array<EventType>;
};


export type QueryFindInvitationCreatorArgs = {
  code: Scalars['String'];
};


export type QueryFindSafesByOwnerArgs = {
  owner: Scalars['String'];
};


export type QueryGetAllStringsByMaxVersionAndLangArgs = {
  lang?: Maybe<Scalars['String']>;
};


export type QueryGetOlderVersionsByKeyAndLangArgs = {
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
};


export type QueryGetPaginatedStringsArgs = {
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  pagination_key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};


export type QueryGetPaginatedStringsToUpdateArgs = {
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  needsUpdate?: Maybe<Scalars['Boolean']>;
  pagination_key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};


export type QueryGetStringByMaxVersionArgs = {
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
};


export type QueryGetStringsToBeUpdatedAmountArgs = {
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
};


export type QueryLastAcknowledgedAtArgs = {
  safeAddress: Scalars['String'];
};


export type QueryOrganisationsArgs = {
  pagination?: Maybe<PaginationArgs>;
};


export type QueryOrganisationsByAddressArgs = {
  addresses: Array<Scalars['String']>;
};


export type QueryPaymentPathArgs = {
  amount: Scalars['String'];
  from: Scalars['String'];
  to: Scalars['String'];
};


export type QueryProfilesByIdArgs = {
  ids: Array<Scalars['Int']>;
};


export type QueryProfilesBySafeAddressArgs = {
  safeAddresses: Array<Scalars['String']>;
};


export type QueryRecentProfilesArgs = {
  pagination?: Maybe<PaginationArgs>;
};


export type QueryRegionsArgs = {
  pagination?: Maybe<PaginationArgs>;
};


export type QuerySafeInfoArgs = {
  safeAddress?: Maybe<Scalars['String']>;
};


export type QuerySearchArgs = {
  query: SearchInput;
};


export type QuerySignMessageArgs = {
  key: Scalars['String'];
  message: Scalars['String'];
};


export type QueryTagByIdArgs = {
  id: Scalars['Int'];
};


export type QueryTagsArgs = {
  query: QueryTagsInput;
};


export type QueryTrustRelationsArgs = {
  safeAddress: Scalars['String'];
};


export type QueryVerificationsArgs = {
  filter?: Maybe<VerifiedSafesFilter>;
  pagination?: Maybe<PaginationArgs>;
};

export type QueryAllBusinessesConditions = {
  inCategories?: Maybe<Array<Scalars['Int']>>;
  inCirclesAddress?: Maybe<Array<Scalars['String']>>;
};

export type QueryAllBusinessesOrder = {
  orderBy: QueryAllBusinessesOrderOptions;
};

export enum QueryAllBusinessesOrderOptions {
  Alphabetical = 'Alphabetical',
  Favorites = 'Favorites',
  MostPopular = 'MostPopular',
  Nearest = 'Nearest',
  Newest = 'Newest',
  Oldest = 'Oldest'
}

export type QueryAllBusinessesParameters = {
  order?: Maybe<QueryAllBusinessesOrder>;
  ownCoordinates?: Maybe<Geolocation>;
  where?: Maybe<QueryAllBusinessesConditions>;
};

export type QueryProfileInput = {
  circlesAddress?: Maybe<Array<Scalars['String']>>;
  country?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Array<Scalars['Int']>>;
  lastName?: Maybe<Scalars['String']>;
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
  address?: Maybe<Scalars['String']>;
  privateKey?: Maybe<Scalars['String']>;
};

export type RedeemClaimedInvitationResult = {
  __typename?: 'RedeemClaimedInvitationResult';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  transactionHash?: Maybe<Scalars['String']>;
};

export type RejectMembershipResult = {
  __typename?: 'RejectMembershipResult';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type RemoveMemberResult = {
  __typename?: 'RemoveMemberResult';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type RequestUpdateSafeInput = {
  newSafeAddress: Scalars['String'];
};

export type RequestUpdateSafeResponse = {
  __typename?: 'RequestUpdateSafeResponse';
  challenge?: Maybe<Scalars['String']>;
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type SafeAddressByOwnerResult = {
  __typename?: 'SafeAddressByOwnerResult';
  safeAddress: Scalars['String'];
  type: Scalars['String'];
};

export type SafeInfo = {
  __typename?: 'SafeInfo';
  lastUbiAt?: Maybe<Scalars['String']>;
  randomValue?: Maybe<Scalars['String']>;
  safeAddress: Scalars['String'];
  safeProfile?: Maybe<Profile>;
  tokenAddress?: Maybe<Scalars['String']>;
  type: AccountType;
};

export type SafeVerified = IEventPayload & {
  __typename?: 'SafeVerified';
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
  safe_address: Scalars['String'];
  transaction_hash?: Maybe<Scalars['String']>;
};

export type SearchInput = {
  searchString: Scalars['String'];
};

export type SendMessageResult = {
  __typename?: 'SendMessageResult';
  error?: Maybe<Scalars['String']>;
  event?: Maybe<ProfileEvent>;
  success: Scalars['Boolean'];
};

export type Server = {
  __typename?: 'Server';
  version: Scalars['String'];
};

export type SessionInfo = {
  __typename?: 'SessionInfo';
  capabilities: Array<Capability>;
  hasProfile?: Maybe<Scalars['Boolean']>;
  isLoggedOn: Scalars['Boolean'];
  profile?: Maybe<Profile>;
  profileId?: Maybe<Scalars['Int']>;
  useShortSignup?: Maybe<Scalars['Boolean']>;
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Stats = {
  __typename?: 'Stats';
  goals: FibonacciGoals;
  leaderboard: Array<LeaderboardEntry>;
  myRank: MyInviteRank;
  profilesCount: Scalars['Int'];
  verificationsCount: Scalars['Int'];
};

export type Subscription = {
  __typename?: 'Subscription';
  events: NotificationEvent;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['Int'];
  order?: Maybe<Scalars['Int']>;
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type TagTransactionResult = {
  __typename?: 'TagTransactionResult';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  tag?: Maybe<Tag>;
};

export type TransitivePath = {
  __typename?: 'TransitivePath';
  flow: Scalars['String'];
  isValid: Scalars['Boolean'];
  requestedAmount: Scalars['String'];
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

export enum TrustDirection {
  In = 'IN',
  Mutual = 'MUTUAL',
  Out = 'OUT'
}

export type TrustRelation = {
  __typename?: 'TrustRelation';
  direction: TrustDirection;
  otherSafeAddress: Scalars['String'];
  otherSafeAddressProfile?: Maybe<Profile>;
  safeAddress: Scalars['String'];
  safeAddressProfile?: Maybe<Profile>;
};

export type UpdateSafeInput = {
  signature: Scalars['String'];
};

export type UpdateSafeResponse = {
  __typename?: 'UpdateSafeResponse';
  errorMessage?: Maybe<Scalars['String']>;
  newSafeAddress?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type UpsertOrganisationInput = {
  avatarMimeType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  businessCategoryId?: Maybe<Scalars['Int']>;
  businessHoursFriday?: Maybe<Scalars['String']>;
  businessHoursMonday?: Maybe<Scalars['String']>;
  businessHoursSaturday?: Maybe<Scalars['String']>;
  businessHoursSunday?: Maybe<Scalars['String']>;
  businessHoursThursday?: Maybe<Scalars['String']>;
  businessHoursTuesday?: Maybe<Scalars['String']>;
  businessHoursWednesday?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  displayCurrency?: Maybe<DisplayCurrency>;
  id?: Maybe<Scalars['Int']>;
  largeBannerUrl?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  location?: Maybe<Scalars['String']>;
  locationName?: Maybe<Scalars['String']>;
  lon?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
  smallBannerUrl?: Maybe<Scalars['String']>;
};

export type UpsertProfileInput = {
  age?: Maybe<Scalars['Int']>;
  askedForEmailAddress?: Maybe<Scalars['Boolean']>;
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  circlesSafeOwner?: Maybe<Scalars['String']>;
  circlesTokenAddress?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  displayCurrency?: Maybe<DisplayCurrency>;
  displayTimeCircles?: Maybe<Scalars['Boolean']>;
  dream?: Maybe<Scalars['String']>;
  emailAddress?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  gender?: Maybe<Gender>;
  id?: Maybe<Scalars['Int']>;
  lastName?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  location?: Maybe<Scalars['String']>;
  locationName?: Maybe<Scalars['String']>;
  lon?: Maybe<Scalars['Float']>;
  newsletter?: Maybe<Scalars['Boolean']>;
  status: Scalars['String'];
  successorOfCirclesAddress?: Maybe<Scalars['String']>;
};

export type UpsertTagInput = {
  id?: Maybe<Scalars['Int']>;
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type Verification = {
  __typename?: 'Verification';
  createdAt: Scalars['String'];
  revokedAt?: Maybe<Scalars['String']>;
  revokedProfile?: Maybe<Profile>;
  verificationRewardTransaction?: Maybe<ProfileEvent>;
  verificationRewardTransactionHash: Scalars['String'];
  verifiedProfile?: Maybe<Profile>;
  verifiedSafeAddress: Scalars['String'];
  verifierProfile?: Maybe<Organisation>;
  verifierSafeAddress: Scalars['String'];
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
  invitedBy: Scalars['String'];
  invitedBy_profile?: Maybe<Profile>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type I18n = {
  __typename?: 'i18n';
  createdBy?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  needsUpdate?: Maybe<Scalars['Boolean']>;
  pagination_key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
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
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl'>
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
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
      & Pick<Organisation, 'id' | 'avatarMimeType' | 'avatarUrl' | 'circlesAddress' | 'circlesSafeOwner' | 'createdAt' | 'description' | 'name' | 'location' | 'locationName' | 'lat' | 'lon'>
    )> }
  ) }
);

export type ImportOrganisationsMutationVariables = Exact<{ [key: string]: never; }>;


export type ImportOrganisationsMutation = (
  { __typename?: 'Mutation' }
  & { importOrganisationsOfAccount: Array<(
    { __typename?: 'Organisation' }
    & Pick<Organisation, 'id' | 'circlesAddress' | 'name' | 'description' | 'avatarUrl'>
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

export type ProofUniquenessMutationVariables = Exact<{
  humanodeToken: Scalars['String'];
}>;


export type ProofUniquenessMutation = (
  { __typename?: 'Mutation' }
  & { proofUniqueness: (
    { __typename?: 'ProofUniquenessResult' }
    & Pick<ProofUniquenessResult, 'existingSafe'>
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
      & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'invitationLink' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'emailAddress' | 'askedForEmailAddress' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'newsletter' | 'displayTimeCircles' | 'provenUniqueness' | 'location' | 'locationName' | 'lat' | 'lon' | 'circlesTokenAddress'>
      & { memberships?: Maybe<Array<(
        { __typename?: 'Membership' }
        & Pick<Membership, 'isAdmin'>
        & { organisation: (
          { __typename?: 'Organisation' }
          & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl'>
        ) }
      )>>, verifications?: Maybe<Array<(
        { __typename?: 'Verification' }
        & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
        & { verifierProfile?: Maybe<(
          { __typename?: 'Organisation' }
          & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
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
    & Pick<SessionInfo, 'isLoggedOn' | 'hasProfile' | 'profileId' | 'useShortSignup'>
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
    & { payload?: Maybe<{ __typename?: 'CrcHubTransfer' } | { __typename?: 'CrcMinting' } | (
      { __typename?: 'CrcSignup' }
      & Pick<CrcSignup, 'token'>
    ) | { __typename?: 'CrcTokenTransfer' } | { __typename?: 'CrcTrust' } | { __typename?: 'Erc20Transfer' } | { __typename?: 'EthTransfer' } | { __typename?: 'GnosisSafeEthTransfer' } | { __typename?: 'InvitationCreated' } | { __typename?: 'InvitationRedeemed' } | { __typename?: 'MemberAdded' } | { __typename?: 'MembershipAccepted' } | { __typename?: 'MembershipOffer' } | { __typename?: 'MembershipRejected' } | { __typename?: 'NewUser' } | { __typename?: 'OrganisationCreated' } | { __typename?: 'SafeVerified' } | { __typename?: 'WelcomeMessage' }> }
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
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'invitationLink' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'emailAddress' | 'askedForEmailAddress' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'newsletter' | 'displayTimeCircles' | 'provenUniqueness'>
    & { memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl'>
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
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
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'avatarUrl' | 'provenUniqueness'>
    & { memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl'>
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name' | 'displayName'>
      )> }
    )>> }
  )> }
);

export type ProfilesByNameQueryVariables = Exact<{
  searchString: Scalars['String'];
}>;


export type ProfilesByNameQuery = (
  { __typename?: 'Query' }
  & { search: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'origin' | 'circlesSafeOwner' | 'circlesAddress' | 'displayCurrency' | 'successorOfCirclesAddress' | 'avatarUrl' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'country' | 'provenUniqueness'>
    & { verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name' | 'displayName'>
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
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name' | 'displayName'>
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
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'origin' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'avatarUrl' | 'provenUniqueness' | 'location' | 'locationName' | 'lat' | 'lon'>
    & { memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl'>
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name' | 'displayName'>
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
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name' | 'displayName'>
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
          & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
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
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name' | 'displayName'>
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
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'invitationLink' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'emailAddress' | 'askedForEmailAddress' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'newsletter' | 'displayTimeCircles' | 'provenUniqueness' | 'location' | 'locationName' | 'lat' | 'lon' | 'circlesTokenAddress'>
    & { memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl'>
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
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
    & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'createdAt' | 'name' | 'avatarUrl' | 'location' | 'locationName'>
  )> }
);

export type RegionsQueryVariables = Exact<{ [key: string]: never; }>;


export type RegionsQuery = (
  { __typename?: 'Query' }
  & { regions: Array<(
    { __typename?: 'Organisation' }
    & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'createdAt' | 'name' | 'avatarUrl'>
  )> }
);

export type OrganisationsByAddressQueryVariables = Exact<{
  addresses: Array<Scalars['String']> | Scalars['String'];
}>;


export type OrganisationsByAddressQuery = (
  { __typename?: 'Query' }
  & { organisationsByAddress: Array<(
    { __typename?: 'Organisation' }
    & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'createdAt' | 'name' | 'avatarUrl' | 'displayName' | 'location' | 'locationName'>
    & { members?: Maybe<Array<(
      { __typename?: 'Organisation' }
      & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'createdAt' | 'name' | 'displayName' | 'avatarUrl'>
    ) | (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'successorOfCirclesAddress' | 'circlesSafeOwner' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'provenUniqueness'>
      & { verifications?: Maybe<Array<(
        { __typename?: 'Verification' }
        & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
        & { verifierProfile?: Maybe<(
          { __typename?: 'Organisation' }
          & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
        )> }
      )>> }
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
    & Pick<ProfileEvent, 'timestamp' | 'transaction_hash' | 'block_number' | 'safe_address' | 'contact_address' | 'direction' | 'type'>
    & { contact_address_profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'type' | 'successorOfCirclesAddress' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'provenUniqueness'>
    )>, payload?: Maybe<(
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
      { __typename?: 'CrcSignup' }
      & Pick<CrcSignup, 'transaction_hash' | 'user' | 'token'>
    ) | { __typename?: 'CrcTokenTransfer' } | (
      { __typename?: 'CrcTrust' }
      & Pick<CrcTrust, 'transaction_hash' | 'address' | 'can_send_to' | 'limit'>
      & { can_send_to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )> }
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
      { __typename?: 'EthTransfer' }
      & Pick<EthTransfer, 'transaction_hash' | 'from' | 'to' | 'value'>
    ) | (
      { __typename?: 'GnosisSafeEthTransfer' }
      & Pick<GnosisSafeEthTransfer, 'transaction_hash' | 'initiator' | 'from' | 'to' | 'value'>
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
      { __typename?: 'MemberAdded' }
      & Pick<MemberAdded, 'createdBy' | 'isAdmin' | 'member' | 'organisation'>
      & { organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'locationName' | 'location'>
      )> }
    ) | (
      { __typename?: 'MembershipAccepted' }
      & Pick<MembershipAccepted, 'createdBy' | 'member' | 'organisation'>
      & { member_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'locationName' | 'location'>
      )> }
    ) | (
      { __typename?: 'MembershipOffer' }
      & Pick<MembershipOffer, 'createdBy' | 'organisation' | 'isAdmin'>
      & { createdBy_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'locationName' | 'location'>
      )> }
    ) | (
      { __typename?: 'MembershipRejected' }
      & Pick<MembershipRejected, 'member' | 'organisation'>
      & { member_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'locationName' | 'location'>
      )> }
    ) | (
      { __typename?: 'NewUser' }
      & { profile: (
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      ) }
    ) | (
      { __typename?: 'OrganisationCreated' }
      & Pick<OrganisationCreated, 'organisation'>
      & { organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'locationName' | 'location'>
      )> }
    ) | (
      { __typename?: 'SafeVerified' }
      & Pick<SafeVerified, 'safe_address'>
      & { organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'locationName' | 'location'>
      )> }
    ) | (
      { __typename?: 'WelcomeMessage' }
      & Pick<WelcomeMessage, 'invitedBy'>
      & { invitedBy_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )> }
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
              & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl' | 'locationName' | 'location'>
            ) }
          )>>, members?: Maybe<Array<(
            { __typename?: 'Profile' }
            & Pick<Profile, 'type' | 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
          )>>, verifications?: Maybe<Array<(
            { __typename?: 'Verification' }
            & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
            & { verifierProfile?: Maybe<(
              { __typename?: 'Organisation' }
              & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
            )> }
          )>> }
        )> }
      )> }
    ) | (
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
      { __typename?: 'Members' }
      & Pick<Members, 'lastUpdatedAt'>
      & { members: Array<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'circlesAddress' | 'displayCurrency'>
      ) | (
        { __typename?: 'Profile' }
        & Pick<Profile, 'successorOfCirclesAddress' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )> }
    ) | (
      { __typename?: 'Memberships' }
      & Pick<Memberships, 'lastUpdatedAt'>
      & { organisations: Array<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl'>
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
      & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
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

export type MyFavoritesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyFavoritesQuery = (
  { __typename?: 'Query' }
  & { myFavorites: Array<(
    { __typename?: 'Favorite' }
    & Pick<Favorite, 'createdAt' | 'createdByAddress' | 'favoriteAddress' | 'comment'>
  )> }
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
    mutation upsertProfile($id: Int, $firstName: String!, $lastName: String, $emailAddress: String, $askedForEmailAddress: Boolean!, $dream: String, $country: String, $avatarUrl: String, $avatarCid: String, $avatarMimeType: String, $circlesAddress: String, $circlesSafeOwner: String, $newsletter: Boolean, $displayCurrency: DisplayCurrency, $displayTimeCircles: Boolean, $status: String!, $successorOfCirclesAddress: String, $gender: Gender, $location: String, $locationName: String, $lat: Float, $lon: Float) {
  upsertProfile(
    data: {id: $id, firstName: $firstName, lastName: $lastName, emailAddress: $emailAddress, askedForEmailAddress: $askedForEmailAddress, dream: $dream, country: $country, avatarUrl: $avatarUrl, avatarCid: $avatarCid, avatarMimeType: $avatarMimeType, circlesAddress: $circlesAddress, circlesSafeOwner: $circlesSafeOwner, newsletter: $newsletter, displayCurrency: $displayCurrency, displayTimeCircles: $displayTimeCircles, status: $status, successorOfCirclesAddress: $successorOfCirclesAddress, gender: $gender, location: $location, locationName: $locationName, lat: $lat, lon: $lon}
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
        name
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
        name
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
      name
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
    name
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
export const ProofUniquenessDocument = gql`
    mutation proofUniqueness($humanodeToken: String!) {
  proofUniqueness(humanodeToken: $humanodeToken) {
    existingSafe
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
          name
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
          name
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
        name
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
        name
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
        name
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
        name
        displayName
      }
    }
  }
}
    `;
export const ProfilesByNameDocument = gql`
    query profilesByName($searchString: String!) {
  search(query: {searchString: $searchString}) {
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
        name
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
        name
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
    memberships {
      isAdmin
      organisation {
        id
        circlesAddress
        displayCurrency
        displayName
        circlesSafeOwner
        name
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
        name
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
        name
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
          name
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
        name
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
        name
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
        name
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
    name
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
    name
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
    name
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
        name
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
            name
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
          name
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
          name
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
          name
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
          name
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
          name
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
          name
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
                name
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
                name
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
          name
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
      name
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
    proofUniqueness(variables: ProofUniquenessMutationVariables): Promise<ProofUniquenessMutation> {
      return withWrapper(() => client.request<ProofUniquenessMutation>(print(ProofUniquenessDocument), variables));
    },
    setIsFavorite(variables: SetIsFavoriteMutationVariables): Promise<SetIsFavoriteMutation> {
      return withWrapper(() => client.request<SetIsFavoriteMutation>(print(SetIsFavoriteDocument), variables));
    },
    shareLink(variables: ShareLinkMutationVariables): Promise<ShareLinkMutation> {
      return withWrapper(() => client.request<ShareLinkMutation>(print(ShareLinkDocument), variables));
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
    myFavorites(variables?: MyFavoritesQueryVariables): Promise<MyFavoritesQuery> {
      return withWrapper(() => client.request<MyFavoritesQuery>(print(MyFavoritesDocument), variables));
    },
    events(variables?: EventsSubscriptionVariables): Promise<EventsSubscription> {
      return withWrapper(() => client.request<EventsSubscription>(print(EventsDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;