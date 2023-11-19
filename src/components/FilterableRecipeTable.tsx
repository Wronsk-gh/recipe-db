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
  const [selectedMonth, setSelectedMonth] = useState<string>('');

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
        recipes={recipes}
        recipesThumbnails={recipesThumbnails}
        filterText={filterText}
        monthFilter={selectedMonth}
      />
    </div>
  );
}
