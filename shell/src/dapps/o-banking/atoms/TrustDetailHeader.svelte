<script lang="ts">
  let isLoading: boolean = true;

  export let profile: {
    id?: number;
    dream?: string;
    country?: string;
    safeAddress?: string;
    displayName: string;
    avatarUrl?: string;
    avatarCid?: string;
    avatarMimeType?: string;
    firstName?: string;
    lastName?: string;
    circlesAddress?: string;
    circlesSafeOwner?: string;

    // The incoming trust limit
    trustedBy?: number;
    // The outgoing trust limit
    trusting?: number;
  } = {};

  $: {
    if (profile.displayName) {
      isLoading = false;
    }
  }
</script>

<div
  class="flex flex-col items-stretch w-full text-white bg-cover h-60 justify-items-stretch bg-primary-dark"
  style="background-image: url(/images/common/nice-bg.jpg);">
  {#if !isLoading}
    <div class="self-center text-center justify-self-center">
      <div class="mb-4 rounded-full w-36 h-36">
        <img
          class="rounded-full"
          src="{profile && profile.avatarUrl ? profile.avatarUrl : ''}"
          alt="Avatar of {profile.displayName}" />
      </div>
    </div>
    <div class="self-center flex-grow text-center justify-self-start">
      <h2>
        {profile ? profile.displayName : ''}
      </h2>
    </div>
  {/if}
</div>
