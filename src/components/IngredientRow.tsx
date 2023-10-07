import { Database } from 'firebase/database';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import { updateIngredientDb, updateIngredientNameDb } from '../rtdb';
import { Months, Ingredient } from '../db-types';

import { CallbackButton } from './CallbackButton';
import { RtdbContext } from './RtdbContext';

export function IngredientRow({
  months,
  ingredient,
}: {
  months: Months | undefined;
  ingredient: Ingredient | undefined;
}) {
  const [displayedIngredient, setDisplayedIngredient] = useState<
    Ingredient | undefined
  >(undefined);
  // The previousIngredient state holds the initial prop value that was used to initialise the displayedIngredient state
  const [previousIngredient, setPreviousIngredient] = useState<
    Ingredient | undefined
  >(undefined);
  // Get the Rtdb from the context
  const db = useContext(RtdbContext);

  useEffect(() => {
    if (displayedIngredient === undefined) {
      // initialise the display variable if possible
      if (ingredient !== undefined) {
        setDisplayedIngredient(copyIngredient(ingredient));
        setPreviousIngredient(copyIngredient(ingredient));
      }
    }
  }, [ingredient]);

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const ingredientMonthsMutation = useMutation({
    mutationFn: async (newIngredient: Ingredient) => {
      await updateIngredientDb(db, newIngredient);
    },
    onError: () => {
      window.alert('Could not update...');
    },
    onSuccess: onIngredientMonthsMutationSuccess,
    onSettled: () => {
      ingredientMonthsMutation.reset();
    },
  });

  const ingredientNameMutation = useMutation({
    mutationFn: async ({
      ingredientId,
      newName,
    }: {
      ingredientId: string;
      newName: string;
    }) => {
      await updateIngredientNameDb(db, ingredientId, newName);
    },
    onError: () => {
      window.alert('Could not update...');
    },
    onSuccess: onIngredientNameMutationSuccess,
    onSettled: () => {
      ingredientNameMutation.reset();
    },
  });

  // Helper function to check if the displayed ingredient is desync
  function isIngredientDesync(): boolean {
    // The condition is that the prop data that was used to init the display has changed
    // and the display doesn't match with the new prop data
    return !areIngredientsEqual(ingredient, previousIngredient);
  }

  // Return an empty div in case there's no data to display
  // if ((months === undefined) || (displayedIngredient === undefined)) {
  //   return <div />
  // }
  // if (months === undefined) {
  //   // On td for ingredient name, update button and resync button
  //   return
  //     <tr>
  //       <td></td>
  //       <td></td>
  //       <td></td>
  //     </tr>
  // }

  // Evaluate if ingredient's data is out of sync to apply a specific style if it's the case
  const rowStyle = { color: isIngredientDesync() ? 'red' : 'black' };

  const cells = [];
  if (displayedIngredient !== undefined) {
    cells.push(
      <td key={'header' + displayedIngredient.ingredientId}>
        {displayedIngredient.name}
      </td>
    );
  } else {
    cells.push(<td key={'header empty'}></td>);
  }
  for (const monthId in months) {
    if (displayedIngredient !== undefined) {
      const handleChange = () => {
        const newIngredient = copyIngredient(displayedIngredient);
        if (
          newIngredient.months === undefined ||
          !(monthId in newIngredient.months)
        ) {
          if (newIngredient.months === undefined) {
            newIngredient.months = {};
          }
          // Add the month
          newIngredient.months[monthId] = true;
          setDisplayedIngredient(newIngredient);
        } else {
          // Remove the month
          const { [monthId]: removed, ...newMonths } = newIngredient.months;
          newIngredient.months = newMonths;
          setDisplayedIngredient(newIngredient);
        }
      };
      cells.push(
        <td key={monthId}>
          <input
            type="checkbox"
            checked={
              displayedIngredient !== undefined &&
              displayedIngredient.months !== undefined &&
              monthId in displayedIngredient.months &&
              displayedIngredient.months[monthId] === true
            }
            onChange={handleChange}
          />
        </td>
      );
    } else {
      cells.push(<td key={monthId}></td>);
    }
  }

  // Add the update button
  async function onUpdateButtonClick() {
    if (displayedIngredient !== undefined && ingredientMonthsMutation.isIdle) {
      if (!isIngredientDesync()) {
        ingredientMonthsMutation.mutate(displayedIngredient);
      } else {
        window.alert('Ingredient is desynced, sync it first !');
      }
    }
  }

  function onIngredientMonthsMutationSuccess() {
    // Force an update of the ingredients
    queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    // Update the new reference value of ingredient here
    setPreviousIngredient(copyIngredient(displayedIngredient!));
  }

  if (displayedIngredient !== undefined) {
    cells.push(
      <td key="update">
        <CallbackButton label="Update" onButtonClick={onUpdateButtonClick} />
      </td>
    );
  } else {
    cells.push(<td key="update"></td>);
  }

  // Add the resync button
  function onResyncButtonClick() {
    if (ingredient !== undefined) {
      setDisplayedIngredient(copyIngredient(ingredient));
      // setSyncStatus(true);
      setPreviousIngredient(copyIngredient(ingredient));
    }
  }
  if (displayedIngredient !== undefined) {
    cells.push(
      <td key="resync">
        <CallbackButton label="Resync" onButtonClick={onResyncButtonClick} />
      </td>
    );
  } else {
    cells.push(<td key="resync"></td>);
  }

  // Add the rename button
  async function onRenameButtonClick() {
    if (displayedIngredient !== undefined && ingredientMonthsMutation.isIdle) {
      if (!isIngredientDesync()) {
        const newName = window.prompt('New names ?');
        if (newName !== null) {
          ingredientNameMutation.mutate({
            ingredientId: displayedIngredient.ingredientId,
            newName: newName,
          });
        } else {
          window.alert('Enter a valid new name !');
        }
      } else {
        window.alert('Ingredient is desynced, sync it first !');
      }
    }
  }

  function onIngredientNameMutationSuccess(
    data: void,
    {
      ingredientId,
      newName,
    }: {
      ingredientId: string;
      newName: string;
    },
    context: unknown
  ) {
    // Force an update of the ingredients
    queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    // Update the new reference value of ingredient here
    const newIngredient = copyIngredient(displayedIngredient!);
    newIngredient.name = newName;
    setDisplayedIngredient(newIngredient);
    setPreviousIngredient({ ...previousIngredient!, name: newName });
  }

  if (displayedIngredient !== undefined) {
    cells.push(
      <td key="rename">
        <CallbackButton label="Rename" onButtonClick={onRenameButtonClick} />
      </td>
    );
  } else {
    cells.push(<td key="rename"></td>);
  }

  return <tr style={rowStyle}>{cells}</tr>;
}

function areIngredientsEqual(
  in1: Ingredient | undefined,
  in2: Ingredient | undefined
): Boolean {
  // Note: as of ECMA6, the keys of a JS object are officially ordered
  // thus comparing with stringify means that the order would need to be the same.
  // return JSON.stringify(in1) === JSON.stringify(in2);
  return _.isEqual(in1, in2);
}

function copyIngredient(ingredient: Ingredient): Ingredient {
  return JSON.parse(JSON.stringify(ingredient));
}
