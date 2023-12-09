import _ from 'lodash';

import { Months, Ingredient } from '../db-types';

export function IngredientRow({
  months,
  ingredient,
  onEdit,
}: {
  months: Months;
  ingredient: Ingredient;
  onEdit: (ingredientToEdit: Ingredient) => void;
}) {
  const cells = [];

  const nameCell = <td key="name">{ingredient.name}</td>;
  const monthsCell =
    ingredient.months !== undefined ? (
      <td key="months">
        {Object.keys(ingredient.months).map((monthId) => {
          return <li key={monthId}>{months[monthId].name}</li>;
        })}
      </td>
    ) : (
      <td key="months"></td>
    );

  cells.push(nameCell);
  cells.push(monthsCell);
  cells.push(
    <td key="editButton">
      <button
        onClick={() => {
          onEdit(ingredient);
        }}
      >
        Edit
      </button>
    </td>
  );

  return <tr>{cells}</tr>;
}
