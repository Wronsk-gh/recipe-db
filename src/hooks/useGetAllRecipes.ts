import { useGetMonthsDbQuery } from './useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { MonthsDb, IngredientsDb, RecipesDb, IdsList } from '../db-types';
import { Recipe } from '../db-types';

export function useGetAllRecipes(): Recipe[] {
  const { data: monthsDb } = useGetMonthsDbQuery();
  const { data: ingredientsDb } = useGetIngredientsDbQuery();
  const { data: recipesDb } = useGetRecipesDbQuery();

  return Object.keys(recipesDb).map((recipeId) => {
    return getRecipe(recipeId, recipesDb, ingredientsDb, monthsDb);
  });
}

function getRecipe(
  recipeId: string,
  recipesDb: RecipesDb,
  ingredientsDb: IngredientsDb,
  monthsDb: MonthsDb
) {
  const recipe: Recipe = {
    id: recipeId,
    name: recipesDb[recipeId].name,
    google_id: recipesDb[recipeId].google_id,
    ingredients: getRecipeIngredients(recipeId, recipesDb),
    months: getRecipeMonths(recipeId, recipesDb, ingredientsDb, monthsDb),
  };
  return recipe;
}

function getRecipeIngredients(recipeId: string, recipesDb: RecipesDb): IdsList {
  return Object.keys(recipesDb[recipeId].ingredients || {});
}

function getIngredientMonths(
  ingredientId: string,
  ingredientsDb: IngredientsDb
): IdsList {
  return Object.keys(ingredientsDb[ingredientId].months || {});
}

function getRecipeMonths(
  recipeId: string,
  recipesDb: RecipesDb,
  ingredientsDb: IngredientsDb,
  monthsDb: MonthsDb
): IdsList {
  const allMonthsId = Object.keys(monthsDb);
  // Consider all months are present to begin with
  const recipeMonths = [...allMonthsId];
  for (const ingredientId of getRecipeIngredients(recipeId, recipesDb)) {
    const ingredientMonths = getIngredientMonths(ingredientId, ingredientsDb);
    for (const monthId of allMonthsId) {
      if (!ingredientMonths.includes(monthId)) {
        // Month is not present for this ingredient, remove it for the recipe if it was present
        const index = recipeMonths.indexOf(monthId);
        if (index !== -1) {
          recipeMonths.splice(index, 1);
        }
      }
    }
  }
  return recipeMonths;
}
