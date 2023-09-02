import { Months, Ingredient } from "../db-types";
import { useState, useEffect } from "react";
import { CallbackButton } from "./CallbackButton";

function areIngredientsEqual(
  in1: Ingredient | undefined,
  in2: Ingredient | undefined
): Boolean {
  return JSON.stringify(in1) === JSON.stringify(in2);
}

function copyIngredient(ingredient: Ingredient): Ingredient {
  return JSON.parse(JSON.stringify(ingredient));
}

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
  const [syncStatus, setSyncStatus] = useState(false);
  useEffect(() => {
    let displayString = "";
    if (ingredient === undefined) {
      displayString = "no ingredient"
    } else {
      displayString = ingredient.name
    }
    console.log("effect is called " + displayString);
    if (displayedIngredient === undefined) {
      // initialise the display variable if possible
      if (ingredient !== undefined) {
        setDisplayedIngredient(copyIngredient(ingredient));
        setSyncStatus(true);
      }
    } else {
      if (!areIngredientsEqual(ingredient, displayedIngredient)) {
        setSyncStatus(false);
      } else {
        setSyncStatus(true);
      }
    }
  }, [ingredient]);
  useEffect(() => {
    console.log("rendering " + JSON.stringify(displayedIngredient))
  })

  const rowStyle = {
    color: "",
  };

  if (syncStatus) {
    rowStyle.color = "black";
  } else {
    rowStyle.color = "red";
  }

  if ((months === undefined) || (ingredient === undefined)) {
    return <div />
  }

  const cells = [];
  cells.push(
    <td key={"header" + ingredient.ingredientId}>{ingredient.name}</td>
  );
  for (const monthId in months) {
    const handleChange = () => {
      if (displayedIngredient === undefined) {
        return;
      } else {
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
  }

  // Add the update button
  function onUpdateButtonClick() {
  }
  cells.push(<td key="update"><CallbackButton label="Update" onButtonClick={onUpdateButtonClick} /></td>)

  // Add the resync button
  function onResyncButtonClick() {
      if (ingredient !== undefined) {
        console.log(JSON.stringify(ingredient))
        setDisplayedIngredient({...ingredient});
        setSyncStatus(true);
      }
  }
  cells.push(<td key="resync"><CallbackButton label="Resync" onButtonClick={onResyncButtonClick} /></td>)

  return <tr style={rowStyle}>{cells}</tr>;
}
