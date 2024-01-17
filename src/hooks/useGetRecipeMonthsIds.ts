import { useGetMonthsDbQuery } from './useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { MonthsDb, IngredientsDb, RecipesDb } from '../db-types';

export function useGetRecipeMonthsIds(id: string) {
  // const { data: monthsDbData } = useGetMonthsDbQuery();
  const { data: ingredientsDbData } = useGetIngredientsDbQuery();
  const { data: recipesDbData } = useGetRecipesDbQuery();

  return getRecipeMonths(id, recipesDbData || {}, ingredientsDbData || {});
}

function getIngredientMonths(
  ingredientId: string,
  ingredientsDb: IngredientsDb
): string[] {
  return Object.keys(ingredientsDb[ingredientId].months || []);
}

function getRecipeIngredients(recipeId: string, recipesDb: RecipesDb) {
  return Object.keys(recipesDb[recipeId].ingredients || []);
}

function getRecipeMonths(
  recipeId: string,
  recipesDb: RecipesDb,
  ingredientsDb: IngredientsDb
) {
  const recipeMonths: string[] = [];
  for (const ingredientId in getRecipeIngredients(recipeId, recipesDb)) {
    const ingredientMonths = getIngredientMonths(ingredientId, ingredientsDb);
    for (const monthId in ingredientMonths) {
      if (recipeMonths.includes(monthId)) {
        recipeMonths.push(monthId);
      }
    }
  }
  return recipeMonths;
}
