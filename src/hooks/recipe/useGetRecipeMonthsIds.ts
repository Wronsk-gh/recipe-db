import { useGetMonthsDbQuery } from '../month/useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from '../ingredient/useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { getRecipeMonths } from '../../models/RecipeUtils';

export function useGetRecipeMonthsIds(id: string) {
  const { data: monthsDbData } = useGetMonthsDbQuery();
  const { data: ingredientsDbData } = useGetIngredientsDbQuery();
  const { data: recipesDbData } = useGetRecipesDbQuery();

  return getRecipeMonths(id, recipesDbData, ingredientsDbData, monthsDbData);
}
