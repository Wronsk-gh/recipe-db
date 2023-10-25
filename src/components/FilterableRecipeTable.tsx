import { useState } from 'react';
import { Months, Ingredients, Recipes } from '../db-types';
import { SearchBar } from './SearchBar';
import { RecipeTable } from './RecipeTable';

export function FilterableRecipeTable({
  months,
  ingredients,
  recipes,
}: {
  months: Months;
  ingredients: Ingredients;
  recipes: Recipes;
}) {
  const [filterText, setFilterText] = useState('');

  return (
    <div>
      <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      <RecipeTable
        months={months}
        ingredients={ingredients}
        recipes={recipes}
        filterText={filterText}
      />
    </div>
  );
}
