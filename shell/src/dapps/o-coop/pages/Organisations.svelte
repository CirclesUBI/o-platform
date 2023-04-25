<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Organisation, OrganisationsDocument } from "../../../shared/api/data/types";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import OrganisationCard from "../atoms/OrganisationCard.svelte";
import List from "../../../shared/molecules/Lists/List.svelte";

export let runtimeDapp: RuntimeDapp<any>;

const listArguments = {};
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" />

<div class="px-4 mx-auto mt-5 mb-20 md:w-2/3 xl:w-1/2">
  <List
    listItemComponent="{OrganisationCard}"
    fetchQuery="{OrganisationsDocument}"
    fetchQueryArguments="{listArguments}"
    dataKey="organisations"
    selector="createdAt"
    sortOrder="{'DESC'}"
    dataLimit="{50}" />
</div>
