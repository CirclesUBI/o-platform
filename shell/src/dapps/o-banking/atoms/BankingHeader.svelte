<script lang="ts">
import TopNav from "src/shared/atoms/TopNav.svelte";
import PageHeader from "src/shared/atoms/PageHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import { Currency } from "../../../shared/currency";
import { BN } from "ethereumjs-util";
import { assetBalances } from "../../../shared/stores/assetsBalances";
import Icons from "../../../shared/molecules/Icons.svelte";
import { _ } from "svelte-i18n";

export let balanceEuro: string = "0";
export let balanceTime: string = "0";
export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

$: {
  const sum = $assetBalances.crcBalances.reduce((p, c) => p.add(new BN(c.token_balance)), new BN("0")).toString();
  balanceEuro = Currency.instance().displayAmount(sum, null, "EURS", null).toString();
  balanceTime = Currency.instance().displayAmount(sum, null, "TIME_CRC", null).toString();
}
</script>

<TopNav runtimeDapp="{runtimeDapp}" routable="{routable}" />

<PageHeader heightClass=" relative h-60 sm:h-80" color="bg-banking" largeHeader="{true}">
  <div class="absolute w-4/5 h-full overflow-hidden -top-6 blob bg-banking" style="border-radius:137% 1% 119% 38% / 99% 60% 86% 73%">
    <div class="pt-2 text-white"></div>
  </div>
  <div class="flex items-center w-full pt-2 text-white ">
    <span class="inline-block tracking-wide ">
      <div class="self-center block mt-2 text-center">
        <div class="relative pt-2 text-center text-white">
          <span class="inline-block tracking-wide ">
            <section class="m-4 -mb-4 -mr-4 text-center">
              <div class="flex">
                <h1 class="text-6xl font-enso">
                  {balanceTime}
                </h1>
                <Icons icon="timeCircle" size="{14}" customClass="inline ml-2 inline-icon" />
              </div>
              <span class="text-3xl text-right"> {$_("dapps.o-banking.atoms.bankingHeader.balance")} </span>
            </section>
          </span>
        </div>
      </div>
    </span>
  </div>
</PageHeader>
