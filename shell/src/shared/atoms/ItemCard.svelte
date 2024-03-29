<script lang="ts">
import { isMobile } from "../functions/isMobile";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import AssetImage from "./AssetImage.svelte";
import UserImage from "./UserImage.svelte";

export let params = {
  imageUrl: null,
  imageAlt: null,
  title: null,
  titleBold: null,
  subTitle: null,
  noTruncate: null,
  edgeless: null,
  inline: false,
  shadowSmall: true,
  shadowMedium: null,
  noShadow: false,
  action: null,
  imageAction: null,
  endTextBig: null,
  endTextBigClass: "text-positive",
  endTextSmall: null,
  imageProfile: null,
  profileLink: null,
  class: null,
  noLink: false,
  mobileTextCutoff: 16,
};

let textCutoff = isMobile() ? params.mobileTextCutoff : 42;

if (params.noTruncate) {
  textCutoff = 256;
}

// TODO: find a better way for this.
function cardAction() {
  if (params.action) {
    params.action();
  }
}
</script>

<section role="presentation" on:click="{() => cardAction()}" class:mb-3="{!params.inline}" class="{params.class ? params.class : ''}">
  <div class="flex items-center w-full space-x-2 bg-white border cardborder" class:p-3="{!params.edgeless}">
    <slot name="itemCardStart">
      {#if params.imageUrl}
        <AssetImage image="{params.imageUrl}" size="{12}" />
      {:else}
        <UserImage profile="{params.imageProfile}" size="{12}" profileLink="{params.profileLink}" />
      {/if}
    </slot>
    <slot name="itemCardBody">
      <div class="flex-col flex-grow">
        <div class="flex flex-row items-center justify-between text-left" class:px-3="{params.imageUrl}">
          <div class="flex-grow min-w-0">
            <h2 class="overflow-hidden text-base whitespace-nowrap overflow-ellipsis">
              {#if params.titleBold}
                <b>{params.title ? (params.title.length >= textCutoff ? params.title.slice(0, textCutoff) + "..." : params.title) : ""}</b>
              {:else}
                {params.title ? (params.title.length >= textCutoff ? params.title.slice(0, textCutoff) + "..." : params.title) : ""}
              {/if}
            </h2>
          </div>
          <div class="self-end text-right pl-2 {params.endTextBigClass} whitespace-nowrap" class:text-positive="{!params.endTextBigClass}">
            <span>{params.endTextBig ? params.endTextBig : ""}</span>
          </div>
        </div>
        <div class="flex flex-row items-center justify-between text-left" class:px-3="{params.imageUrl}">
          <div class="flex-grow leading-none">
            <span class="inline-block text-xs">
              {params.subTitle ? (params.subTitle.length >= textCutoff + 6 ? params.subTitle.slice(0, textCutoff + 6) + "..." : params.subTitle) : ""}
            </span>
          </div>
          <div class="text-xs text-right whitespace-nowrap leading-non">
            <slot name="itemCardEndSmallElement">
              <span class="inline-block">
                {params.endTextSmall ? params.endTextSmall : ""}
              </span>
            </slot>
          </div>
        </div>
      </div>
    </slot>
  </div>
</section>
