import '../App.css';
import { useState, useContext, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { RecipeManagerContext } from './RecipeManager';
import {
  MonthsDb,
  IngredientsDb,
  RecipesDb,
  getRecipeIngredients,
  getRecipeMonths,
  getIngredientMonths,
  ObjectWithName,
  ObjectWithId,
} from '../db-types';
import { Month } from '../models/Month';
import { Ingredient } from '../models/Ingredient';
import { Recipe } from '../models/Recipe';
import { IdItemCollection } from '../models/IdItemCollection';
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

  const allMonths = new IdItemCollection<Month>();
  for (const monthId in months) {
    const month = new Month(monthId, months);
    allMonths.addItem(month);
  }
  const allIngredients = new IdItemCollection<Ingredient>();
  for (const ingredientId in ingredients) {
    const ingredient = new Ingredient(ingredientId, ingredients, allMonths);
    allIngredients.addItem(ingredient);
  }
  const allRecipes = new IdItemCollection<Recipe>();
  for (const recipeId in recipes) {
    const thumbnailLink = recipesThumbnails[recipeId] ?? '';
    // const recipe: Recipe = {
    //   id: recipeId,
    //   name: recipes[recipeId].name,
    //   ingredients: getRecipeIngredients(recipeId, recipes, ingredients),
    //   months: getRecipeMonths(recipeId, recipes, ingredients, months),
    //   google_id: recipes[recipeId].google_id,
    //   thumbnailLink: thumbnailLink,
    // };
    const recipe = new Recipe(
      recipeId,
      recipes,
      thumbnailLink,
      allIngredients,
      allMonths
    );
    allRecipes.addItem(recipe);
  }

  return (
    <RecipeTableLoaded
      allMonths={allMonths}
      allIngredients={allIngredients}
      allRecipes={allRecipes}
    />
  );
}

function RecipeTableLoaded({
  allMonths,
  allIngredients,
  allRecipes,
}: {
  allMonths: IdItemCollection<Month>;
  allIngredients: IdItemCollection<Ingredient>;
  allRecipes: IdItemCollection<Recipe>;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
          return recipe.ingredients.IdsAsArray();
        },
        id: 'recipeIngredients',
        cell: (info) => info.getValue(),
        header: () => 'IngredientsDb',
        filterFn: 'arrIncludesAllId',
        meta: {
          headerKind: 'tickable',
          tickOptions: allIngredients.asArray().sort((x, y) => {
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
          return recipe.months.IdsAsArray();
        },
        id: 'recipeMonths',
        cell: (info) => info.getValue(),
        header: () => 'MonthsDb',
        filterFn: 'arrIncludesAllId',
        meta: {
          headerKind: 'tickable',
          tickOptions: allMonths.asArray(),
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: allRecipes.asArray(),
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
      <RecipeRow key={tableRow.original.id} recipe={tableRow.original} />
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
