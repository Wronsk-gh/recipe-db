import '../App.css';
import { useState, useContext, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { RecipeManagerContext } from './RecipeManager';
import {
  MonthsDb,
  IngredientsDb,
  RecipesDb,
  Recipe,
  getRecipeIngredients,
  getRecipeMonths,
  getIngredientMonths,
  Month,
  Ingredient,
  ObjectWithName,
  ObjectWithId,
} from '../db-types';
import { RecipeRow } from './RecipeRow';
import { ObjectEditor } from './ObjectEditor';
import { PopUp } from './PopUp';
import { Filter } from './Filter';
import { TickFilter } from './TickFilter';
import { RecipeEditForm } from './RecipeEditForm';
import { RtdbContext } from './RtdbContext';
import { updateRecipeDisplayUserDb } from '../rtdb';
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
  const { months, ingredients, recipes, recipesThumbnails } =
    useOutletContext<RecipeManagerContext>();
  // Display loading animation in case the data are not yet fetched
  if (
    months === undefined ||
    ingredients === undefined ||
    recipes === undefined
  ) {
    return <p>Loading...</p>;
  }

  const recipesArray: Recipe[] = [];
  for (const recipeId in recipes) {
    const thumbnailLink =
      recipesThumbnails[recipeId] !== undefined
        ? recipesThumbnails[recipeId]
        : '';
    const recipe: Recipe = {
      id: recipeId,
      name: recipes[recipeId].name,
      ingredients: getRecipeIngredients(recipeId, recipes, ingredients),
      months: getRecipeMonths(recipeId, recipes, ingredients, months),
      google_id: recipes[recipeId].google_id,
      thumbnailLink: thumbnailLink,
    };
    recipesArray.push(recipe);
  }
  const monthsArray: Month[] = [];
  for (const monthId in months) {
    const month: Month = {
      id: monthId,
      name: months[monthId].name,
    };
    monthsArray.push(month);
  }
  const ingredientsArray: Ingredient[] = [];
  for (const ingredientId in ingredients) {
    const ingredient: Ingredient = {
      id: ingredientId,
      name: ingredients[ingredientId].name,
      months: getIngredientMonths(ingredientId, ingredients, months),
    };
    ingredientsArray.push(ingredient);
  }

  return (
    <RecipeTableLoaded
      months={months}
      ingredients={ingredients}
      monthsArray={monthsArray}
      ingredientsArray={ingredientsArray}
      recipesArray={recipesArray}
    />
  );
}

function RecipeTableLoaded({
  months,
  ingredients,
  monthsArray,
  ingredientsArray,
  recipesArray,
}: {
  months: MonthsDb;
  ingredients: IngredientsDb;
  monthsArray: Month[];
  ingredientsArray: Ingredient[];
  recipesArray: Recipe[];
}) {
  const [editedObject, setEditedObject] = useState<Recipe | undefined>(
    undefined
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  function itemToString(item: ObjectWithName | null) {
    return item ? item.name : '';
  }
  function itemToId(item: ObjectWithId | null) {
    return item ? item.id : '';
  }

  // Get the Rtdb from the context
  const rtdbCred = useContext(RtdbContext);
  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const recipeMutation = useMutation({
    mutationFn: async (newRecipe: Recipe) => {
      await updateRecipeDisplayUserDb(rtdbCred, newRecipe);
    },
    onError: () => {
      window.alert('Could not update...');
    },
    onSuccess: onRecipeMutationSuccess,
    onSettled: () => {
      recipeMutation.reset();
    },
  });

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
          return Object.keys(recipe.ingredients);
        },
        id: 'recipeIngredients',
        cell: (info) => info.getValue(),
        header: () => 'IngredientsDb',
        filterFn: 'arrIncludesAllId',
        meta: {
          headerKind: 'tickable',
          tickOptions: ingredientsArray,
        },
      },
      {
        accessorFn: (recipe) => {
          return Object.keys(recipe.months);
        },
        id: 'recipeMonths',
        cell: (info) => info.getValue(),
        header: () => 'MonthsDb',
        filterFn: 'arrIncludesAllId',
        meta: {
          headerKind: 'tickable',
          tickOptions: monthsArray,
        },
      },
    ],
    []
  );

  function onRecipeMutationSuccess() {
    // Force an update of the recipes
    queryClient.invalidateQueries({ queryKey: ['recipes'] });
  }

  const table = useReactTable({
    data: recipesArray,
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

  const rows = [];
  for (const recipe of table.getRowModel().rows) {
    rows.push(
      <RecipeRow
        key={recipe.original.id}
        months={months}
        ingredients={ingredients}
        recipe={recipe.original}
        onEdit={setEditedObject}
      />
    );
  }

  // Insert the recipe editor popup if needed
  const objectEditor =
    editedObject !== undefined ? (
      <PopUp>
        <ObjectEditor
          objectToEdit={editedObject}
          objectMutation={recipeMutation}
          renderEditForm={(props) => {
            return <RecipeEditForm {...props} ingredients={ingredients} />;
          }}
          onEditEnd={() => {
            setEditedObject(undefined);
          }}
        />
      </PopUp>
    ) : null;

  const options = Object.entries(months).map(([monthId, month]) => (
    <option value={monthId} key={monthId}>
      {month.name}
    </option>
  ));

  const filters = [];
  for (const headerGroup of table.getHeaderGroups()) {
    for (const header of headerGroup.headers) {
      if (!header.isPlaceholder) {
        if (header.column.columnDef.meta?.headerKind === 'searchable') {
          filters.push(
            <>
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
            </>
          );
        } else if (header.column.columnDef.meta?.headerKind === 'tickable') {
          filters.push(
            <>
              <TickFilter column={header.column} table={table} />
            </>
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
      {objectEditor}
    </div>
  );
}
