import { useState } from 'react';
import {
  MonthsDb,
  IngredientsDb,
  RecipesDb,
  RecipesThumbnails,
} from '../../models/db-types';
import { RecipeTable } from './RecipeTable';
import { useOutletContext } from 'react-router-dom';
import { useGetAllRecipes } from '../../hooks/recipe/useGetAllRecipes';
import { useGetAllMonths } from '../../hooks/month/useGetAllMonths';
import { useGetAllIngredients } from '../../hooks/ingredient/useGetAllIngredients';

export function FilterableRecipeTable(
  {
    // ingredients,
    // recipes,
    // recipesThumbnails,
  } // months,
  : {
    // months: MonthsDb;
    // ingredients: IngredientsDb;
    // recipes: RecipesDb;
    // recipesThumbnails: RecipesThumbnails;
  }
) {
  const [filterText, setFilterText] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const recipes = useGetAllRecipes();
  const months = useGetAllMonths();
  const ingredients = useGetAllIngredients();

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
      {/* <SearchBar filterText={filterText} onFilterTextChange={setFilterText} /> */}
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
      <RecipeTable />
    </div>
  );
}
