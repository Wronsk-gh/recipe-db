import { useGetMonthsDbQuery } from './useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import {
  MonthsDb,
  IngredientsDb,
  RecipesDb,
  Month,
  Ingredient,
} from '../db-types';

export function useGetAllIngredients(): Month[] {
  const { data: ingredientsDb } = useGetIngredientsDbQuery();
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

  return Object.keys(ingredientsDb || {}).map((ingredientId) => {
    const ingredient: Ingredient = {
      id: ingredientId,
      name: (ingredientsDb || {})[ingredientId].name,
      months: getIngredientMonths(ingredientId, ingredientsDb || {}),
    };
    return ingredient;
  });
}

function getIngredientMonths(
  ingredientId: string,
  ingredientsDb: IngredientsDb
): string[] {
  return Object.keys(ingredientsDb[ingredientId].months || []);
}
