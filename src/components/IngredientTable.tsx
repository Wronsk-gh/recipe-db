import '../App.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IngredientRow } from './IngredientRow';
import { useState, useContext } from 'react';
import { MonthsDb, IngredientsDb, Ingredient, Month } from '../db-types';
import { AddIngredientButton } from './AddIngredientButton';
import { updateIngredientDisplayUserDb } from '../rtdb';
import { ObjectEditor } from './ObjectEditor';
import { PopUp } from './PopUp';
import { IngredientEditForm } from './IngredientEditForm';
import { RtdbContext } from './RtdbContext';
import { useGetMonthsDbQuery } from '../hooks/useGetMonthsDbQuery';
import { useGetAllIngredients } from '../hooks/useGetAllIngredients';

export function IngredientTable() {
  const { data: months } = useGetMonthsDbQuery();
  const ingredients = useGetAllIngredients();
  // const [editedObject, setEditedObject] = useState<Ingredient | undefined>(
  //   undefined
  // );

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
  // const headers = [];

  // headers.push(<th key="name">IngredientsDb</th>);
  // headers.push(<th key="months">MonthsDb</th>);
  // headers.push(<th key="edit"></th>);

  for (const ingredient of ingredients) {
    rows.push(
      <IngredientRow
        key={ingredient.id}
        ingredient={ingredient}
        // onEdit={setEditedObject}
      />
    );
  }

  // // Insert the recipe editor popup if needed
  // const objectEditor =
  //   editedObject !== undefined ? (
  //     <PopUp>
  //       <ObjectEditor
  //         objectToEdit={editedObject}
  //         objectMutation={ingredientMutation}
  //         renderEditForm={(props) => {
  //           return <IngredientEditForm {...props} months={months} />;
  //         }}
  //         onEditEnd={() => {
  //           setEditedObject(undefined);
  //         }}
  //       />
  //     </PopUp>
  //   ) : null;

  return (
    <div>
      {/* <table>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table> */}
      {rows}
      <AddIngredientButton />
      {/* {objectEditor} */}
    </div>
  );
}
