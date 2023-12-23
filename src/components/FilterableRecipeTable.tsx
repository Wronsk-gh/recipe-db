import { useState } from 'react';
import { Months, Ingredients, Recipes, RecipesThumbnails } from '../db-types';
import { SearchBar } from './SearchBar';
import { RecipeTable } from './RecipeTable';
import { useOutletContext } from 'react-router-dom';
import { RecipeManagerContext } from './RecipeManager';

export function FilterableRecipeTable({} // months,
// ingredients,
// recipes,
// recipesThumbnails,
: {
  // months: Months;
  // ingredients: Ingredients;
  // recipes: Recipes;
  // recipesThumbnails: RecipesThumbnails;
}) {
  const [filterText, setFilterText] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const { months, ingredients, recipes, recipesArray, recipesThumbnails } =
    useOutletContext<RecipeManagerContext>();
  if (
    months === undefined ||
    ingredients === undefined ||
    recipes === undefined
  ) {
    return <p>Loading...</p>;
  }

  const options = Object.entries(months).map(([monthId, month]) => (
    <option value={monthId} key={monthId}>
      {month.name}
    </option>
  ));

  return (
    <div>
      <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      <form>
        <label htmlFor="month">Choose a month:</label>
        <select
          name="month"
          onChange={(newValue) => setSelectedMonth(newValue.target.value)}
        >
          <option value={''} key={''}>
            {'All'}
          </option>
          {options}
        </select>
      </form>
      <RecipeTable
        months={months}
        ingredients={ingredients}
        recipesArray={recipesArray}
        filterText={filterText}
        monthFilter={selectedMonth}
      />
    </div>
  );
}
