import { useGetMonthsDbQuery } from '../month/useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from '../ingredient/useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { Recipe } from '../../models/db-types';
import { getRecipe } from '../../models/RecipeUtils';

export function useGetRecipe(recipeId: string): Recipe {
  const { data: monthsDb } = useGetMonthsDbQuery();
  const { data: ingredientsDb } = useGetIngredientsDbQuery();
  const { data: recipesDb } = useGetRecipesDbQuery();

  return getRecipe(recipeId, recipesDb, ingredientsDb, monthsDb);
}
