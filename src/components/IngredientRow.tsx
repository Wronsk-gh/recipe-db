import _ from 'lodash';

import { MonthBar } from './MonthBar';
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
  const monthsCell = (
    <td key="months">
      <MonthBar months={months} recipeMonthsId={ingredient.months ?? {}} />
    </td>
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
