import { useMemo } from 'react';
import { useGetAllMonths } from '../month/useGetAllMonths';
import { ColumnDef } from '@tanstack/react-table';
import { Ingredient } from '../../db-types';
import { useGetAllTags } from '../tag/useGetAllTags';

export function useIngredientsColumns() {
  const months = useGetAllMonths();
  const tags = useGetAllTags();

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
      {
        accessorFn: (recipe) => {
          return recipe.tags;
        },
        id: 'recipeTags',
        cell: (info) => info.getValue(),
        header: () => 'TagsDb',
        filterFn: 'arrIncludesAllId',
        meta: {
          headerKind: 'tickable',
          tickOptions: tags,
        },
      },
    ],
    []
  );

  return columns;
}
