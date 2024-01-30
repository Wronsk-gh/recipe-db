import { useState } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  FilterFn,
  ColumnFiltersState,
  getFilteredRowModel,
  RowData,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
    arrIncludesAllId: FilterFn<unknown>;
    selectBool: FilterFn<unknown>;
  }
  interface ColumnMeta<TData extends RowData, TValue> {
    headerKind: 'searchable' | 'tickable' | 'boolean';
    tickOptions: { id: string; name: string }[];
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const arrIncludesAllIdFilter: FilterFn<any[]> = (
  row,
  columnId,
  filterValue,
  addMeta
) => {
  const itemValue: any[] = row.getValue(columnId);

  // Return if the item should be filtered in/out
  // Check that all IDs in the filter array are present in the item array
  return filterValue.every((el: any) => {
    return itemValue.includes(el);
  });
};

const selectBoolFilter: FilterFn<any[]> = (
  row,
  columnId,
  filterValue,
  addMeta
) => {
  const itemValue: any[] = row.getValue(columnId);

  // Return if the item should be filtered in/out
  // If filter value is true, return only if true, otherwise return everything
  if (filterValue === true) {
    return Boolean(itemValue);
  } else {
    return true;
  }
};

export function useTable<T>(items: T[], columns: ColumnDef<T>[]) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: items,
    columns: columns,
    state: {
      sorting,
      columnFilters,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
      arrIncludesAllId: arrIncludesAllIdFilter,
      selectBool: selectBoolFilter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // debugTable: true,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return table;
}
