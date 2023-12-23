import '../App.css';
import { useState, useContext, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Months, Ingredients, Recipe } from '../db-types';
import { RecipeRow } from './RecipeRow';
import { ObjectEditor } from './ObjectEditor';
import { PopUp } from './PopUp';
import { Filter } from './Filter';
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
  getFilteredRowModel,
} from '@tanstack/react-table';

import { rankItem } from '@tanstack/match-sorter-utils';

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
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

export function RecipeTable({
  months,
  ingredients,
  recipesArray,
  filterText,
  monthFilter,
}: {
  months: Months;
  ingredients: Ingredients;
  recipesArray: Recipe[];
  filterText: string;
  monthFilter: string;
}) {
  const [editedObject, setEditedObject] = useState<Recipe | undefined>(
    undefined
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
      },
      {
        accessorFn: (recipe) => {
          recipe.name;
        },
        id: 'recipeTags',
        cell: (info) => info.getValue(),
        header: () => 'Tags',
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
        key={recipe.original.recipeId}
        months={months}
        ingredients={ingredients}
        recipe={recipe.original}
        onEdit={setEditedObject}
        filterText={filterText}
        monthFilter={monthFilter}
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

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
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
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
      </table>
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
