import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { getRecipeIngredients } from '../models/RecipeUtils';

export function useGetRecipeIngredientsIds(id: string) {
  const { data: recipesDbData } = useGetRecipesDbQuery();

  return getRecipeIngredients(id, recipesDbData);
}
