<script lang="ts">
import { dapps } from "../../loader";
import { onMount } from "svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { _ } from "svelte-i18n";
import LinkPill from "../atoms/LinkPill.svelte";
import { getRouteList } from "../functions/getRouteList";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
import ActionListItem from "../atoms/ActionListItem.svelte";
import getJumplistItems from "../functions/getJumplistItemsFromManifests";
export let runtimeDapp: RuntimeDapp<any>;
export let routable: RuntimeDapp<any>;

let navigation = [];
let actions: JumplistItem[] = [];
let jumplistitems;

onMount(async () => {
  loadJumplist();

  window.o.events.subscribe((event: any) => {
    if (event.type !== "shell.routeChanged") return;
    runtimeDapp = event.runtimeDapp;
    routable = event.routable;
    loadJumplist();
  });
});

function loadJumplist() {
  const manifestsWithJumplist = <DappManifest<any>[]>[runtimeDapp];

  getJumplistItems(manifestsWithJumplist, runtimeDapp)
    .then((result) => {
      jumplistitems = result;
      actions = jumplistitems && jumplistitems.actions ? jumplistitems.actions : null;
    })
    .catch((err) => {
      console.log("ERROR loading Jumplist in time..");
    });
}

$: {
  if (runtimeDapp && routable) {
    navigation = getRouteList(runtimeDapp, runtimeDapp, routable);
  } else {
    navigation = [];
  }

  runtimeDapp;
}

function handleClick(action) {
  if (action.event) {
    window.o.publishEvent(action.event);
  }
  if (action.action) {
    action.action();
  }
}
</script>

<div class:textColor="{runtimeDapp.dappId == 'homepage:1'}" class="z-10 flex flex-col flex-1}">
  <nav class="flex flex-col flex-1 w-auto p-4 mt-4"></nav>
  <div class="flex-shrink-0 w-auto pt-4 mb-10 space-y-2">
    {#if navigation}
      {#if actions}
        {#each actions as action}
          <ActionListItem icon="{action.icon}" title="{action.title}" colorClass="{action.colorClass}" on:click="{() => handleClick(action)}" isListItem="{true}" />
        {/each}
      {/if}
      {#each navigation as navItem}
        <LinkPill
          props="{{
            icon: navItem.icon,
            text: $_(`${navItem.title}`),
            i18nKey: navItem.title,
            link: navItem.url,
            extern: navItem.extern,
            isActive: navItem.isActive,
          }}" />
      {/each}
    {/if}
  </div>
  <!-- REMOVED AS PER BALI REQUEST -->
  <!-- <div class="relative flex-shrink-0 w-auto pt-2 pb-12">
        <LinkPill
          props="{{
            text: $_('common.privacyPolicy'),
            i18nKey: 'common.privacyPolicy',
            link: 'homepage/privacy',
            extern: false,
            isSmall: true,
          }}" />
        <LinkPill
          props="{{
            text: $_('common.termsOfService'),
            i18nKey: 'common.termsOfService',
            link: 'homepage/terms',
            extern: false,
            isSmall: true,
          }}" />
      </div> -->
</div>

<style>
@media (min-width: 1536px) {
  .textColor {
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }
}
</style>
