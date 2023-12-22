import '../App.css';
import { useState, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Months,
  Ingredients,
  Recipes,
  Recipe,
  RecipesThumbnails,
} from '../db-types';
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
  recipes,
  recipesThumbnails,
  filterText,
  monthFilter,
}: {
  months: Months;
  ingredients: Ingredients;
  recipes: Recipes;
  recipesThumbnails: RecipesThumbnails;
  filterText: string;
  monthFilter: string;
}) {
  const [editedObject, setEditedObject] = useState<Recipe | undefined>(
    undefined
  );

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

  // const columns: ColumnDef<Recipe>[] = [
  const columns: ColumnDef<Recipe>[] = [
    {
      accessorKey: 'firstName',
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row.lastName,
      id: 'recipeName',
      cell: (info) => info.getValue(),
      header: () => <span>Last Name</span>,
      footer: (props) => props.column.id,
    },
  ];

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

  const rows = [];

  for (const recipeId in recipes) {
    const thumbnailLink =
      recipesThumbnails[recipeId] !== undefined
        ? recipesThumbnails[recipeId]
        : '';
    const recipe: Recipe = {
      ...recipes[recipeId],
      recipeId: recipeId,
      thumbnailLink: thumbnailLink,
    };
    rows.push(
      <RecipeRow
        key={recipeId}
        months={months}
        ingredients={ingredients}
        recipe={recipe}
        onEdit={setEditedObject}
        filterText={filterText}
        monthFilter={monthFilter}
      />
    );
    // break; // Uncomment to display only one recipe, for easier debugging
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
