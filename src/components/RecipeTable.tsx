import '../App.css';
import { useState, useContext, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Months, Ingredients, Recipe, RecipesThumbnails } from '../db-types';
import { RecipeRow } from './RecipeRow';
import { ObjectEditor } from './ObjectEditor';
import { PopUp } from './PopUp';
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
} from '@tanstack/react-table';

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
      },
    ],
    []
  );

  // const excolumns = React.useMemo<ColumnDef<Person>[]>(
  //   () => [
  //     {
  //       header: 'Name',
  //       footer: (props) => props.column.id,
  //       columns: [
  //         {
  //           accessorKey: 'firstName',
  //           cell: (info) => info.getValue(),
  //           footer: (props) => props.column.id,
  //         },
  //         {
  //           accessorFn: (row) => row.lastName,
  //           id: 'lastName',
  //           cell: (info) => info.getValue(),
  //           header: () => <span>Last Name</span>,
  //           footer: (props) => props.column.id,
  //         },
  //       ],
  //     },
  //     {
  //       header: 'Info',
  //       footer: (props) => props.column.id,
  //       columns: [
  //         {
  //           accessorKey: 'age',
  //           header: () => 'Age',
  //           footer: (props) => props.column.id,
  //         },
  //         {
  //           header: 'More Info',
  //           columns: [
  //             {
  //               accessorKey: 'visits',
  //               header: () => <span>Visits</span>,
  //               footer: (props) => props.column.id,
  //             },
  //             {
  //               accessorKey: 'status',
  //               header: 'Status',
  //               footer: (props) => props.column.id,
  //             },
  //             {
  //               accessorKey: 'progress',
  //               header: 'Profile Progress',
  //               footer: (props) => props.column.id,
  //             },
  //           ],
  //         },
  //         {
  //           accessorKey: 'createdAt',
  //           header: 'Created At',
  //         },
  //       ],
  //     },
  //   ],
  //   []
  // );

  function onRecipeMutationSuccess() {
    // Force an update of the recipes
    queryClient.invalidateQueries({ queryKey: ['recipes'] });
  }

  // const recipeArray = [];
  // for (const recipeId in recipes) {
  //   const thumbnailLink =
  //     recipesThumbnails[recipeId] !== undefined
  //       ? recipesThumbnails[recipeId]
  //       : '';
  //   const recipe: Recipe = {
  //     ...recipes[recipeId],
  //     recipeId: recipeId,
  //     thumbnailLink: thumbnailLink,
  //   };
  //   recipeArray.push(recipe);
  //   // break; // Uncomment to display only one recipe, for easier debugging
  // }

  const table = useReactTable({
    data: recipesArray,
    columns: columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
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
