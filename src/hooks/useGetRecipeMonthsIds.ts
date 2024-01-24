import { useGetMonthsDbQuery } from './useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { getRecipeMonths } from '../models/RecipeUtils';

export function useGetRecipeMonthsIds(id: string) {
  const { data: monthsDbData } = useGetMonthsDbQuery();
  const { data: ingredientsDbData } = useGetIngredientsDbQuery();
  const { data: recipesDbData } = useGetRecipesDbQuery();

  return getRecipeMonths(id, recipesDbData, ingredientsDbData, monthsDbData);
}
