import { Database } from "firebase/database";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react";
import _ from "lodash";


import { updateIngredientDb } from "../rtdb";
import { Months, Ingredient } from "../db-types";

import { CallbackButton } from "./CallbackButton";

export function IngredientRow({
  db,
  months,
  ingredient,
}: {
  db: Database | undefined;
  months: Months | undefined;
  ingredient: Ingredient | undefined;
}) {
  const [displayedIngredient, setDisplayedIngredient]
    = useState<Ingredient | undefined>(undefined);
  // The previousIngredient state holds the initial prop value that was used to initialise the displayedIngredient state
  const [previousIngredient, setPreviousIngredient]
    = useState<Ingredient | undefined>(undefined);

  useEffect(() => {
    if (displayedIngredient === undefined) {
      // initialise the display variable if possible
      if (ingredient !== undefined) {
        setDisplayedIngredient(copyIngredient(ingredient));
        setPreviousIngredient(copyIngredient(ingredient))
      }
    }
  }, [ingredient]);

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const ingredientMutation = useMutation({
    mutationFn: async (newIngredient: Ingredient) => { await updateIngredientDb(db, newIngredient); },
    onError: () => {window.alert("Could not update...")},
    onSuccess: onMutationSuccess,
    onSettled: () => {ingredientMutation.reset();}
  })

  // Helper function to check if the displayed ingredient is desync
  function isIngredientDesync() : boolean {
    // The condition is that the prop data that was used to init the display has changed
    // and the display doesn't match with the new prop data
    return (!areIngredientsEqual(ingredient, previousIngredient));
  }

  // Return an empty div in case there's no data to display
  if ((months === undefined) || (displayedIngredient === undefined)) {
    return <div />
  }

  // Evaluate if ingredient's data is out of sync to apply a specific style if it's the case
  const rowStyle = {color:
    (isIngredientDesync()) ? ("red") : ("black")};
  console.log("ingredient: " + JSON.stringify(ingredient))
  console.log("displayedIngredient: " + JSON.stringify(displayedIngredient))
  console.log("previousIngredient: " + JSON.stringify(previousIngredient))

  const cells = [];
  cells.push(
    <td key={"header" + displayedIngredient.ingredientId}>{displayedIngredient.name}</td>
  );
  for (const monthId in months) {
    const handleChange = () => {
      console.log(`old content : ` + JSON.stringify(displayedIngredient));
      const newIngredient = copyIngredient(displayedIngredient);
      if ((newIngredient.months === undefined) || (!(monthId in newIngredient.months))) {
        if (newIngredient.months === undefined) {
          newIngredient.months = {};
        }
        // Add the month
        newIngredient.months[monthId] = true;
        setDisplayedIngredient(newIngredient);
      } else {
        // Remove the month
        const {[monthId]: removed, ...newMonths} = newIngredient.months;
        newIngredient.months = newMonths;
        setDisplayedIngredient(newIngredient);
      }
      console.log(`new content : ` + JSON.stringify(newIngredient));
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
  }

  // Add the update button
  async function onUpdateButtonClick() {
    if ((displayedIngredient !== undefined) && (ingredientMutation.isIdle)) {
      if (!isIngredientDesync()) {
        ingredientMutation.mutate(displayedIngredient)
      } else {
        window.alert("Ingredient is desynced, sync it first !")
      }
    }
  }
  function onMutationSuccess() {
    // Force an update of the ingredients
    queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    // Update the new reference value of ingredient here
    setPreviousIngredient(copyIngredient(displayedIngredient!))
  }
  cells.push(<td key="update"><CallbackButton label="Update" onButtonClick={onUpdateButtonClick} /></td>)

  // Add the resync button
  function onResyncButtonClick() {
      if (ingredient !== undefined) {
        setDisplayedIngredient(copyIngredient(ingredient));
        // setSyncStatus(true);
        setPreviousIngredient(copyIngredient(ingredient));
      }
  }
  cells.push(<td key="resync"><CallbackButton label="Resync" onButtonClick={onResyncButtonClick} /></td>)

  return <tr style={rowStyle}>{cells}</tr>;
}

function areIngredientsEqual(
  in1: Ingredient | undefined,
  in2: Ingredient | undefined
): Boolean {
  // Note: as of ECMA6, the keys of a JS object are officially ordered
  // thus comparing with stringify means that the order would need to be the same.
  // return JSON.stringify(in1) === JSON.stringify(in2);
  return (_.isEqual(in1, in2));
}

function copyIngredient(ingredient: Ingredient): Ingredient {
  return JSON.parse(JSON.stringify(ingredient));
}