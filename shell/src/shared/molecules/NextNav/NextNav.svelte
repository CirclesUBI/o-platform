<script lang="ts">
import NavPill from "./Components/NavPill.svelte";
import LoginPill from "./Components/LoginPill.svelte";
import { NavigationManifest } from "@o-platform/o-interfaces/dist/navigationManifest";
import Icons from "../Icons.svelte";
import { push } from "svelte-spa-router";

export let navigation: NavigationManifest;
export let width: string = "w-full";
export let isNotFoundPage: boolean = false;
</script>

<footer
  id="nextnav"
  class:nextnav="{!navigation.hideFooterGradient}"
  class="fixed bottom-0 right-0 z-50 grid justify-center {width} h-20
  grid-cols-3 pb-3 auto-cols-max place-content-center text-dark">
  {#if navigation.leftSlot}
    <div class="grid grid-cols-2">
      <div
        class="flex items-center justify-center w-12 h-12 ml-4 {navigation.leftSlot.props.backgroundColorClass
          ? 'bg-' + navigation.leftSlot.props.backgroundColorClass
          : 'bg-white'} rounded-full cursor-pointer"
        class:text-white="{navigation.leftSlot.props.backgroundColorClass}"
        role="presentation"
        on:click="{navigation.leftSlot.props.action}">
        <svelte:component this="{navigation.leftSlot.component}" {...navigation.leftSlot.props} on:menuButton />
      </div>
    </div>
  {/if}
  {#if navigation.navPill}
    <NavPill
      on:actionButton="{() => {
        navigation.navPill.center.props.action();
      }}"
      navigation={navigation}
      props="{navigation.navPill}" />
  {/if}
  {#if navigation.loginPill && !isNotFoundPage}
    <LoginPill
      on:actionButton="{() => {
        navigation.loginPill.props.action();
      }}"
      props="{navigation.loginPill}" />
  {/if}
  {#if isNotFoundPage}
    <div class="home-icon-container">
      <button
        on:click="{() => {
          push('#/home');
        }}">
        <Icons icon="home" customClass="home-icon w-12 h-12" />
      </button>
    </div>
  {/if}
</footer>

<style>
.nextnav {
  --tw-text-opacity: 1;
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
}

:global(.home-icon-container) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:global(.home-icon) {
  cursor: pointer;
}
</style>
