import { useGetMonthsDbQuery } from './useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { getRecipe } from '../models/RecipeUtils';
import { Recipe } from '../db-types';

export function useGetAllRecipes(): Recipe[] {
  const { data: monthsDb } = useGetMonthsDbQuery();
  const { data: ingredientsDb } = useGetIngredientsDbQuery();
  const { data: recipesDb } = useGetRecipesDbQuery();

  return Object.keys(recipesDb).map((id) => {
    return getRecipe(id, recipesDb, ingredientsDb, monthsDb);
  });
}
