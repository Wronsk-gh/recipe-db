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
      <RecipeEditorPopUp
        recipeToEdit={editedObject}
        listedRecipe={{
          recipeId: editedObject.recipeId,
          thumbnailLink: editedObject.thumbnailLink, // Link is not considered as important in baseline comparison
          ...recipes[editedObject.recipeId],
        }}
        ingredients={ingredients}
        onEditEnd={() => {
          setEditedObject(undefined);
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
      {objectEditor}
    </div>
  );
}
