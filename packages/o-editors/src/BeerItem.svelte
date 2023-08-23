<script>
import UserImage from "@o-platform/shell/src/shared/atoms/UserImage.svelte";
export let item = undefined;
export const itemType = "profile";
</script>

<section class="flex items-center justify-center mb-4 mr-1 border rounded-lg shadow-sm customItem">
  <div class="flex items-center w-full px-3 pt-1 space-x-2 sm:space-x-6 item-body">
    <div class="text-center">
      <div class="inline-flex">
        <div class="w-10 h-10 m-auto rounded-full">
          <UserImage profile="{item}" size="{10}" />
        </div>
      </div>
    </div>

    <div class="relative flex-grow text-left truncate">
      <div class="max-w-full -mt-1 leading-8 cursor-pointer" class:text-dark-lightest="{!item.id || item.id < 1}">
        {`${item.firstName ? item.firstName : item.value} ${item.lastName ? item.lastName : ""}`}
      </div>
    </div>
  </div>
</section>
