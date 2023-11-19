import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import { TagBox } from './TagBox';

import { updateRecipeDb } from '../rtdb';
import { Months, Ingredients, Recipe, Tag } from '../db-types';

import { RtdbContext } from './RtdbContext';

export function RecipeEditorPopUp({
  ingredients,
  recipeToEdit,
  listedRecipe, // present for verification of whether or no the recipe was modified by another user
  onEditEnd,
}: {
  ingredients: Ingredients;
  recipeToEdit: Recipe;
  listedRecipe: Recipe | undefined;
  onEditEnd: () => void;
}) {
  // Get the Rtdb from the context
  const db = useContext(RtdbContext);

  const [selectedIngredient, setSelectedIngredient] = useState<string>('');
  const [displayedIngredients, setDisplayedIngredients] = useState({
    ...recipeToEdit.ingredients,
  });

  const recipeIngredientsMutation = useMutation({
    mutationFn: async (newRecipe: Recipe) => {
      await updateRecipeDb(db, newRecipe);
    },
    onError: () => {
      window.alert('Could not update...');
    },
    onSuccess: onRecipeIngredientsMutationSuccess,
    onSettled: () => {
      recipeIngredientsMutation.reset();
    },
  });

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  function onRecipeIngredientsMutationSuccess() {
    // Force an update of the recipes
    queryClient.invalidateQueries({ queryKey: ['recipes'] });
  }

  const options = Object.entries(ingredients)
    .sort((a, b) => {
      if (a[1].name > b[1].name) {
        return 1;
      }
      if (b[1].name > a[1].name) {
        return -1;
      }
      return 0;
    })
    .map(([ingredientId, ingredient]) => (
      <option value={ingredientId} key={ingredientId}>
        {ingredient.name}
      </option>
    ));

  const ingredientsTags = Object.keys(
    displayedIngredients !== undefined ? displayedIngredients : {}
  ).map((ingredientId: string) => {
    if (ingredientId in ingredients) {
      return (
        <TagBox
          tag={{ id: ingredientId, name: ingredients[ingredientId].name }}
          onClose={(tag: Tag) => {
            const { [tag.id]: removed, ...newIngredients } =
              displayedIngredients;
            setDisplayedIngredients(newIngredients);
          }}
        />
      );
    } else {
      return null;
    }
  });

  return (
    <div className="popup">
      <div className="popup-inner">
        {recipeToEdit.name}
        <form>
          <label htmlFor="ingredients">Choose an ingredient:</label>
          <select
            name="ingredients"
            onChange={(newValue) =>
              setSelectedIngredient(newValue.target.value)
            }
          >
            <option value={''} key={''}>
              {'-'}
            </option>
            {options}
          </select>
        </form>
        {ingredientsTags}
        <button
          onClick={() => {
            if (selectedIngredient !== '') {
              if (displayedIngredients[selectedIngredient] === undefined) {
                setDisplayedIngredients({
                  [selectedIngredient]: true,
                  ...displayedIngredients,
                });
              }
            }
          }}
        >
          Add
        </button>
        <button onClick={onEditEnd}>Cancel edit</button>
        <button
          onClick={() => {
            // Check that the displayed recipe is still identical to the one at the pup-up creation
            if (!_.isEqual(recipeToEdit, listedRecipe)) {
              alert('Recipe was modified by another user !!!');
            } else {
              if (recipeIngredientsMutation.isIdle) {
                recipeIngredientsMutation.mutate({
                  ...recipeToEdit,
                  ingredients: displayedIngredients,
                });
                onEditEnd();
              } else {
                alert('Recipe is already being modified !!!');
              }
            }
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
