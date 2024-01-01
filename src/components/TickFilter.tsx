import { useState } from 'react';
import { Column, Table } from '@tanstack/react-table';
import { ObjectWithId, ObjectWithName } from '../db-types';
import { useSelect } from 'downshift';

export function TickFilter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const itemsArray = column.columnDef.meta
    ? column.columnDef.meta.tickOptions
    : [];
  const [selectedItems, setSelectedItems] = useState<
    (ObjectWithName & ObjectWithId)[]
  >([]);
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
          // console.log(changes);
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
      console.log("I'm HEREEEEEEEEEEEEEEEEEEEE (onSelectedItemChange)");
      console.log(`selectedItem : ${selectedItem}`);
      if (!selectedItem) {
        return;
      }

      const index = selectedItems.map(itemToId).indexOf(itemToId(selectedItem));

      if (index > 0) {
        setSelectedItems([
          ...selectedItems.slice(0, index),
          ...selectedItems.slice(index + 1),
        ]);
      } else if (index === 0) {
        setSelectedItems([...selectedItems.slice(1)]);
      } else {
        setSelectedItems([...selectedItems, selectedItem]);
      }
    },
  });
  console.log('STATE selectedItem :');
  console.log(selectedItem);
  const buttonText = selectedItems.length
    ? `${selectedItems.length} ${column.id} selected.`
    : `${column.id} filter.`;

  function itemToString(item: (ObjectWithName & ObjectWithId) | null) {
    return item ? item.name : '';
  }
  function itemToId(item: (ObjectWithName & ObjectWithId) | null) {
    return item ? item.id : '';
  }

  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <div className="">
        <label {...getLabelProps()}>{`Which ${column.id} to filter ?`}</label>
        <div className="" {...getToggleButtonProps()}>
          <span>{buttonText}</span>
          <span className="px-2">{isOpen ? <>&#8593;</> : <>&#8595;</>}</span>
        </div>
      </div>
      {/* <ul className={`${!isOpen && 'hidden'}`} {...getMenuProps()}> */}
      <ul className={`${!true && 'hidden'}`} {...getMenuProps()}>
        {true &&
          itemsArray.map((item, index) => (
            <li
              className={`${highlightedIndex === index && 'bg-blue-300'}
            ${selectedItem === item && 'font-bold'}
            `}
              key={item.id}
              {...getItemProps({
                item,
                index,
                'aria-selected': selectedItems
                  .map(itemToId)
                  .includes(itemToId(item)),
              })}
            >
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={selectedItems.map(itemToId).includes(itemToId(item))}
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
