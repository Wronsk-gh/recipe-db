import { useState, Dispatch, SetStateAction } from 'react';
import { Column, Table } from '@tanstack/react-table';
import { ObjectWithId, ObjectWithName } from '../db-types';
import { useSelect } from 'downshift';

function useFilterState<S>(
  initialState: S | (() => S),
  column: Column<any, unknown>
): [S, Dispatch<SetStateAction<S>>] {
  const [selectedItems, setSelectedItems] = useState<S>(initialState);
  const setStateAndFilter: Dispatch<SetStateAction<S>> = (value) => {
    setSelectedItems(value);
    column.setFilterValue(value);
  };
  return [selectedItems, setStateAndFilter];
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
    for (const items of column.columnDef.meta.tickOptions) {
      itemsArray.push({ name: items.name, id: items.id });
    }
  }

  // const [selectedItems, setSelectedItems] = useState<
  //   (ObjectWithName & ObjectWithId)[]
  // >([]);
  const [selectedItems, setSelectedItems] = useFilterState<string[]>(
    [],
    column
  );
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect<ObjectWithName & ObjectWithId>({
    items: itemsArray,
    itemToString: itemToString,
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
        case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // Keep menu open after selection.
            highlightedIndex: state.highlightedIndex,
          };
        default:
          return changes;
      }
    },
    selectedItem: null,
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) {
        return;
      }

      const index = selectedItems.indexOf(itemToId(selectedItem));

      if (index > 0) {
        setSelectedItems([
          ...selectedItems.slice(0, index),
          ...selectedItems.slice(index + 1),
        ]);
      } else if (index === 0) {
        setSelectedItems([...selectedItems.slice(1)]);
      } else {
        setSelectedItems([...selectedItems, itemToId(selectedItem)]);
      }
    },
  });
  const buttonText = selectedItems.length
    ? `${selectedItems.length} ${column.id} selected.`
    : `${column.id} filter.`;

  function itemToString(item: (ObjectWithName & ObjectWithId) | null) {
    return item ? item.name : '';
  }
  function itemToId(item: (ObjectWithName & ObjectWithId) | null) {
    return item ? item.id : '';
  }

  // const columnFilterValue = column.getFilterValue();

  return (
    <>
      <div className="">
        <label {...getLabelProps()}>{`Which ${column.id} to filter ?`}</label>
        <div className="" {...getToggleButtonProps()}>
          <span>{buttonText}</span>
          <span className="px-2">{isOpen ? <>&#8593;</> : <>&#8595;</>}</span>
        </div>
      </div>
      <ul className={`${!isOpen && 'hidden'}`} {...getMenuProps()}>
        {isOpen &&
          itemsArray.map((item, index) => (
            <li
              className={`${highlightedIndex === index && 'bg-blue-300'}
            ${selectedItem === item && 'font-bold'}
            `}
              key={item.id}
              {...getItemProps({
                item,
                index,
                'aria-selected': selectedItems.includes(itemToId(item)),
              })}
            >
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={selectedItems.includes(itemToId(item))}
                value={item.name}
                onChange={() => null}
              />
              <div className="">
                <span>{item.name}</span>
                {/* <span className="text-sm text-gray-700">{item.name}</span> */}
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}
