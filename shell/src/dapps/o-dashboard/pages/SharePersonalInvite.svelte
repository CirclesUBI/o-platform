<script lang="ts">
import QrCode from "../../../shared/molecules/QrCode/QrCode.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import CopyToClipboard from "../../../shared/atoms/CopyClipboard.svelte";
import { me } from "../../../shared/stores/me";
import Label from "../../../shared/atoms/Label.svelte";
import { _ } from "svelte-i18n";
import { onMount } from "svelte";

let foo = false;
let invitationLink: string = null;

$: me;

onMount(async () => {
  me.reload().then((o) => (invitationLink = o.invitationLink));
});
</script>

<section class="flex flex-col items-center justify-center p-6 space-y-4">
  <div class="w-full text-center">
    <h1 class="text-3xl tracking-normal uppercase font-heading text-heading">
      <Label key="dapps.o-dashboard.pages.shareInvitation.shareTitle" />
    </h1>
  </div>

  {#if $me && invitationLink}
    <div class="w-full text-center">
      <span class="text-dark-lightest">
        <Label key="dapps.o-dashboard.pages.shareInvitation.shareDescription" />
      </span>
    </div>
    <div class="w-full">
      <center>
        <QrCode value="{invitationLink}" size="{300}" />
      </center>
    </div>
    <hr />
    <div class="flex flex-row justify-around w-full space-x-4">
      <div class="w-12 h-12 text-center align-top list-none cursor-pointer copylink inline-table">
        <span class="inline table-cell w-12 h-12 align-middle rounded-full bg-light-light">
          <CopyToClipboard text="{invitationLink}" let:copy>
            <div role="presentation" on:click="{copy}">
              <Icons icon="link" customClass="inline w-6 h-6 heroicon smallicon" />
            </div>
          </CopyToClipboard>
        </span>
      </div>
      <div class="w-12 h-12 text-center align-top list-none cursor-pointer copylink inline-table">
        <span class="inline table-cell w-12 h-12 align-middle rounded-full bg-light-light">
          <a href="mailto:?subject=Invitation%20to%20Circlesland&body={$_('common.whatsappInviteText')} {invitationLink}" target="_blank" rel="noreferrer">
            <Icons icon="mail" customClass="inline w-6 h-6 heroicon smallicon" />
          </a>
        </span>
      </div>
      <div class="-mt-1 text-center align-top list-none cursor-pointer whatsapp inline-table">
        <a href="https://wa.me/?text={$_('common.whatsappInviteText')} {invitationLink}" target="_blank" rel="noreferrer">
          <Icons icon="whatsapp" customClass="inline" size="{14}" />
        </a>
      </div>
      <div class="text-center align-top list-none cursor-pointer telegram inline-table">
        <a href="https://telegram.me/share/url?url={invitationLink}&text={$_('common.whatsappInviteText')}" target="_blank" rel="noreferrer">
          <Icons icon="telegram" customClass="inline" size="{11}" />
        </a>
      </div>
    </div>
  {:else}
    <div class="w-full text-center">
      <span class="text-alert"><Label key="dapps.o-dashboard.pages.shareInvitation.shareRefused" /></span>
    </div>
  {/if}
</section>
