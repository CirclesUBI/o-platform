<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import { AllBusinessesDocument, Businesses } from "../../../shared/api/data/types";
import { onMount } from "svelte";
import { ApiClient } from "../../../shared/apiConnection";
import BusinessCard from "../atoms/BusinessCard.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let businesses: Businesses[] = [];

onMount(async () => {
  getBusinesses();
});

async function getBusinesses() {
  let queryResult = await ApiClient.query<[Businesses], null>(AllBusinessesDocument, null);

  businesses = queryResult;
  console.log(businesses);
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<section class="p-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2 flex flex-wrap justify-evenly content-center"> 
  {#each businesses as business}
    <BusinessCard
      name="{business.name}"
      id="{business.id}"
      description="{business.description}"
      image="{business.picture}" />
  {/each}
</section>
