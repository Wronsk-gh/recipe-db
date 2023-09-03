import { Database } from "firebase/database";
import { Months, Ingredients, Ingredient } from "../db-types";
import { IngredientRow } from "./IngredientRow";

// export function IngredientTable({ months, loading }: { months: Months, loading: boolean }) {
export function IngredientTable({
  db,
  months,
  ingredients,
}: {
  db: Database | undefined;
  months: Months | undefined;
  ingredients: Ingredients | undefined;
}) {
  const rows = [];
  const headers1 = [];
  const headers2 = [];

  headers1.push(<th key="header"></th>);
  headers2.push(<th key="header">Ingredients</th>);
  for (const monthId in months) {
    headers1.push(<th key={monthId}>{months[monthId].name}</th>);
    headers2.push(<th key={monthId}></th>);
  }
  headers1.push(<th key="resync"></th>);
  headers2.push(<th key="resync"></th>);
  headers1.push(<th key="update"></th>);
  headers2.push(<th key="update"></th>);

  for (const ingredientId in ingredients) {
    const ingredient: Ingredient = {
      ...ingredients[ingredientId],
      ingredientId: ingredientId,
    };
    rows.push(
      <IngredientRow
        key={ingredientId}
        db={db}
        months={months}
        ingredient={ingredient}
      />
    );
    break;
  }

  return (
    <table>
      <thead>
        <tr>{headers1}</tr>
        <tr>{headers2}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
