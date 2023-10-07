import { Database } from 'firebase/database';
import { Months, Ingredients, Recipes } from '../db-types';
import { SearchBar } from './SearchBar';
import { RecipeTable } from './RecipeTable';

export function FilterableRecipeTable({
  months,
  ingredients,
  recipes,
}: {
  months: Months | undefined;
  ingredients: Ingredients | undefined;
  recipes: Recipes | undefined;
}) {
  return (
    <div>
      <SearchBar />
      <RecipeTable
        months={months}
        ingredients={ingredients}
        recipes={recipes}
      />
    </div>
  );
}
