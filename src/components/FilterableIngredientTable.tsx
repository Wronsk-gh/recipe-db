import { useState } from 'react';
import { MonthsDb, IngredientsDb } from '../db-types';
import { SearchBar } from './SearchBar';
import { IngredientTable } from './IngredientTable';
import { useOutletContext } from 'react-router-dom';
import { useGetAllRecipes } from '../hooks/useGetAllRecipes';
import { useGetAllMonths } from '../hooks/useGetAllMonths';
import { useGetAllIngredients } from '../hooks/useGetAllIngredients';

export function FilterableIngredientTable({} // months,
// ingredients,
: {
  // months: MonthsDb;
  // ingredients: IngredientsDb;
}) {
  const [filterText, setFilterText] = useState('');
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

  return (
    <div>
      <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      <IngredientTable />
    </div>
  );
}
