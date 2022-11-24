<script lang="ts">
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import Label from "../../../shared/atoms/Label.svelte";
  import OpeningHours from "../molecules/OpeningHoursEditor.svelte";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
  export let circlesAddress: string;
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}"/>
<section class="justify-center align-middle">
    <div class="flex justify-around p-4 pt-0 mx-auto -mt-6 md:w-2/3 xl:w-1/2">
        {#if !circlesAddress}
            <h1>New organization</h1>
        {:else}
            <h1>Edit {circlesAddress}</h1>
        {/if}
    </div>
</section>
<section class="justify-left">
    <div class="p-1 xs:p-3 pr-4 -mt-6 xs:-mt-2 whitespace-pre-line overflow-hidden">
        <div class="flex flex-col">
            <div class="mt-5 mb-10"><Label key="dapps.o-homepage.components.survey.userDataCollection.subtitle"/></div>
            <div>
                <div class="flex flex-col text-sm mb-5">
                    <Label key="dapps.o-passport.pages.upsertOrganization.name"/>
                    <div class="flex">
                        <input type="text"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col">
            <div>
                <div class="flex flex-col text-sm mb-5">
                    <Label key="dapps.o-passport.pages.upsertOrganization.description"/>
                    <div class="flex">
                        <input type="text"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col">
            <div>
                <div class="flex flex-col text-sm mb-5">
                    <Label key="dapps.o-passport.pages.upsertOrganization.category"/>
                    <div class="flex">
                        <input type="text"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col">
            <div>
                <div class="flex flex-col text-sm mb-5">
                    <Label key="dapps.o-passport.pages.upsertOrganization.location"/>
                    <div class="flex">
                        <input type="text"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col">
            <div>
                <div class="flex flex-col text-sm mb-5">
                    <Label key="dapps.o-passport.pages.upsertOrganization.openingHours"/>
                    <div class="flex">
                        <OpeningHours/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>