<script lang="ts">
import { push } from "svelte-spa-router";
import Button from "../../../shared/atoms/button/Button.svelte";
import { me } from "../../../shared/stores/me";
import { _ } from "svelte-i18n";
</script>

<section class="relative pb-2 mb-4 bg-white border cardborder ">
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
</section>
