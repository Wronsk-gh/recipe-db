import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Tag } from '../../models/db-types';

export function useTagsColumns() {
  const columns = useMemo<ColumnDef<Tag>[]>(
    () => [
      {
        accessorFn: (tag) => tag.name,
        id: 'tagName',
        cell: (info) => info.getValue(),
        header: () => 'Name',
        filterFn: 'fuzzy',
        meta: {
          headerKind: 'searchable',
          tickOptions: [],
        },
      },
    ],
    []
  );

  return columns;
}
