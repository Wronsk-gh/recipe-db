import { useMemo } from 'react';
import { useGetAllMonths } from '../hooks/useGetAllMonths';
import { ColumnDef } from '@tanstack/react-table';
import { Ingredient } from '../db-types';

export function useIngredientsColumns() {
  const months = useGetAllMonths();

  const columns = useMemo<ColumnDef<Ingredient>[]>(
    () => [
      {
        accessorFn: (ingredient) => ingredient.name,
        id: 'ingredientName',
        cell: (info) => info.getValue(),
        header: () => 'Name',
        filterFn: 'fuzzy',
        meta: {
          headerKind: 'searchable',
          tickOptions: [],
        },
      },
      {
        accessorFn: (ingredient) => {
          return ingredient.months;
        },
        id: 'ingredientMonths',
        cell: (info) => info.getValue(),
        header: () => 'MonthsDb',
        filterFn: 'arrIncludesAllId',
        meta: {
          headerKind: 'tickable',
          tickOptions: months,
        },
      },
    ],
    []
  );

  return columns;
}
