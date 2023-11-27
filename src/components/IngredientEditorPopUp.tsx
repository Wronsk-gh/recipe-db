import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import { TagBox } from './TagBox';
import { updateIngredientDb, updateIngredientNameDb } from '../rtdb';

import { updateRecipeDb } from '../rtdb';
import { Months, Ingredients, Recipe, Ingredient, Tag } from '../db-types';

import { RtdbContext } from './RtdbContext';

export function IngredientEditorPopUp({
  months,
  ingredientToEdit,
  listedIngredient, // present for verification of whether or no the recipe was modified by another user
  onEditEnd,
}: {
  months: Months;
  ingredientToEdit: Ingredient;
  listedIngredient: Ingredient | undefined;
  onEditEnd: () => void;
}) {
  // Get the Rtdb from the context
  const db = useContext(RtdbContext);

  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [displayedMonths, setDisplayedMonths] = useState({
    ...ingredientToEdit.months,
  });
  const [displayedName, setDisplayedName] = useState({
    ...ingredientToEdit.name,
  });

  const ingredientMutation = useMutation({
    mutationFn: async (newIngredient: Ingredient) => {
      await updateIngredientDb(db, newIngredient);
    },
    onError: () => {
      window.alert('Could not update...');
    },
    onSuccess: onIngredientMutationSuccess,
    onSettled: () => {
      ingredientMutation.reset();
    },
  });

  // Get QueryClient from the context
  const queryClient = useQueryClient();
  
  function onIngredientMutationSuccess() {
    // Force an update of the ingredients
    queryClient.invalidateQueries({ queryKey: ['ingredients'] });
  }

  // const ingredientNameMutation = useMutation({
  //   mutationFn: async ({
  //     ingredientId,
  //     newName,
  //   }: {
  //     ingredientId: string;
  //     newName: string;
  //   }) => {
  //     await updateIngredientNameDb(db, ingredientId, newName);
  //   },
  //   onError: () => {
  //     window.alert('Could not update...');
  //   },
  //   onSuccess: onIngredientNameMutationSuccess,
  //   onSettled: () => {
  //     ingredientNameMutation.reset();
  //   },
  // });

  // function onIngredientNameMutationSuccess(
  //   data: void,
  //   {
  //     ingredientId,
  //     newName,
  //   }: {
  //     ingredientId: string;
  //     newName: string;
  //   },
  //   context: unknown
  // ) {
  //   // Force an update of the ingredients
  //   queryClient.invalidateQueries({ queryKey: ['ingredients'] });
  //   // Update the new reference value of ingredient here
  //   const newIngredient = copyIngredient(displayedIngredient!);
  //   newIngredient.name = newName;
  //   setDisplayedIngredient(newIngredient);
  //   setPreviousIngredient({ ...previousIngredient!, name: newName });
  // }

  // const recipeIngredientsMutation = useMutation({
  //   mutationFn: async (newRecipe: Recipe) => {
  //     await updateRecipeDb(db, newRecipe);
  //   },
  //   onError: () => {
  //     window.alert('Could not update...');
  //   },
  //   onSuccess: onRecipeIngredientsMutationSuccess,
  //   onSettled: () => {
  //     recipeIngredientsMutation.reset();
  //   },
  // });

  // function onRecipeIngredientsMutationSuccess() {
  //   // Force an update of the recipes
  //   queryClient.invalidateQueries({ queryKey: ['recipes'] });
  // }

  const options = Object.entries(months)
    .map(([monthId, month]) => (
      <option value={monthId} key={monthId}>
        {month.name}
      </option>
    ));

  const monthsTags = Object.keys(
    displayedMonths !== undefined ? displayedMonths : {}
  ).map((monthId: string) => {
    if (monthId in months) {
      return (
        <TagBox
          tag={{ id: monthId, name: months[monthId].name }}
          onClose={(tag: Tag) => {
            const { [tag.id]: removed, ...newMonths } =
              displayedMonths;
            setDisplayedMonths(newMonths);
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
        {ingredientToEdit.name}
        <form>
          <label htmlFor="months">Choose a month:</label>
          <select
            name="months"
            onChange={(newValue) =>
              setSelectedMonth(newValue.target.value)
            }
          >
            <option value={''} key={''}>
              {'-'}
            </option>
            {options}
          </select>
        </form>
        {monthsTags}
        <button
          onClick={() => {
            if (selectedMonth !== '') {
              if (displayedMonths[selectedMonth] === undefined) {
                setDisplayedMonths({
                  [selectedMonth]: true,
                  ...displayedMonths,
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
            // Check that the displayed month is still identical to the one at the pup-up creation
            if (!_.isEqual(monthToEdit, listedMonth)) {
              alert('Month was modified by another user !!!');
            } else {
              if (ingredientMutation.isIdle) {
                ingredientMutation.mutate({
                  ...ingredientToEdit,
                  name: displayedName,
                  months: displayedMonths,
                });
                onEditEnd();
              } else {
                alert('Month is already being modified !!!');
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
