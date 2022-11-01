<script lang="ts">
import { push } from "svelte-spa-router";
import Button from "../../../shared/atoms/button/Button.svelte";
import { me } from "../../../shared/stores/me";
import { _ } from "svelte-i18n";

</script>

<section class="relative p-4 mb-4 bg-white border cardborder ">
  {#if $me && $me.__typename === "Profile"}
    <div class="flex flex-row justify-around mt-4 mb-1 text-center">
      <Button
        context="{{
          label: $_('dapps.o-dashboard.molecules.dashboardInvitesWidget.invieteLinkButton'),
          color: 'primary',
          style: 'small',
          disableLoading: true,
          action: async () => {
            push('#/home/share');
          },
        }}" />
    </div>
  {/if}
</section>

<style>
progress {
  border: 0;
  /* background: #081b4a; */
  background: linear-gradient(to right, #1dd6a4, #081b4a 4%);
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 0;
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 0;
}

progress::-moz-progress-bar {
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 0;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;

  background: linear-gradient(to right, #1dd6a4, #41c7f1);
}

progress::-webkit-progress-bar {
  /* background: #081b4a; */
  background: linear-gradient(to right, #1dd6a4, #081b4a 4%);
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 0;
}

progress::-webkit-progress-value {
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
  background: linear-gradient(to right, #1dd6a4, #41c7f1);
}
</style>
