<script>
export let item = undefined;
import UserImage from "@o-platform/shell/src/shared/atoms/UserImage.svelte";

console.log("ITEM NOW:", item);
</script>

<div class="customItem">
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
</div>

<style>
.customItem {
  display: flex;
  align-items: center;
  cursor: default;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

img {
  width: 5px;
  padding: 5px 0;
  margin: 0 10px;
}

.customItem_title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.customItem_name {
  display: inline-block;
  font-weight: 700;
  margin-right: 10px;
}

.customItem_tagline {
  display: inline-block;
}
</style>
