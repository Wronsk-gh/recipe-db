import '../App.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IngredientRow } from './IngredientRow';
import { useContext } from 'react';
import { Ingredient } from '../db-types';
import { AddIngredientButton } from './AddIngredientButton';
import { updateIngredientDisplayUserDb } from '../rtdb';
import { RtdbContext } from './RtdbContext';
import { useGetMonthsDbQuery } from '../hooks/useGetMonthsDbQuery';
import { useGetAllIngredients } from '../hooks/useGetAllIngredients';
import { useGetIsRecipesLoading } from '../hooks/useGetIsRecipesLoading';
import { useIngredientsColumns } from '../hooks/useIngredientsColumns';
import { useTable } from '../hooks/useTable';
import { TableFilters } from './TableFilters';

export function IngredientTable() {
  const ingredients = useGetAllIngredients();

  const isLoading = useGetIsRecipesLoading();
  // Display loading animation in case the data are not yet fetched
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <IngredientTableLoaded ingredients={ingredients} />;
}

function IngredientTableLoaded({ ingredients }: { ingredients: Ingredient[] }) {
  const columns = useIngredientsColumns();
  const table = useTable(ingredients, columns);

  // Get all the rows to be displayed
  const rows = table
    .getRowModel()
    .rows.map((tableRow) => (
      <IngredientRow
        key={tableRow.original.id}
        ingredientId={tableRow.original.id}
      />
    ));

  return (
    <>
      <TableFilters table={table} />
      <div>
        {rows}
        <AddIngredientButton />
      </div>
    </>
  );
}
