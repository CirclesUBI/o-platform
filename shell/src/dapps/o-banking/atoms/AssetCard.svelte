<script lang="ts">
import { push } from "svelte-spa-router";
import Card from "src/shared/atoms/Card.svelte";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { AssetBalance } from "../../../shared/api/data/types";
import { Currency } from "../../../shared/currency";

export let symbol: string;
export let title: string;
export let balance: string;
export let variety: number;
export let description: string;

console.log("SUM ", symbol);
let pictureUrl: string;
let varietyDetail;

$: {
  pictureUrl = symbol;
  varietyDetail =
    variety == 0 || variety == 1
      ? title
      : variety
      ? variety + " different " + title
      : "";
}
</script>

<div
  role="presentation"
  on:click="{() => push(`#/banking/assets/${symbol}`)}"
  class="cursor-pointer">
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
