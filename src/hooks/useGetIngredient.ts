import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';
import { Ingredient } from '../db-types';
import { getIngredient } from '../models/RecipeUtils';

export function useGetIngredient(ingredientId: string): Ingredient {
  const { data: ingredientsDb } = useGetIngredientsDbQuery();

  return getIngredient(ingredientId, ingredientsDb);
}
