import { Database } from 'firebase/database';
import { Months, Ingredients, Recipes } from '../db-types';
import { SearchBar } from './SearchBar';
import { RecipeTable } from './RecipeTable';

export function FilterableRecipeTable({
  db,
  months,
  ingredients,
  recipes,
}: {
  db: Database | undefined;
  months: Months | undefined;
  ingredients: Ingredients | undefined;
  recipes: Recipes | undefined;
}) {
  return (
    <div>
      <SearchBar />
      <RecipeTable
        db={db}
        months={months}
        ingredients={ingredients}
        recipes={recipes}
      />
    </div>
  );
}
