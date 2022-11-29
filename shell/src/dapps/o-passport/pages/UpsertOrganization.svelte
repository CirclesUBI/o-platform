<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import Label from "../../../shared/atoms/Label.svelte";
import OpeningHours from "../molecules/OpeningHoursEditor.svelte";
import StandardHeaderBox from "../../../shared/atoms/StandardHeaderBox.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let circlesAddress: string;
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="pb-20 mx-auto md:w-2/3 xl:w-1/2">
  <section class="justify-center mb-6 align-middle">
    <div class="flex flex-col justify-around p-4 pt-0 mx-auto -mt-6">
      {#if !circlesAddress}
        <h1 class="text-center">New organization</h1>
      {:else}
        <h1 class="text-center">Edit {circlesAddress}</h1>
      {/if}
    </div>
  </section>
  <section class="justify-left">
    <div class="p-1 pr-4 -mt-6 overflow-hidden whitespace-pre-line xs:p-3 xs:-mt-2">
      <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.upsertOrganization.information">
        <div slot="standardHeaderBoxContent">
          <div class="flex flex-col space-y-2">
            <div class="text-left">
              <Label key="dapps.o-homepage.components.survey.userDataCollection.subtitle" />
            </div>

            <div class="flex flex-col">
              <div>
                <div class="flex flex-col mb-5 text-sm">
                  <Label key="dapps.o-passport.pages.upsertOrganization.name" />
                  <div class="flex mt-2">
                    <input class="w-full input input-bordered md:w-auto" type="text" />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <div>
                <div class="flex flex-col mb-5 text-sm">
                  <Label key="dapps.o-passport.pages.upsertOrganization.description" />
                  <div class="flex mt-2">
                    <input class="w-full input input-bordered md:w-auto" type="text" />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <div>
                <div class="flex flex-col mb-5 text-sm">
                  <Label key="dapps.o-passport.pages.upsertOrganization.category" />
                  <div class="flex mt-2">
                    <input class="w-full input input-bordered md:w-auto" type="text" />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <div>
                <div class="flex flex-col mb-5 text-sm">
                  <Label key="dapps.o-passport.pages.upsertOrganization.location" />
                  <div class="flex mt-2">
                    <input class="w-full input input-bordered md:w-auto" type="text" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StandardHeaderBox>

      <StandardHeaderBox headerTextStringKey="dapps.o-passport.pages.upsertOrganization.openingHours">
        <div slot="standardHeaderBoxContent">
          <OpeningHours />
        </div>
      </StandardHeaderBox>
    </div>
  </section>
</div>
