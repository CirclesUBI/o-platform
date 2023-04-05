<script lang="ts">
  import Icons from "./../../Icons.svelte";
  import {unreadEventInbox} from "../../../stores/inbox";
</script>

<div class="relative text-secondary">
  <Icons icon="notificationbubble" />
  <div class="absolute top-0 w-full text-center text-white font-heading">
    {$unreadEventInbox.events.length}
  </div>
</div>
