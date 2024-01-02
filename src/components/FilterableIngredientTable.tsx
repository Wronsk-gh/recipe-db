import { useState } from 'react';
import { MonthsDb, IngredientsDb } from '../db-types';
import { SearchBar } from './SearchBar';
import { IngredientTable } from './IngredientTable';
import { useOutletContext } from 'react-router-dom';
import { RecipeManagerContext } from './RecipeManager';

export function FilterableIngredientTable({} // months,
// ingredients,
: {
  // months: MonthsDb;
  // ingredients: IngredientsDb;
}) {
  const [filterText, setFilterText] = useState('');
  const { months, ingredients, recipes, recipesThumbnails } =
    useOutletContext<RecipeManagerContext>();
  if (
    months === undefined ||
    ingredients === undefined ||
    recipes === undefined
  ) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      <IngredientTable />
    </div>
  );
}
