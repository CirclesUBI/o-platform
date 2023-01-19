<script lang="ts">
import { onMount } from "svelte";
import Time from "svelte-time";
import UserImage from "src/shared/atoms/UserImage.svelte";
import { me } from "../../../shared/stores/me";
import { Currency } from "../../../shared/currency";
import { loadProfile } from "../../../shared/functions/loadProfile";
import Label from "../../../shared/atoms/Label.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";

export let context: any;
let _context: any;
let profile: any;

$: {
  _context = context;
}

onMount(async () => {
  profile = (await loadProfile(context.data.recipientAddress, $me))?.profile;
});

let classes: string;
let now = new Date();
</script>

{#if _context.data && profile}
  <div class="flex flex-col items-center self-center w-full m-auto space-y-4 text-center justify-self-center">
    <div>
      <span class="inline-block text-5xl font-enso {classes}">
        {_context.data.tokens.amount}
      </span>
      <span class="text-4xl font-enso {classes}">
        <Icons icon="timeCircle" size="{11}" customClass="inline -mt-3" /></span>
    </div>

    <UserImage profile="{profile}" size="{36}" gradientRing="{true}" />

    <div>
      <span class="mt-4 text-xl">
        to {profile.displayName}
      </span>
    </div>
    <div class="text-dark-lightest">
      {_context.data.message ? _context.data.message : ""}
    </div>

    <div class="flex flex-col w-full space-y-1">
      <div class="mb-1 text-left text-2xs text-dark-lightest">
        <Label key="common.date" />
      </div>

      <div class="flex items-center w-full">
        <div class="text-left ">
          <Time timestamp="{now}" format="D. MMMM YYYY HH:mm" />
        </div>
      </div>
    </div>

    <div class="flex flex-col w-full space-y-1">
      <div class="mb-1 text-left text-2xs text-dark-lightest">
        <Label key="dapps.o-banking.atoms.transferSummary.recipientAddress" />
      </div>

      <div class="flex items-center w-full">
        <div class="text-left break-all">{profile.circlesAddress}</div>
      </div>
    </div>

    <div class="flex flex-col w-full space-y-1">
      <div class="mb-1 text-left text-2xs text-dark-lightest">
        <Label key="dapps.o-banking.atoms.transferSummary.block" />
      </div>

      <div class="flex items-center w-full">
        <div class="text-left break-all">
          {_context.data.receipt ? _context.data.receipt.blockNumber : ""}
        </div>
      </div>
    </div>

    <div class="flex flex-col w-full space-y-1">
      <div class="mb-1 text-left text-2xs text-dark-lightest">
        <Label key="dapps.o-banking.atoms.transferSummary.transactionHash" />
      </div>

      <div class="flex items-center w-full text-primarydark">
        <div class="text-left break-all">
          {_context.data.receipt ? _context.data.receipt.transactionHash : ""}
        </div>
      </div>
    </div>
  </div>
{/if}
