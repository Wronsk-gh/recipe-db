import { useMemo } from 'react';
import { useGetAllMonths } from '../month/useGetAllMonths';
import { useGetAllIngredients } from '../ingredient/useGetAllIngredients';
import { ColumnDef } from '@tanstack/react-table';
import { Recipe } from '../../models/db-types';
import { useGetAllTags } from '../tag/useGetAllTags';

export function useRecipesColumns() {
  const months = useGetAllMonths();
  const tags = useGetAllTags();
  const ingredients = useGetAllIngredients();

  const columns = useMemo<ColumnDef<Recipe>[]>(
    () => [
      {
        accessorFn: (recipe) => recipe.name,
        id: 'recipeName',
        cell: (info) => info.getValue(),
        header: () => 'Name',
        filterFn: 'fuzzy',
        meta: {
          headerKind: 'searchable',
          tickOptions: [],
        },
      },
      {
        accessorFn: (recipe) => {
          return recipe.ingredients;
        },
        id: 'recipeIngredients',
        cell: (info) => info.getValue(),
        header: () => 'IngredientsDb',
        filterFn: 'arrIncludesAllId',
        meta: {
          headerKind: 'tickable',
          tickOptions: ingredients.sort((x, y) => {
            if (x.name.toLowerCase() > y.name.toLowerCase()) {
              return 1;
            }
            if (x.name.toLowerCase() < y.name.toLowerCase()) {
              return -1;
            }
            return 0;
          }),
        },
      },
      {
        accessorFn: (recipe) => {
          return recipe.months;
        },
        id: 'recipeMonths',
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
      {
        accessorFn: (recipe) => {
          return recipe.isFavourite;
        },
        id: 'recipeIsFavourite',
        cell: (info) => info.getValue(),
        header: () => 'IsFavourite',
        filterFn: 'selectBool',
        meta: {
          headerKind: 'boolean',
          tickOptions: [],
        },
      },
    ],
    []
  );

  return columns;
}
