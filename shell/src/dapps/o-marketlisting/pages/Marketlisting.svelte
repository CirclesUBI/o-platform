<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import { AllBusinessesDocument, Businesses } from "../../../shared/api/data/types";
import { onMount } from "svelte";
import { ApiClient } from "../../../shared/apiConnection";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let businesses: [Businesses];

onMount(async () => {
  getBusinesses()
});

async function getBusinesses() {
  let queryResult = await ApiClient.query<[Businesses], null>(AllBusinessesDocument, null)

  businesses = queryResult;
  console.log(businesses)
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<section class="">

</section>
