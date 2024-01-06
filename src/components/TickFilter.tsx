import { useState, useMemo } from 'react';
import { ObjectWithId, ObjectWithName } from '../db-types';
import { useMultipleSelection, useCombobox } from 'downshift';
import { Column, Table } from '@tanstack/react-table';

function itemToString(item: (ObjectWithName & ObjectWithId) | null) {
  return item ? item.name : '';
}
function itemToId(item: (ObjectWithName & ObjectWithId) | null) {
  return item ? item.id : '';
}

function useFilterState(
  initialState: (ObjectWithName & ObjectWithId)[],
  column: Column<any, unknown>
): [
  (ObjectWithName & ObjectWithId)[],
  (selectedItems: (ObjectWithName & ObjectWithId)[]) => void,
] {
  const [selectedItems, setSelectedItems] =
    useState<(ObjectWithName & ObjectWithId)[]>(initialState);
  function setStateAndFilter(selectedItems: (ObjectWithName & ObjectWithId)[]) {
    setSelectedItems(selectedItems);
    column.setFilterValue(selectedItems.map(itemToId));
  }
  return [selectedItems, setStateAndFilter];
}

function getFilteredItems(
  selectedItems: (ObjectWithName & ObjectWithId)[],
  itemsArray: (ObjectWithName & ObjectWithId)[],
  inputValue: string
): (ObjectWithName & ObjectWithId)[] {
  const lowerCasedInputValue = inputValue.toLowerCase();

  return itemsArray.filter(function filterItems(item) {
    return (
      !selectedItems.map(itemToId).includes(item.id) &&
      item.name.toLowerCase().includes(lowerCasedInputValue)
    );
  });
}

export function TickFilter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const itemsArray: (ObjectWithName & ObjectWithId)[] = [];
  if (column.columnDef.meta) {
    for (const item of column.columnDef.meta.tickOptions) {
      itemsArray.push({ name: item.name, id: item.id });
    }
  }

  const [inputValue, setInputValue] = useState('');
  const [selectedItems, setSelectedItems] = useFilterState([], column);

  // const dropdownListItems = useMemo(
  //   () => getFilteredItems(selectedItems, inputValue),
  //   [selectedItems, inputValue]
  // );

  // Note: Removed the Memo as causing some bugs
  // OCA COULD THE MEMO be the bug ????
  const dropdownListItems = getFilteredItems(
    selectedItems,
    itemsArray,
    inputValue
  );

  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection({
      selectedItems: selectedItems,
      onStateChange: function onStateChange({
        selectedItems: newSelectedItems,
        type,
      }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            setSelectedItems(newSelectedItems ?? []);
            break;
          default:
            break;
        }
      },
    });
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items: dropdownListItems,
    itemToString: itemToString,
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    inputValue: inputValue,
    stateReducer: function stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
            highlightedIndex: 0, // with the first option highlighted.
          };
        default:
          return changes;
      }
    },
    onStateChange: function onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (newSelectedItem) {
            setSelectedItems([...selectedItems, newSelectedItem]);
            setInputValue('');
          }
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue ?? '');
          break;
        default:
          break;
      }
    },
  });

  // const columnFilterValue = column.getFilterValue();

  return (
    <>
      <div className="">
        <div className="">
          <label className="" {...getLabelProps()}>
            {`${column.id}`}
          </label>
          <div className="">
            {selectedItems.map(
              function renderSelectedItem(selectedItemForRender, index) {
                return (
                  <span
                    className=""
                    key={`selected-item-${index}`}
                    {...getSelectedItemProps({
                      selectedItem: selectedItemForRender,
                      index,
                    })}
                  >
                    {selectedItemForRender.name}
                    <span
                      className=""
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelectedItem(selectedItemForRender);
                      }}
                    >
                      &#10005;
                    </span>
                  </span>
                );
              }
            )}
            <div className="">
              <input
                placeholder={`${column.id}`}
                className=""
                {...getInputProps(
                  getDropdownProps({ preventKeyAction: isOpen })
                )}
              />
              <button
                aria-label="toggle menu"
                className=""
                type="button"
                {...getToggleButtonProps()}
              >
                &#8595;
              </button>
            </div>
          </div>
        </div>
        <ul
          // className={`absolute w-inherit bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
          //   !(isOpen && dropdownListItems.length) && 'hidden'
          // }`}
          className={`list-group d-inline-block ${
            !(isOpen && dropdownListItems.length) && 'hidden'
          }`}
          {...getMenuProps()}
        >
          {isOpen &&
            dropdownListItems.map((item, index) => (
              // <li
              //   className={`${highlightedIndex === index && 'bg-blue-300'} ${
              //     selectedItem === item && 'font-bold'
              //   }
              //   py-2 px-3 shadow-sm flex flex-col`}
              //   key={`${item.id}${index}`}
              //   {...getItemProps({ item: item, index: index })}
              // >
              <li
                className={`${highlightedIndex === index && 'active'} 
                list-group-item`}
                key={`${item.id}${index}`}
                {...getItemProps({ item: item, index: index })}
              >
                <span>{item.name}</span>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
