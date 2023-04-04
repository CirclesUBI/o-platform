<script lang="ts">
  import Icons from "./../../Icons.svelte";
  import {unreadEventCount} from "../../../stores/unreadEventCount";
</script>

<div class="relative text-secondary">
  <Icons icon="notificationbubble" />
  <div class="absolute top-0 w-full text-center text-white font-heading">
    {$unreadEventCount}
  </div>
</div>
