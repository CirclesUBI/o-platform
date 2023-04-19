<script lang="ts">
import UserImage from "../../../shared/atoms/UserImage.svelte";
import { me } from "../../../shared/stores/me";
import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";
import DetailActionBar from "../../../shared/molecules/DetailActionBar.svelte";

import { CommonTrust, CommonTrustDocument, CommonTrustQueryVariables, Contact, ContactDirection, ContactPoint, EventType, Profile, SessionInfo } from "../../../shared/api/data/types";
import { contacts } from "../../../shared/stores/contacts";
import { ApiClient } from "../../../shared/apiConnection";
import { isMobile } from "../../../shared/functions/isMobile";
import { UserActions, UserActionItem } from "../../../shared/userActions";

import { _ } from "svelte-i18n";
import Label from "../../../shared/atoms/Label.svelte";

export let id: string;

let error: string | undefined = undefined;
let displayName: string;
let trustMessage: string;
let isLoading: boolean = true;
let isMe: boolean = false;
let commonTrusts: CommonTrust[] = [];
let profile: Profile;
let contact: Contact;
let className: string;

let detailActions: UserActionItem[];

$: {
  isLoading = true;
  setProfile(id).then(() => (isLoading = false));
}

async function setProfile(id: string) {
  const c = await contacts.findBySafeAddress(id);
  if (!c) {
    return;
  }

  contact = c;
  profile = c.contactAddress_Profile;
  detailActions = [];

  if ($me.circlesAddress !== contact.contactAddress) {
    commonTrusts = (
      await ApiClient.query<CommonTrust[], CommonTrustQueryVariables>(CommonTrustDocument, {
        safeAddress1: $me.circlesAddress.toLowerCase(),
        safeAddress2: contact.contactAddress.toLowerCase(),
      })
    ).filter((o) => o.profile);
  } else {
    profile = <any>$me;

    $contacts.forEach((contact: Contact) => {
      const trustMetadata: ContactPoint = contact.metadata.find((p) => p.name === "CrcTrust");
      let trustIn = 0;
      let trustOut = 0;
      if (trustMetadata) {
        trustMetadata.directions.forEach((d, i) => {
          if (d == ContactDirection.In) {
            trustIn = parseInt(trustMetadata.values[i]);
          } else if (d == ContactDirection.Out) {
            trustOut = parseInt(trustMetadata.values[i]);
          }
        });
      }
      if (trustIn > 0 && trustOut > 0) {
        commonTrusts.push(<CommonTrust>{
          safeAddress1: $me.circlesAddress,
          safeAddress2: contact.contactAddress,
          profile: contact.contactAddress_Profile,
        });
      }
    });
  }

  displayName = contact.contactAddress_Profile.displayName;

  // displayName =
  //   displayName.length >= 22 ? displayName.substr(0, 22) + "..." : displayName;

  profile = contact.contactAddress_Profile;

  if (contact.metadata) {
    const trustMetadata: ContactPoint = contact.metadata.find((p) => p.name === EventType.CrcTrust);
    let trustIn = 0;
    let trustOut = 0;

    if (trustMetadata) {
      trustMetadata.directions.forEach((d, i) => {
        if (d == ContactDirection.In) {
          trustIn = parseInt(trustMetadata.values[i]);
        } else if (d == ContactDirection.Out) {
          trustOut = parseInt(trustMetadata.values[i]);
        }
      });
    }

    if (trustIn > 0 && trustOut > 0) {
      trustMessage = `${$_("dapps.o-contacts.pages.profile.mutualTrust")}`;
      className = "text-wallet";
    } else if (!trustIn && trustOut > 0) {
      trustMessage = `${$_("dapps.o-contacts.pages.profile.trustedByYou")}`;
      className = "text-contacts";
    } else if (trustIn > 0 && !trustOut) {
      trustMessage = `${$_("dapps.o-contacts.pages.profile.isTrustingYou")}`;
      className = "text-passport";
    } else {
      trustMessage = `${$_("dapps.o-contacts.pages.profile.notTrusted")}`;
    }
  }

  isMe = profile.id == ($me ? $me.id : 0);
  isLoading = false;

  const detailActionsPromise = UserActions.getAvailableActions(profile);
  const sessionInfoPromise = me.getSessionInfo();
  const promiseResults = await Promise.all([detailActionsPromise, sessionInfoPromise]);
  detailActions = <UserActionItem[]>promiseResults[0];
  const sessionInfo = <SessionInfo>promiseResults[1];

  const bannedProfile = {
    key: "banned",
    icon: "trash",
    colorClass: "text-alert-dark",
    title: `${$_("dapps.o-contacts.pages.profile.revokedUppercase")}`,
    action: () => {},
  };
}
</script>

{#if isLoading}
  <div class="p-5">
    <LoadingIndicator />
  </div>
{:else}
  <div class="p-5">
    <header class="grid overflow-hidden bg-white h-68">
      <div class="flex flex-col items-center self-center w-full m-auto text-center justify-self-center">
        <UserImage profile="{profile}" size="{42}" profileLink="{false}" />

        {#if profile && contact.contactAddress}
          <div class="mt-4 text-2xl break-words" class:text-3xl="{!isMobile() && !displayName.startsWith('0x')}" class:text-xs="{displayName.startsWith('0x')}">
            {displayName}
          </div>
        {/if}
      </div>
    </header>
    <div class="flex flex-col">
      <div class="mt-4">
        <div class="">
          {#if profile}
            {#if trustMessage && profile.circlesAddress !== $me.circlesAddress}
              <section class="justify-center mb-2">
                <div class="flex flex-col w-full pt-2 space-y-1">
                  <div class="font-bold text-left text-2xs">
                    {$_("dapps.o-contacts.pages.profile.trust")}
                  </div>
                  <div class="flex flex-wrap content-start {className}">
                    {trustMessage}
                  </div>
                </div>
              </section>
            {/if}
            <section class="justify-center mb-2">
              <div class="flex flex-col w-full pt-2 space-y-1">
                <div class="font-bold text-left text-2xs">
                  {$_("dapps.o-contacts.pages.profile.mutualFriends")}
                </div>
                <div class="flex flex-row flex-wrap mt-2">
                  {#if commonTrusts.length}
                    {#each commonTrusts as commonTrust}
                      {#if commonTrust.profile}
                        <div class="mt-2 mr-2">
                          <UserImage profile="{commonTrust.profile}" tooltip="{true}" />
                        </div>
                      {/if}
                    {/each}
                  {:else}
                    <Label key="dapps.o-contacts.pages.profile.noMutualFriends" />
                  {/if}
                </div>
              </div>
            </section>
            {#if profile.memberships && profile.memberships.length}
              <section class="justify-center mb-2">
                <div class="flex flex-col w-full pt-2 space-y-1">
                  <div class="font-bold text-left text-2xs">
                    {$_("dapps.o-contacts.pages.profile.memberAt")}
                  </div>
                  <div class="flex flex-row flex-wrap mt-2">
                    {#each profile.memberships as membership}
                      {#if membership.organisation}
                        <div class="mt-2 mr-2">
                          <UserImage profile="{membership.organisation}" tooltip="{true}" />
                        </div>
                      {/if}
                    {/each}
                  </div>
                </div>
              </section>
            {/if}
            {#if profile.members && profile.members.length}
              <section class="justify-center mb-2">
                <div class="flex flex-col w-full pt-2 space-y-1">
                  <div class="font-bold text-left text-2xs">
                    <Label key="dapps.o-contacts.pages.profile.members" />
                  </div>
                  <div class="flex flex-row flex-wrap mt-2">
                    {#each profile.members as memberProfile}
                      <div class="mt-2 mr-2">
                        <UserImage profile="{memberProfile}" tooltip="{true}" />
                      </div>
                    {/each}
                  </div>
                </div>
              </section>
            {/if}
          {/if}

          {#if profile && profile.circlesAddress}
            <section class="justify-center">
              <div class="flex flex-col w-full pt-2 space-y-1">
                <div class="mb-1 font-bold text-left text-2xs">
                  {$_("dapps.o-contacts.pages.profile.address")}
                </div>
                <div class="flex items-center w-full text-sm">
                  <Label text="{profile.circlesAddress}" truncate="{true}" />
                </div>
              </div>
            </section>
          {/if}
        </div>
      </div>

      {#if profile && detailActions && !isMe}
        <div class="sticky bottom-0 left-0 right-0 w-full pb-5 bg-white">
          <DetailActionBar actions="{detailActions}" />
        </div>
      {/if}
    </div>
  </div>
{/if}
