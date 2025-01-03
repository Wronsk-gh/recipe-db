import { ObjectWithId, ObjectWithName } from '../../models/db-types';
import { Column, Table } from '@tanstack/react-table';
import { ComboSelect } from '../ui/ComboSelect';

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

  // const columnFilterValue = column.getFilterValue();

  return (
    <ComboSelect
      itemsArray={itemsArray}
      label={column.id}
      onNewSelectedItems={(newSelectedItems) => {
        column.setFilterValue(newSelectedItems.map((item) => item.id));
      }}
    />
  );
}
