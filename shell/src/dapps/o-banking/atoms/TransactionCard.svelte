<script lang="ts">
import { push } from "svelte-spa-router";
import { me } from "../../../shared/stores/me";
import { Currency } from "../../../shared/currency";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import relativeTimeString from "../../../shared/functions/relativeTimeString";

import {
  CrcHubTransfer,
  CrcMinting,
  Erc20Transfer,
  EventType,
  Profile,
  ProfileEvent,
} from "../../../shared/api/data/types";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { onMount } from "svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import { isMobile } from "../../../shared/functions/isMobile";
export let event: ProfileEvent;

let path: any;
let fromProfile: Profile = <any>{};
let toProfile: Profile = <any>{};
let error: string;
let message: string | undefined = undefined;
let messageString: string = "";
let targetProfile: Profile = <any>{};
let amount: string | number = "";
let amountTime: string | number = "";

$: {
  if (event && event.payload?.__typename == "CrcMinting") {
    const minting = event.payload as CrcMinting;

    toProfile = minting.to_profile ?? {
      id: 0,
      firstName: minting.to.substr(0, 24) + "...",
      lastName: "",
      circlesAddress: minting.to,
    };

    fromProfile = toProfile;

    amount = Currency.instance().displayAmount(
      event.payload && event.payload.value ? event.payload.value.toString() : "0",
      event.timestamp,
      $me.displayCurrency
    );
    amountTime = Currency.instance()
      .displayAmount(
        event.payload && event.payload.value ? event.payload.value.toString() : "0",
        event.timestamp,
        "TIME_CRC",
        null
      )
      .toString();

    message = "Universal basic income";
  }

  if (event && event.payload?.__typename == "Erc20Transfer") {
    const ercTransfer = event.payload as Erc20Transfer;
    fromProfile = ercTransfer.from_profile ?? {
      id: 0,
      firstName: "Circles Land",
      lastName: "",
      avatarUrl: "/logos/erc20.png",
      circlesAddress: ercTransfer.from,
    };

    toProfile = ercTransfer.to_profile ?? {
      id: 0,
      firstName: ercTransfer.to.substr(0, 24) + "...",
      lastName: "",
      circlesAddress: ercTransfer.to,
    };
    amount = parseFloat(RpcGateway.get().utils.fromWei(ercTransfer.value, "ether")).toFixed(2);
    message = "ERC-20 Transfer";
    amountTime = amount;
  }

  if (event && event.payload?.__typename == "CrcHubTransfer") {
    const hubTransfer = event.payload as CrcHubTransfer;
    fromProfile = hubTransfer.from_profile ?? {
      id: 0,
      firstName: hubTransfer.from.substr(0, 24) + "...",
      lastName: "",
      circlesAddress: hubTransfer.from,
    };

    toProfile = hubTransfer.to_profile ?? {
      id: 0,
      firstName: hubTransfer.to.substr(0, 24) + "...",
      lastName: "",
      circlesAddress: hubTransfer.to,
    };

    path = {
      transfers: hubTransfer.transfers,
    };

    message = hubTransfer.tags?.find((o) => o.typeId === "o-banking:transfer:message:1")?.value;

    if (event.payload?.__typename == EventType.CrcHubTransfer) {
      const ht = <CrcHubTransfer>event.payload;
      amount = Currency.instance().displayAmount(
        event.payload && ht.flow ? ht.flow.toString() : "0",
        event.timestamp,
        $me.displayCurrency ? $me.displayCurrency : "EURS"
      );

      amountTime = Currency.instance()
        .displayAmount(event.payload && ht.flow ? ht.flow.toString() : "0", event.timestamp, "TIME_CRC", null)
        .toString();
    }

    if (event.direction == "out") {
      amountTime = "-" + amountTime;
    }
  }

  if (event.timestamp) {
    messageString = relativeTimeString(event.timestamp, 7);
  }
  if (message) {
    messageString += ` - ${message}`;
  }

  targetProfile = event.direction === "in" ? fromProfile : toProfile;
}
function loadDetailPage(path) {
  push(`#/banking/transactions/${path}`);
}
let textCutoff = isMobile() ? 16 : 42;
</script>

<div role="presentation" on:click="{() => loadDetailPage(event.transaction_hash)}" class="cursor-pointer">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: targetProfile,
      profileLink: `#/contacts/profile/${targetProfile.circlesAddress}`,
      imageAlt: event.direction === 'in' ? fromProfile.circlesAddress : toProfile.circlesAddress,
      title: targetProfile.displayName,
      titleBold: event.unread,
      subTitle: messageString ? messageString : '',
      truncateMain: true,
      endTextBig: amountTime,
      profileLink: true,
      mobileTextCutoff: 19,
      endTextBigClass: amountTime.startsWith('-') ? 'text-negative' : undefined,
    }}">
    <div slot="itemCardBody" class="w-full">
      <div class="flex-col flex-grow">
        <div class="flex flex-row items-center justify-between px-3 text-left">
          <div class="flex-grow min-w-0">
            <h2 class="overflow-hidden text-xl text-heading font-heading whitespace-nowrap overflow-ellipsis">
              {#if event.unread}
                <b
                  >{targetProfile.displayName
                    ? targetProfile.displayName.length >= textCutoff
                      ? targetProfile.displayName.substr(0, textCutoff) + "..."
                      : targetProfile.displayName
                    : ""}</b>
              {:else}
                {targetProfile.displayName
                  ? targetProfile.displayName.length >= textCutoff
                    ? targetProfile.displayName.substr(0, textCutoff) + "..."
                    : targetProfile.displayName
                  : ""}
              {/if}
            </h2>
          </div>
          <div
            class="self-end text-right pl-2 text-lg {amountTime.startsWith('-')
              ? 'text-negative'
              : 'text-positive'} whitespace-nowrap">
            <span>{amountTime}</span>
            <Icons icon="timeCircle" size="{4}" customClass="inline inline-icon " />
          </div>
        </div>
        <div class="flex flex-row items-center justify-between px-3 -mt-1 text-left">
          <div class="flex-grow leading-none">
            <span class="inline-block text-xs">
              {messageString
                ? messageString.length >= textCutoff + 6
                  ? messageString.substr(0, textCutoff + 6) + "..."
                  : messageString
                : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  </ItemCard>
</div>
