import '../App.css';
import { useState } from 'react';
import { Months, Ingredients, Ingredient } from '../db-types';
import { IngredientRow } from './IngredientRow';
import { AddIngredientButton } from './AddIngredientButton';
import { IngredientEditorPopUp } from './IngredientEditorPopUp';

export function IngredientTable({
  months,
  ingredients,
}: {
  months: Months;
  ingredients: Ingredients;
}) {
  const [editedObject, setEditedObject] = useState<Ingredient | undefined>(
    undefined
  );
  const rows = [];
  const headers = [];

  headers.push(<th key="name">Ingredients</th>);
  headers.push(<th key="months">Months</th>);
  headers.push(<th key="edit"></th>);

  for (const ingredientId in ingredients) {
    const ingredient: Ingredient = {
      ...ingredients[ingredientId],
      ingredientId: ingredientId,
    };
    rows.push(
      <IngredientRow
        key={ingredientId}
        months={months}
        ingredient={ingredient}
        onEdit={setEditedObject}
      />
    );
  }

  // Insert the recipe editor popup if needed
  const objectEditor =
    editedObject !== undefined ? (
      <IngredientEditorPopUp
        ingredientToEdit={editedObject}
        listedIngredient={{
          ingredientId: editedObject.ingredientId,
          ...ingredients[editedObject.ingredientId],
        }}
        months={months}
        onEditEnd={() => {
          setEditedObject(undefined);
        }}
      />
    ) : null;

  return (
    <div>
      <table className="tableFixHead">
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      <AddIngredientButton />
      {objectEditor}
    </div>
  );
}
