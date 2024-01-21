import { useGetMonthsDbQuery } from './useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import {
  MonthsDb,
  IngredientsDb,
  RecipesDb,
  Month,
  Ingredient,
} from '../db-types';

export function useGetAllIngredientsId(): string[] {
  const { data: ingredientsDb } = useGetIngredientsDbQuery();

  return Object.keys(ingredientsDb);
}
