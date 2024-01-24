import { useGetMonthsDbQuery } from './useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { Recipe } from '../db-types';
import { getRecipe } from '../models/RecipeUtils';

export function useGetRecipe(recipeId: string): Recipe {
  const { data: monthsDb } = useGetMonthsDbQuery();
  const { data: ingredientsDb } = useGetIngredientsDbQuery();
  const { data: recipesDb } = useGetRecipesDbQuery();

  return getRecipe(recipeId, recipesDb, ingredientsDb, monthsDb);
}
