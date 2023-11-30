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
import { updateRecipeDb } from '../rtdb';

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
  const db = useContext(RtdbContext);
  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const recipeMutation = useMutation({
    mutationFn: async (newRecipe: Recipe) => {
      await updateRecipeDb(db, newRecipe);
    },
    onError: () => {
      window.alert('Could not update...');
    },
    onSuccess: onRecipeMutationSuccess,
    onSettled: () => {
      recipeMutation.reset();
    },
  });

  function onRecipeMutationSuccess() {
    // Force an update of the recipes
    queryClient.invalidateQueries({ queryKey: ['recipes'] });
  }

  const rows = [];
  const headers = [];

  headers.push(<th key="name">Recipes</th>);
  headers.push(<th key="ingredients">Ingredients</th>);
  headers.push(<th key="months">Months</th>);
  headers.push(<th key="edit"></th>);

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
      <table>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      {objectEditor}
    </div>
  );
}
