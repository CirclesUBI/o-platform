<script type="ts">
import { getContext } from "svelte";
import { key } from "./context";
const { getMap } = getContext(key);
const map = getMap();
export let lat;
export let lng;
export let icon;
// eslint-disable-next-line no-new
new window.google.maps.Marker({
  position: { lat, lng },
  icon,
  map,
});
</script>
