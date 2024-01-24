import { MonthsDb, IngredientsDb, RecipesDb, IdsList } from '../db-types';
import { Recipe, Ingredient, Month } from '../db-types';

export function getRecipe(
  recipeId: string,
  recipesDb: RecipesDb,
  ingredientsDb: IngredientsDb,
  monthsDb: MonthsDb
) {
  const recipe: Recipe = {
    id: recipeId,
    name: recipesDb[recipeId]?.name,
    google_id: recipesDb[recipeId]?.google_id,
    ingredients: getRecipeIngredients(recipeId, recipesDb),
    months: getRecipeMonths(recipeId, recipesDb, ingredientsDb, monthsDb),
  };
  return recipe;
}

export function getIngredient(ingredientId: string, ingredientsDb: MonthsDb) {
  return {
    id: ingredientId,
    name: ingredientsDb[ingredientId]?.name,
    months: getIngredientMonths(ingredientId, ingredientsDb),
  } as Ingredient;
}

export function getMonth(monthId: string, monthsDb: MonthsDb) {
  return {
    id: monthId,
    name: monthsDb[monthId]?.name,
  } as Month;
}

export function getRecipeIngredients(
  recipeId: string,
  recipesDb: RecipesDb
): IdsList {
  return Object.keys(recipesDb[recipeId]?.ingredients || {});
}

export function getIngredientMonths(
  ingredientId: string,
  ingredientsDb: IngredientsDb
): IdsList {
  return Object.keys(ingredientsDb[ingredientId]?.months || {});
}

export function getRecipeMonths(
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
