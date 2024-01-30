import { flexRender } from '@tanstack/react-table';
import { Filter } from './Filter';
import { TickFilter } from './TickFilter';
import { Table } from '@tanstack/react-table';

export function TableFilters<T>({ table }: { table: Table<T> }) {
  // Build all the filters inputs
  const filters = [];
  for (const headerGroup of table.getHeaderGroups()) {
    for (const header of headerGroup.headers) {
      if (!header.isPlaceholder) {
        if (header.column.columnDef.meta?.headerKind === 'searchable') {
          filters.push(
            <div key={header.column.columnDef.id}>
              <div
                {...{
                  className: header.column.getCanSort()
                    ? 'cursor-pointer select-none'
                    : '',
                  onClick: header.column.getToggleSortingHandler(),
                }}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {{
                  asc: ' 🔼',
                  desc: ' 🔽',
                }[header.column.getIsSorted() as string] ?? null}
              </div>
              {header.column.getCanFilter() ? (
                <div>
                  <Filter column={header.column} table={table} />
                </div>
              ) : null}
            </div>
          );
        } else if (header.column.columnDef.meta?.headerKind === 'tickable') {
          filters.push(
            <div key={header.column.columnDef.id}>
              <TickFilter column={header.column} table={table} />
            </div>
          );
        } else if (header.column.columnDef.meta?.headerKind === 'boolean') {
          filters.push(
            <div key={header.column.columnDef.id}>
              {header.column.id}
              <input
                type="checkbox"
                onChange={(e) => {
                  header.column.setFilterValue(e.target.checked);
                }}
              />
            </div>
          );
        }
      }
    }
  }

  return filters;
}
