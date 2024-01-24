import { useGetMonthsDbQuery } from './useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { MonthsDb, IngredientsDb, RecipesDb, Ingredient } from '../db-types';

export function useGetAllIngredients(): Ingredient[] {
  const { data: ingredientsDb } = useGetIngredientsDbQuery();

  return Object.keys(ingredientsDb).map((id) => {
    return {
      id: id,
      name: ingredientsDb[id]?.name,
      months: getIngredientMonths(id, ingredientsDb),
    } as Ingredient;
  });
}

function getIngredientMonths(
  ingredientId: string,
  ingredientsDb: IngredientsDb
): string[] {
  return Object.keys(ingredientsDb[ingredientId]?.months || []);
}
