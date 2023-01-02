<script lang="ts">
  import {BusinessCategory} from "../../../shared/api/data/types";
  import {Environment} from "../../../shared/environment";
  import DropDown2, {DropDownBehavior} from "../../../shared/molecules/DropDown2.svelte";
  import {_} from "svelte-i18n";
  import {createEventDispatcher, onMount} from "svelte";

  export let width: number = 40;
  export let allowMultiselect: boolean = false;
  export let placeholder: string = $_("common.selectAValue");
  export let clearSelectionLabel: string = allowMultiselect ? $_("common.all") : $_("common.none");

  export let selectedKeys: string[];


  const eventDispatcher = createEventDispatcher();

  let _selectedItems: {[categoryId:string]: BusinessCategory} = {};
  let dropDownBehavior: DropDownBehavior<BusinessCategory>;

  onMount(async () => {
    const allCategories = (await Environment.api.allBusinessCategories()).allBusinessCategories;
    if (selectedKeys) {
      const allCategoriesLookup = allCategories.toLookup(o => o.id, o => o);
      selectedKeys.forEach(key => _selectedItems[key] = allCategoriesLookup[key]);
    }
    dropDownBehavior = {
      isRequired: false,
      clearSelectionLabel: clearSelectionLabel,
      getItems: () => allCategories,
      getItemLabel: (item) => item.name,
      getItemKey: (item) => item.id.toString(),
      isSelected: (item) => !!_selectedItems[item?.id?.toString()],
      select: (item) => {
        if (!item) {
          _selectedItems = {};
          dropDownBehavior = dropDownBehavior;
          eventDispatcher("change", []);
          return false;
        }

        if (allowMultiselect) {
          if (_selectedItems[item.id])
            delete _selectedItems[item.id];
          else
            _selectedItems[item.id] = item;
        } else {
          _selectedItems = {[item.id]: item};
        }

        const selectedItems = Object.values(_selectedItems);
        dropDownBehavior = dropDownBehavior;
        eventDispatcher("change", selectedItems);
        return _selectedItems[item.id];
      },
      getLabel:() => {
        const selectedKeys = Object.keys(_selectedItems);
        if (selectedKeys.length == 0) {
          return placeholder;
        }
        if (selectedKeys.length == 1){
          const selectedItem = _selectedItems[selectedKeys[0]];
          return dropDownBehavior.getItemLabel(selectedItem);
        }
        return `${selectedKeys.length} items`;
      }
    };
  });

</script>
{#if dropDownBehavior}
    <DropDown2 width={width} behavior={dropDownBehavior} />
{/if}