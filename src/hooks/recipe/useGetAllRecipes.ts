import { useGetMonthsDbQuery } from '../month/useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from '../ingredient/useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { getRecipe } from '../../models/RecipeUtils';
import { Recipe } from '../../models/db-types';

export function useGetAllRecipes(): Recipe[] {
  const { data: monthsDb } = useGetMonthsDbQuery();
  const { data: ingredientsDb } = useGetIngredientsDbQuery();
  const { data: recipesDb } = useGetRecipesDbQuery();

  return Object.keys(recipesDb).map((id) => {
    return getRecipe(id, recipesDb, ingredientsDb, monthsDb);
  });
}
