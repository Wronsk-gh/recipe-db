import '../App.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useContext } from 'react';
import { Months, Ingredients, Ingredient } from '../db-types';
import { IngredientRow } from './IngredientRow';
import { AddIngredientButton } from './AddIngredientButton';
import { updateIngredientDisplayUserDb } from '../rtdb';
import { ObjectEditor } from './ObjectEditor';
import { PopUp } from './PopUp';
import { IngredientEditForm } from './IngredientEditForm';
import { RtdbContext } from './RtdbContext';

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

  // Get the Rtdb from the context
  const rtdbCred = useContext(RtdbContext);
  // Get QueryClient from the context
  const queryClient = useQueryClient();
  const ingredientMutation = useMutation({
    mutationFn: async (newIngredient: Ingredient) => {
      await updateIngredientDisplayUserDb(rtdbCred, newIngredient);
    },
    onError: () => {
      window.alert('Could not update...');
    },
    onSuccess: onIngredientMutationSuccess,
    onSettled: () => {
      ingredientMutation.reset();
    },
  });

  function onIngredientMutationSuccess() {
    // Force an update of the ingredients
    queryClient.invalidateQueries({ queryKey: ['ingredients'] });
  }

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
      <PopUp>
        <ObjectEditor
          objectToEdit={editedObject}
          objectMutation={ingredientMutation}
          renderEditForm={(props) => {
            return <IngredientEditForm {...props} months={months} />;
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
      <AddIngredientButton />
      {objectEditor}
    </div>
  );
}
