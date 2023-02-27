<script type="ts">
export let item = undefined;
// export let isActive = false;
export let isFirst = false;
export let isHover = false;
export let getHighlight = undefined;

function buildAddressString(address) {
  let addr: string[] = [address.street, address.houseNumber, address.city, address.district, address.countryCode];
  addr = addr.filter(function (element) {
    return element !== undefined;
  });

  return addr.join(", ");
}
const getLabel = (value) => {
  let label = value;
  console.log(getHighlight);
  if (getHighlight) {
    const highlight = getHighlight(item);
    const beforeHighlight = label.substring(0, highlight.start);
    const highlightContent = label.substring(highlight.start, highlight.end);
    const afterHighlight = label.substring(highlight.end, label.length);
    label = `${beforeHighlight}<b>${highlightContent}</b>${afterHighlight}`;
  }
  return buildAddressString(item.address);
  console.log("ITEM", item);
  return label;
};

let label = "";
let itemClasses = "";

$: {
  const classes = [];

  // if (isActive) {
  //   classes.push("active border-primary");
  // } else {
  //   classes.push("border-light");
  // }
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
    <div class="relative flex-grow p-3 text-left truncate">
      <div class="max-w-full -mt-1 leading-8 cursor-pointer truncateThis">
        {@html label}
      </div>
      <!-- <div class="text-xs text-left text-dark-lightest">
        {item.country}
      </div> -->
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

/* .customItem.active {
  @apply border;
  @apply border-primary;
}

.customItem.hover:not(.active) {
  @apply border;
  @apply border-primary;
} */

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
