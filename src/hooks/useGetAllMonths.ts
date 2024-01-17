import { useGetMonthsDbQuery } from './useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { MonthsDb, IngredientsDb, RecipesDb, Month } from '../db-types';

export function useGetAllMonths(): Month[] {
  const { data: monthsDb } = useGetMonthsDbQuery();
  // const { data: ingredientsDbData } = useGetIngredientsDbQuery();
  // const { data: recipesDbData } = useGetRecipesDbQuery();

  // const allMonths = new IdItemCollection<Month>();
  // for (const monthId in monthsDbData) {
  //   const month = new Month(monthId, months);
  //   allMonths.addItem(month);
  // }
  // const allIngredients = new IdItemCollection<Ingredient>();
  // for (const ingredientId in ingredientsDbData) {
  //   const ingredient = new Ingredient(ingredientId, ingredients, allMonths);
  //   allIngredients.addItem(ingredient);
  // }

  // for (const recipeId in recipesDbData) {
  // }

  return Object.keys(monthsDb || {}).map((monthId) => {
    const month: Month = {
      id: monthId,
      name: (monthsDb || {})[monthId].name,
    };
    return month;
  });
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
