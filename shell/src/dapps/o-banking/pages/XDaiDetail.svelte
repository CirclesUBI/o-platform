<script lang="ts">
  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  import {onMount} from "svelte";
  import {KeyManager} from "../../o-passport/data/keyManager";
  import {me} from "../../../shared/stores/me";
  import {Utilities} from "../chain/utilities";
  import {BigNumber} from "ethers";
  import {DefaultExecutionContext} from "../chain/actions/defaultExecutionContext";

  let accountxDai = {
  symbol: "xdai",
  icon: "",
  balance: "0",
  address: "0",
  variety: 1,
  title: "",
};
let safexDai = {
  symbol: "xdai",
  icon: "",
  balance: "0",
  address: "0",
  variety: 1,
  title: "",
};

let balances = [];

onMount(async () => {
  const safeAddress = $me.circlesAddress;
  const safeBalance = await Utilities.getBalance(DefaultExecutionContext.readonly, safeAddress);
  const km = new KeyManager(safeAddress);
  await km.load();
  const eoaBalance = await Utilities.getBalance(DefaultExecutionContext.readonly, km.torusKeyAddress);

  safexDai.balance = Number.parseFloat(Utilities.fromWei(safeBalance)).toFixed(2);
  safexDai.title = "Safe";
  safexDai.address = safeAddress;

  accountxDai.balance = Number.parseFloat(Utilities.fromWei(eoaBalance)).toFixed(2);
  accountxDai.title = "Safe Owner";
  accountxDai.address = km.torusKeyAddress;

  if (safeBalance.gt(BigNumber.from(0))) {
    balances = [accountxDai, safexDai];
  } else {
    balances = [accountxDai];
  }
});
</script>

<div class="p-5">
  <div class="w-full mb-4 text-center">
    <h1 class="uppercase font-heading">Xdai</h1>
  </div>

  {#each balances.sort( (a, b) => (parseFloat(a.balance) > parseFloat(b.balance) ? -1 : parseFloat(a.balance) < parseFloat(b.balance) ? 1 : 0) ) as token}
    <ItemCard
      params="{{
        edgeless: false,
        imageUrl: `/logos/xdai.png`,
        title: token.title,
        subTitle: token.address,
        truncateMain: true,
        endTextBig: Number.parseFloat(token.balance).toFixed(2),
        endTextSmall: '',
        noLink: true,
        mobileTextCutoff: 18,
      }}" />
  {/each}
</div>
