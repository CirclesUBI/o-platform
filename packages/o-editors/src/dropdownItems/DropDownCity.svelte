<script type="ts">
import { buildAddressString } from "../../../../shell/src/shared/functions/locationHandler";

export let item = undefined;

export let isFirst = false;
export let isHover = false;
export let getHighlight = undefined;

const getLabel = (value) => {
  let label = value;
  console.log(getHighlight);
  if (getHighlight) {
    const highlight = getHighlight(item);
    const beforeHighlight = label.substr(0, highlight.start);
    const highlightContent = label.substr(highlight.start, highlight.end);
    const afterHighlight = label.substr(highlight.end, label.length);
    label = `${beforeHighlight}<b>${highlightContent}</b>${afterHighlight}`;
  }
  return buildAddressString(item.address);
};

let label = "";
let itemClasses = "";

$: {
  const classes = [];

  classes.push("border-light");
  if (isFirst) {
    classes.push("first");
  }
  if (isHover) {
    classes.push("hover");
  }
  itemClasses = classes.join(" ");

  label = getLabel(item.title);
}
</script>

<section class="flex mb-4 mr-1 items-center justify-center  border rounded-lg shadow-sm customItem  {itemClasses}">
  <div class="flex items-center w-full p-0 space-x-2 sm:space-x-6 item-body ">
    <div class="relative flex-grow p-3 text-left ">
      <div class="max-w-full -mt-1 leading-8 cursor-pointer ">
        {@html label}
      </div>
    </div>
  </div>
</section>

<style>
.customItem {
  display: flex;
  align-items: center;
  cursor: default;
  padding: 0;
  overflow: hidden;
  @apply bg-white;
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
