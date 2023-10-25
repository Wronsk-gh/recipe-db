import { useState } from 'react';
import { Months, Ingredients } from '../db-types';
import { SearchBar } from './SearchBar';
import { IngredientTable } from './IngredientTable';

export function FilterableIngredientTable({
  months,
  ingredients,
}: {
  months: Months;
  ingredients: Ingredients;
}) {
  const [filterText, setFilterText] = useState('');

  return (
    <div>
      <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      <IngredientTable months={months} ingredients={ingredients} />
    </div>
  );
}
