<script lang="ts">
import { push } from "svelte-spa-router";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { _ } from "../../../i18n/i18nDictionary";

export let symbol: string;
export let title: string;
export let balance: string;
export let variety: number;
export let description: string;

let pictureUrl: string;
let varietyDetail;

$: {
  pictureUrl = symbol;
  varietyDetail = variety == 0 || variety == 1 ? title : variety ? variety + $_("dapps.banking.atoms.assetCard.different") + title : "";
}
</script>

<div role="presentation" on:click="{() => push(`#/banking/assets/${symbol}`)}" class="cursor-pointer">
  <ItemCard
    params="{{
      edgeless: false,
      imageUrl: `/logos/${symbol}.png`,
      title: title,
      subTitle: varietyDetail || description,
      truncateMain: true,
      endTextBig: Number.parseFloat(balance).toFixed(2),
      endTextSmall: title,
      mobileTextCutoff: 18,
    }}" />
</div>
