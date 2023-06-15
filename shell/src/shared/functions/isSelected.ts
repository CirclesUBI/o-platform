export const isSelected = <
  T extends {
    id: string;
  }
>(
  itemToSelect: T | string,
  selectedItem: (T | undefined | null) | string
): boolean => {
  if (!selectedItem || selectedItem === null) {
    return false;
  }
  if (typeof selectedItem === "object" && typeof itemToSelect === "object" && selectedItem !== null && itemToSelect !== null) {
    if (typeof selectedItem === "object" && typeof itemToSelect === "object" && selectedItem.id === itemToSelect.id) {
      return true;
    } else {
      return false;
    }
  } else if (itemToSelect === selectedItem) {
    return true;
  } else {
    return false;
  }
};
