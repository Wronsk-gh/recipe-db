import { useGetMonthsDbQuery } from './useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { MonthsDb, IngredientsDb, RecipesDb } from '../db-types';

export function useGetAllRecipesIds(): string[] {
  const { data: recipesDbData } = useGetRecipesDbQuery();

  return Object.keys(recipesDbData || {});
}
