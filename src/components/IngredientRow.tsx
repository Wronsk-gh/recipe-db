import { Months, Ingredient } from "../db-types";
import { useState, useEffect } from "react";

// export function FilterableIngredientTable({ months, loading }: { months: Months, loading: boolean }) {
export function IngredientRow({
  months,
  ingredient,
}: {
  months: Months;
  ingredient: Ingredient;
}) {
  const [displayedIngredient, setDisplayedIngredient] = useState();
  const cells = [];

  cells.push(
    <td key={"header" + ingredient.ingredientId}>{ingredient.name}</td>
  );

  if (!("months" in ingredient)) {
    console.log(ingredient);
  }

  for (const monthId in months) {
    const handleChange = () => {};

    cells.push(
      <td key={monthId}>
        <input
          type="checkbox"
          checked={
            "months" in ingredient &&
            monthId in ingredient.months &&
            ingredient.months[monthId] === true
          }
          onChange={handleChange}
        />
      </td>
    );
  }

  return <tr>{cells}</tr>;
}
