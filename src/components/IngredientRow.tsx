import { Months, Ingredient } from "../db-types";
import { useForm } from "react-hook-form";

// export function FilterableIngredientTable({ months, loading }: { months: Months, loading: boolean }) {
export function IngredientRow({
  months,
  ingredient
}: {
  months: Months;
  ingredient: Ingredient;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const cells = [];

  cells.push(
    <td key={"header" + ingredient.ingredientId}>{ingredient.name}</td>
  );

  if (!("months" in ingredient)) {
    console.log(ingredient);
  }

  for (const monthId in months) {
    // if (ingredient.months[monthId] === true) {
    //   cells.push(<td>X</td>)
    // }
    // else {
    //   cells.push(<td>-</td>)
    // }

    const handleChange = () => {};

    // if (!("months" in ingredient) || !(monthId in ingredient.months)) {
    //   console.log(ingredient);
    // }

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
