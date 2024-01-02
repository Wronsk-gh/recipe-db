import '../App.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { IngredientRow } from './IngredientRow';
import { useState, useContext } from 'react';
import {
  MonthsDb,
  IngredientsDb,
  Ingredient,
  Month,
  getIngredientMonths,
} from '../db-types';
import { RecipeManagerContext } from './RecipeManager';
import { AddIngredientButton } from './AddIngredientButton';
import { updateIngredientDisplayUserDb } from '../rtdb';
import { ObjectEditor } from './ObjectEditor';
import { PopUp } from './PopUp';
import { IngredientEditForm } from './IngredientEditForm';
import { RtdbContext } from './RtdbContext';

export function IngredientTable() {
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

  const monthsArray: Month[] = [];
  for (const monthId in months) {
    const month: Month = {
      id: monthId,
      name: months[monthId].name,
    };
    monthsArray.push(month);
  }
  const ingredientsArray: Ingredient[] = [];
  for (const ingredientId in ingredients) {
    const ingredient: Ingredient = {
      id: ingredientId,
      name: ingredients[ingredientId].name,
      months: getIngredientMonths(ingredientId, ingredients, months),
    };
    ingredientsArray.push(ingredient);
  }

  return (
    <IngredientTableLoaded
      months={months}
      ingredients={ingredients}
      monthsArray={monthsArray}
      ingredientsArray={ingredientsArray}
    />
  );
}

export function IngredientTableLoaded({
  months,
  ingredients,
  monthsArray,
  ingredientsArray,
}: {
  months: MonthsDb;
  ingredients: IngredientsDb;
  monthsArray: Month[];
  ingredientsArray: Ingredient[];
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

  headers.push(<th key="name">IngredientsDb</th>);
  headers.push(<th key="months">MonthsDb</th>);
  headers.push(<th key="edit"></th>);

  // for (const ingredientId in ingredients) {
  //   const ingredient: Ingredient = {
  //     ...ingredients[ingredientId],
  //     id: ingredientId,
  //   };
  //   rows.push(
  //     <IngredientRow
  //       key={ingredientId}
  //       months={months}
  //       ingredient={ingredient}
  //       onEdit={setEditedObject}
  //     />
  //   );
  // }

  for (const ingredient of ingredientsArray) {
    rows.push(
      <IngredientRow
        key={ingredient.id}
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
