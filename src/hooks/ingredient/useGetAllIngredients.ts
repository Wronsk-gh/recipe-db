import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';
import { Ingredient } from '../../models/db-types';
import { getIngredient } from '../../models/RecipeUtils';

export function useGetAllIngredients(): Ingredient[] {
  const { data: ingredientsDb } = useGetIngredientsDbQuery();

  return Object.keys(ingredientsDb).map((id) => {
    return getIngredient(id, ingredientsDb);
  });
}
