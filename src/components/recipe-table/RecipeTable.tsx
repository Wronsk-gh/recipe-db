// import '../App.css';
import { Recipe } from '../../db-types';
import { RecipeRow } from './RecipeRow';
import { useGetAllRecipes } from '../../hooks/recipe/useGetAllRecipes';
import { useGetRecipesThumbnails } from '../../hooks/recipe/useGetRecipesThumbnails';
import { useGetIsRecipesLoading } from '../../hooks/db/useGetIsDbLoading';
import { useRecipesColumns } from '../../hooks/recipe/useRecipesColumns';
import { useTable } from '../../hooks/table/useTable';
import { TableFilters } from '../table/TableFilters';

export function RecipeTable() {
  const recipes = useGetAllRecipes();

  const isLoading = useGetIsRecipesLoading();
  // Display loading animation in case the data are not yet fetched
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <RecipeTableLoaded recipes={recipes} />;
}

function RecipeTableLoaded({ recipes }: { recipes: Recipe[] }) {
  // Pre-fetch the thumbnails when loading the table for performance
  const thumbnails = useGetRecipesThumbnails();

  const columns = useRecipesColumns();
  const table = useTable(recipes, columns);

  // Get all the rows to be displayed
  const rows = table
    .getRowModel()
    .rows.map((tableRow) => (
      <RecipeRow key={tableRow.original.id} recipeId={tableRow.original.id} />
    ));

  return (
    <div>
      {/* {filters} */}
      <TableFilters table={table} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          columnGap: '10px',
          rowGap: '10px',
          justifyContent: 'left',
        }}
      >
        {rows}
      </div>
    </div>
  );
}
