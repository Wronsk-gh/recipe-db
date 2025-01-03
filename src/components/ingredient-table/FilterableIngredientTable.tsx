import { useState } from 'react';
import { MonthsDb, IngredientsDb } from '../../models/db-types';
import { IngredientTable } from './IngredientTable';
import { useOutletContext } from 'react-router-dom';
import { useGetAllRecipes } from '../../hooks/recipe/useGetAllRecipes';
import { useGetAllMonths } from '../../hooks/month/useGetAllMonths';
import { useGetIsRecipesLoading } from '../../hooks/db/useGetIsDbLoading';

export function FilterableIngredientTable(
  {
    // ingredients,
  } // months,
  : {
    // months: MonthsDb;
    // ingredients: IngredientsDb;
  }
) {
  // const [filterText, setFilterText] = useState('');
  const isLoading = useGetIsRecipesLoading();
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {/* <SearchBar filterText={filterText} onFilterTextChange={setFilterText} /> */}
      <IngredientTable />
    </div>
  );
}
