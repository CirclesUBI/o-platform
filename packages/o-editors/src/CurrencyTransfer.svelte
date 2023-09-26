<script lang="ts">
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { CurrencyTransferContext } from "./currencyTransferContext";
import ProcessNavigation from "./ProcessNavigation.svelte";
import Icons from "@o-platform/shell/src/shared/molecules/Icons.svelte";
import Error from "@o-platform/shell/src/shared/atoms/Error.svelte";
import circlesIcon from "./dropdownItems/CirclesIcon.svelte";
import xdaiIcon from "./dropdownItems/XdaiIcon.svelte";
import { RpcGateway } from "../../o-circles/dist/rpcGateway";
import { convertCirclesToTimeCircles } from "@o-platform/shell/src/shared/functions/displayCirclesAmount";
import Label from "@o-platform/shell/src/shared/atoms/Label.svelte";
import { contacts } from "../../../shell/src/shared/stores/contacts";
import { CommonTrust, Contact, DirectPathDocument, Profile, QueryDirectPathArgs, TransitivePath } from "@o-platform/shell/src/shared/api/data/types";
import UserImage from "@o-platform/shell/src/shared/atoms/UserImage.svelte";
import { ok, err, Result } from "neverthrow";
import { onMount } from "svelte";
import { trustFromContactMetadata } from "@o-platform/shell/src/shared/functions/trustFromContactMetadata";
import { ApiClient } from "@o-platform/shell/src/shared/apiConnection";
import LoadingSpinner from "@o-platform/shell/src/shared/atoms/LoadingSpinner.svelte";
export let context: CurrencyTransferContext;

let Icon = circlesIcon;
let inputField: any;
let amount: string = context.data && context.data.tokens ? context.data.tokens.amount : "";
let maxAmount: string = "0";
let selected = context.data.tokens ? context.data.tokens.currency : "crc";
let selectedCurrency = context.params.currencies.find((o) => o.value === selected);
let contact: Contact;
let trustMessage: string;
let trustClassName: string;
let isLoading: boolean;
$: selectedCurrency = context.params.currencies.find((o) => o.value === selected);

$: {
  if (selected && context.data.maxFlows) {
    const key = selected.toLowerCase();
    if (context.data.maxFlows[key] != "") {
      maxAmount = Math.floor(convertCirclesToTimeCircles(parseFloat(RpcGateway.get().utils.fromWei(context.data.maxFlows[key], "ether").toString()), new Date().toJSON())).toFixed(0);
      console.log("RRRR", maxAmount);
    }
    console.log("DATA", context.data);
  }

  if (selectedCurrency && selectedCurrency.value == "crc") {
    Icon = circlesIcon;
  } else if (selectedCurrency && selectedCurrency.value == "xdai") {
    Icon = xdaiIcon;
  }
}

onMount(async () => {
  await setProfile(context.data.recipientProfile.circlesAddress);

  await getMaxFlow();

  const { trustIn, trustOut } = trustFromContactMetadata(contact);

  if (trustIn > 0 && trustOut > 0) {
    trustMessage = "dapps.o-contacts.atoms.contactCard.mutualTrust";
    trustClassName = "text-wallet";
  } else if (!trustIn && trustOut > 0) {
    trustMessage = "dapps.o-contacts.atoms.contactCard.trustedByYou";
    trustClassName = "text-contacts";
  } else if (trustIn > 0 && !trustOut) {
    trustMessage = "dapps.o-contacts.atoms.contactCard.isTrustingYou";
    trustClassName = "text-passport";
  } else {
    trustMessage = "dapps.o-contacts.atoms.contactCard.notTrusted";
  }
});

async function setProfile(id: string) {
  try {
    const c = await contacts.findBySafeAddress(id);
    if (!c) {
      console.log("GEHT NED");
      return;
    }
    contact = c;
  } catch (error) {
    return err(error);
  }
}

function sendAnswer(amount: string) {
  console.log("oana", amount);
  const event = new Continue();
  event.data = {};
  event.data[context.field] = {
    amount: amount,
    currency: selected,
  };

  context.data[context.field] = selectedCurrency.label;

  context.process.sendAnswer(event);
}

function handleSelect(event) {
  selected = event.detail.value;
}

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter") {
    sendAnswer(amount);
  }
}

async function getMaxFlow() {
  isLoading = true;
  let flow: any = {
    isValid: false,
  };
  let amount = "0";
  try {
    flow = await ApiClient.query<TransitivePath, QueryDirectPathArgs>(DirectPathDocument, {
      from: context.data.safeAddress,
      to: context.data.recipientAddress,
      amount: amount,
    });

    if (!context.data.maxFlows) {
      context.data.maxFlows = {};
    }
    context.data.maxFlows["crc"] = flow.flow;
    isLoading = false;
  } catch {
    console.log("error getting maxflow");
  }
}
</script>

<div>
  {#if maxAmount}
    <div class="flex flex-col items-center self-center w-full m-auto text-center justify-self-center">
      {#if trustMessage}
        <UserImage profile="{context.data.recipientProfile}" size="{36}" profileLink="{false}" />

        <div class="text-xl break-words">{context.data.recipientProfile.firstName}</div>
        <div class="{trustClassName} mb-4"><Label key="{trustMessage}" /></div>
      {/if}
      <div>
        <Label key="dapps.o-banking.processes.transfer.maximumAmount" values="{{ name: context.data.recipientProfile.firstName }}" />
        {#if isLoading}
          <center class="mt-2 mb-2">
            <LoadingSpinner />
          </center>
        {:else}
          <Icons icon="timeCircle" size="{4}" customClass="inline -mt-0.5 pr-0" /><span class="font-bold">{maxAmount}</span>
        {/if}
      </div>
    </div>
  {/if}
  {#if context.messages[context.field]}
    <Error message="{context.messages[context.field]}" />
  {/if}
  <div class="flex flex-row w-full space-x-2">
    <div class="relative w-full mt-1 rounded-md shadow-sm">
      <div class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
        <Icons icon="timeCircle" size="{4}" customClass="inline" />
      </div>
      <input
        type="text"
        name="price"
        id="price"
        class="block w-full pl-8 input input-bordered"
        placeholder="0.00"
        autocomplete="off"
        bind:value="{amount}"
        on:focus
        on:blur
        on:change="{() => (context.editorDirtyFlags[context.field] = true)}"
        bind:this="{inputField}"
        on:keydown="{onkeydown}" />
    </div>
  </div>
  <ProcessNavigation on:buttonClick="{() => sendAnswer(amount)}" context="{context}" />
</div>
