import '../App.css';
import { useState, useContext, useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import {
  MonthsDb,
  IngredientsDb,
  RecipesDb,
  getRecipeIngredients,
  RecipesThumbnails,
  getRecipeMonths,
  getIngredientMonths,
  ObjectWithName,
  ObjectWithId,
  Recipe,
} from '../db-types';
import { RecipeRow } from './RecipeRow';
import { ObjectEditor } from './ObjectEditor';
import { PopUp } from './PopUp';
import { RecipeEditModal } from './RecipeEditModal';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Filter } from './Filter';
import { TickFilter } from './TickFilter';
import { RecipeEditForm } from './RecipeEditForm';
import { RtdbContext } from './RtdbContext';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  FilterFn,
  ColumnFiltersState,
  Column,
  Table,
  RowData,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useGetRecipesDbQuery } from '../hooks/useGetRecipesDbQuery';
import { useGetAllRecipes } from '../hooks/useGetAllRecipes';
import { useGetAllMonths } from '../hooks/useGetAllMonths';
import { useGetAllIngredientsId } from '../hooks/useGetAllIngredientsId';

import { useSelect } from 'downshift';

import Dropdown from 'react-bootstrap/Dropdown';

import { rankItem } from '@tanstack/match-sorter-utils';

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
    arrIncludesAllId: FilterFn<unknown>;
  }
  interface ColumnMeta<TData extends RowData, TValue> {
    headerKind: 'searchable' | 'tickable';
    tickOptions: (ObjectWithId & ObjectWithName)[];
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const arrIncludesAllIdFilter: FilterFn<any[]> = (
  row,
  columnId,
  filterValue,
  addMeta
) => {
  const itemValue: any[] = row.getValue(columnId);

  // Return if the item should be filtered in/out
  // Check that all IDs in the filter array are present in the item array
  return filterValue.every((el: any) => {
    return itemValue.includes(el);
  });
};

export function RecipeTable() {
  // const { months, ingredients, recipes, recipesThumbnails } =
  //   useOutletContext<RecipeManagerContext>();
  const { data: recipesData } = useGetRecipesDbQuery();

  async function fetchThumbnail(googleId: string): Promise<string> {
    const response = await gapi.client.drive.files.get({
      fileId: googleId,
      fields: 'id, name, thumbnailLink',
    });
    if (response.result.thumbnailLink !== undefined) {
      // const thumbnailResult = await fetch(
      //   response.result.thumbnailLink +
      //     '&access_token=' +
      //     gapi.client.getToken().access_token
      // );
      const thumbnailResult = await fetch(response.result.thumbnailLink);
      // const thumbnailResult = await fetch(response.result.thumbnailLink, {
      //   headers: {
      //     Authorization: `Bearer {gapi.client.getToken().access_token}`,
      //   },
      // });
      const blob = await thumbnailResult.blob();
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl;
    } else {
      return '';
    }
  }

  const thumbnailsQueries = useQueries({
    queries:
      recipesData && Object.entries(recipesData)
        ? Object.entries(recipesData).map(([recipeId, recipe]) => {
            return {
              queryKey: ['thumbnail', recipe.google_id],
              queryFn: async () => {
                const recipeIdThumbnail: RecipesThumbnails = {};
                recipeIdThumbnail[recipeId] = await fetchThumbnail(
                  recipe.google_id
                );
                return recipeIdThumbnail;
              },
              enabled: !!recipesData,
              staleTime: 10 * 60 * 1000, // 10 minute
            };
          })
        : [], // if recipesData is undefined or entries in recipesData is null, an empty array is returned
  });

  const recipesThumbnails: RecipesThumbnails = {};

  thumbnailsQueries.map((query) => {
    if (query.data !== undefined) {
      Object.assign(recipesThumbnails, query.data);
    }
  });

  // Display loading animation in case the data are not yet fetched
  // if (
  //   months === undefined ||
  //   ingredients === undefined ||
  //   recipes === undefined
  // ) {
  //   return <p>Loading...</p>;
  // }

  // const allMonths = new IdItemCollection<Month>();
  // for (const monthId in months) {
  //   const month = new Month(monthId, months);
  //   allMonths.addItem(month);
  // }
  // const allIngredients = new IdItemCollection<Ingredient>();
  // for (const ingredientId in ingredients) {
  //   const ingredient = new Ingredient(ingredientId, ingredients, allMonths);
  //   allIngredients.addItem(ingredient);
  // }
  // const allRecipes = new IdItemCollection<Recipe>();
  // for (const recipeId in recipes) {
  //   const thumbnailLink = recipesThumbnails[recipeId] ?? '';
  //   // const recipe: Recipe = {
  //   //   id: recipeId,
  //   //   name: recipes[recipeId].name,
  //   //   ingredients: getRecipeIngredients(recipeId, recipes, ingredients),
  //   //   months: getRecipeMonths(recipeId, recipes, ingredients, months),
  //   //   google_id: recipes[recipeId].google_id,
  //   //   thumbnailLink: thumbnailLink,
  //   // };
  //   const recipe = new Recipe(
  //     recipeId,
  //     recipes,
  //     thumbnailLink,
  //     allIngredients,
  //     allMonths
  //   );
  //   allRecipes.addItem(recipe);
  // }

  return <RecipeTableLoaded />;
}

function RecipeTableLoaded({}: {}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const recipes = useGetAllRecipes();
  const months = useGetAllMonths();
  const ingredients = useGetAllIngredientsId();

  // Get the Rtdb from the context
  const rtdbCred = useContext(RtdbContext);

  const columns = useMemo<ColumnDef<Recipe>[]>(
    () => [
      {
        accessorFn: (recipe) => recipe.name,
        id: 'recipeName',
        cell: (info) => info.getValue(),
        header: () => 'Name',
        filterFn: 'fuzzy',
        meta: {
          headerKind: 'searchable',
          tickOptions: [],
        },
      },
      {
        accessorFn: (recipe) => {
          return recipe.ingredients;
        },
        id: 'recipeIngredients',
        cell: (info) => info.getValue(),
        header: () => 'IngredientsDb',
        filterFn: 'arrIncludesAllId',
        meta: {
          headerKind: 'tickable',
          tickOptions: ingredients.sort((x, y) => {
            if (x.name.toLowerCase() > y.name.toLowerCase()) {
              return 1;
            }
            if (x.name.toLowerCase() < y.name.toLowerCase()) {
              return -1;
            }
            return 0;
          }),
        },
      },
      {
        accessorFn: (recipe) => {
          return recipe.months;
        },
        id: 'recipeMonths',
        cell: (info) => info.getValue(),
        header: () => 'MonthsDb',
        filterFn: 'arrIncludesAllId',
        meta: {
          headerKind: 'tickable',
          tickOptions: months,
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: recipes,
    columns: columns,
    state: {
      sorting,
      columnFilters,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
      arrIncludesAllId: arrIncludesAllIdFilter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // debugTable: true,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table
    .getRowModel()
    .rows.map((tableRow) => (
      <RecipeRow key={tableRow.original.id} recipeId={tableRow.original.id} />
    ));

  // const rows = [];
  // for (const tableRow of table.getRowModel().rows) {
  //   rows.push(
  //     <RecipeRow
  //       key={tableRow.original.id}
  //       recipe={tableRow.original}
  //     />
  //   );
  // }

  // Insert the recipe editor popup if needed
  // const objectEditor =
  //   editedObject !== undefined ? (
  //     <PopUp>
  //       <ObjectEditor
  //         objectToEdit={editedObject}
  //         objectMutation={recipeMutation}
  //         renderEditForm={(props) => {
  //           return <RecipeEditForm {...props} ingredients={ingredients} />;
  //         }}
  //         onEditEnd={() => {
  //           setEditedObject(undefined);
  //         }}
  //       />
  //     </PopUp>
  //   ) : null;

  // const options = Object.entries(months).map(([monthId, month]) => (
  //   <option value={monthId} key={monthId}>
  //     {month.name}
  //   </option>
  // ));

  const filters = [];
  for (const headerGroup of table.getHeaderGroups()) {
    for (const header of headerGroup.headers) {
      if (!header.isPlaceholder) {
        if (header.column.columnDef.meta?.headerKind === 'searchable') {
          filters.push(
            <div key={header.column.columnDef.id}>
              <div
                {...{
                  className: header.column.getCanSort()
                    ? 'cursor-pointer select-none'
                    : '',
                  onClick: header.column.getToggleSortingHandler(),
                }}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {{
                  asc: ' 🔼',
                  desc: ' 🔽',
                }[header.column.getIsSorted() as string] ?? null}
              </div>
              {header.column.getCanFilter() ? (
                <div>
                  <Filter column={header.column} table={table} />
                </div>
              ) : null}
            </div>
          );
        } else if (header.column.columnDef.meta?.headerKind === 'tickable') {
          filters.push(
            <div key={header.column.columnDef.id}>
              <TickFilter column={header.column} table={table} />
            </div>
          );
        }
      }
    }
  }

  return (
    <div>
      {filters}
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
