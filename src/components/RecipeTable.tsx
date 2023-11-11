import '../App.css';
import { useState } from 'react';
import {
  Months,
  Ingredients,
  Recipes,
  Recipe,
  RecipesThumbnails,
} from '../db-types';
import { RecipeRow } from './RecipeRow';
import { RecipeEditorPopUp } from './RecipeEditorPopUp';

export function RecipeTable({
  months,
  ingredients,
  recipes,
  recipesThumbnails,
  filterText,
}: {
  months: Months;
  ingredients: Ingredients;
  recipes: Recipes;
  recipesThumbnails: RecipesThumbnails;
  filterText: string;
}) {
  const [editedRecipe, setEditedRecipe] = useState<Recipe | undefined>(
    undefined
  );
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
        isEditable={editedRecipe === undefined}
        onEdit={setEditedRecipe}
      />
    );
    // break;
  }

  // Insert the recipe editor popup if needed
  const recipeEditor =
    editedRecipe !== undefined ? (
      <RecipeEditorPopUp
        recipeToEdit={editedRecipe}
        listedRecipe={{
          recipeId: editedRecipe.recipeId,
          thumbnailLink: editedRecipe.thumbnailLink, // Link is not considered as important in baseline comparison
          ...recipes[editedRecipe.recipeId],
        }}
        ingredients={ingredients}
        onEditEnd={() => {
          setEditedRecipe(undefined);
        }}
      />
    ) : null;

  return (
    <div>
      <table>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      {recipeEditor}
    </div>
  );
}
