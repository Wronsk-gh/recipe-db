import { useState } from 'react';
import { Months, Ingredients, Recipes, RecipesThumbnails } from '../db-types';
import { SearchBar } from './SearchBar';
import { RecipeTable } from './RecipeTable';

export function FilterableRecipeTable({
  months,
  ingredients,
  recipes,
  recipesThumbnails,
}: {
  months: Months;
  ingredients: Ingredients;
  recipes: Recipes;
  recipesThumbnails: RecipesThumbnails;
}) {
  const [filterText, setFilterText] = useState('');

  return (
    <div>
      <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      <RecipeTable
        months={months}
        ingredients={ingredients}
        recipes={recipes}
        recipesThumbnails={recipesThumbnails}
        filterText={filterText}
      />
    </div>
  );
}
