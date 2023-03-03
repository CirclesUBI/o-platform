<script lang="ts">
import { upsertIdentity } from "../processes/upsertIdentity";
import { me } from "../../../shared/stores/me";
import { loadProfile } from "../processes/identify/services/loadProfile";
import TopNav from "../../../shared/atoms/TopNav.svelte";
import PageHeader from "../../../shared/atoms/PageHeader.svelte";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { Profile, Organisation } from "../../../shared/api/data/types";
import { upsertOrganisation } from "../../o-coop/processes/upsertOrganisation";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
let profile: Profile | Organisation;
let displayName: string;

export let params: {
  profileId?: string;
};

async function execLoadProfile(profileId?: string) {
  if (profileId && parseInt(profileId)) {
    profile = await loadProfile(parseInt(profileId));
  }
}

let avatarUrl: string = "";
$: {
  if (params && params.profileId) {
    execLoadProfile(params ? params.profileId : $me.id.toString());
  } else if ($me) {
    me.reload();
    profile = $me;
  }
  console.log("YOUR PROFILE: ", profile);
  displayName = profile.displayName ? profile.displayName : profile.firstName;
}

function editProfileField(onlyThesePages: string[]) {
  if (profile.__typename == "Organisation") {
    window.o.runProcess(
      upsertOrganisation,
      {
        ...profile,
        successAction: (data) => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.authenticated",
            profile: data,
          });
        },
      },
      {},
      onlyThesePages
    );
  } else {
    window.o.runProcess(upsertIdentity, profile, {}, onlyThesePages);
  }
}
</script>

<TopNav runtimeDapp="{runtimeDapp}" routable="{routable}" />

<PageHeader heightClass="  h-60 sm:h-80" color="bg-passport" largeHeader="{true}">
  <div class="m-auto mb-2 w-28 sm:mb-4" role="presentation" on:click="{() => editProfileField(['file', 'avatarUrl'])}">
    <UserImage profile="{profile}" size="{28}" profileLink="{false}" editable="{true}" />
  </div>

  <div class="text-center" role="presentation" on:click="{() => (profile.__typename === 'Organisation' ? editProfileField(['firstName']) : editProfileField(['firstName', 'lastName']))}">
    <h2 class="text-2xl cursor-pointer sm:text-4xl font-heading">
      {displayName}
    </h2>
  </div>
  {#if profile}
    {#if profile.locationName}
      <div class="mt-1 text-sm text-center cursor-pointer" role="presentation" on:click="{() => editProfileField(['location'])}">
        {profile.locationName ? profile.locationName : ""}
      </div>
    {:else}
      <div class="relative mt-1 text-sm text-center cursor-pointer" role="presentation" on:click="{() => editProfileField(['location'])}">Where do you live?</div>
    {/if}
  {/if}
</PageHeader>
