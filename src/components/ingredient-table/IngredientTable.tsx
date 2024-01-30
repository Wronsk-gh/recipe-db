// import '../App.css';
import { IngredientRow } from './IngredientRow';
import { Ingredient } from '../../db-types';
import { AddIngredientButton } from './AddIngredientButton';
import { useGetAllIngredients } from '../../hooks/ingredient/useGetAllIngredients';
import { useGetIsRecipesLoading } from '../../hooks/db/useGetIsDbLoading';
import { useIngredientsColumns } from '../../hooks/ingredient/useIngredientsColumns';
import { useTable } from '../../hooks/table/useTable';
import { TableFilters } from '../table/TableFilters';

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
