import _ from 'lodash';

import { MonthBarOld } from './MonthBarOld';
import { MonthsDb, Ingredient } from '../db-types';
import { useGetMonthsDbQuery } from '../hooks/useGetMonthsDbQuery';

export function IngredientRow({
  ingredient,
  onEdit,
}: {
  ingredient: Ingredient;
  onEdit: (ingredientToEdit: Ingredient) => void;
}) {
  const cells = [];
  const { data: months } = useGetMonthsDbQuery();

  const nameCell = <td key="name">{ingredient.name}</td>;
  const monthsCell = (
    <td key="months">
      <MonthBarOld
        months={months}
        recipeMonthsId={ingredient.months.reduce<{
          [monthId: string]: boolean;
        }>((monthsIds, monthId) => {
          monthsIds[monthId] = true;
          return monthsIds;
        }, {})}
      />
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
