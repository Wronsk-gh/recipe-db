import { Months, Ingredients, Ingredient } from "../db-types"
import { IngredientRow } from "./IngredientRow";


// export function IngredientTable({ months, loading }: { months: Months, loading: boolean }) {
export function IngredientTable({ months, ingredients }: { months: Months, ingredients: Ingredients }) {
  const rows = [];
  const headers1 = [];
  const headers2 = [];

  headers1.push(<th key={"header"}></th>)
  headers2.push(<th key={"header"}>Ingredients</th>)
  for (const monthId in months) {
    headers1.push(
      <th key={monthId}>{months[monthId].name}</th>
    );
    headers2.push(
      <th key={monthId}></th>
    );
  }

  for (const ingredientId in ingredients) {
    const ingredient: Ingredient = {
      ...ingredients[ingredientId],
      "ingredientId": ingredientId
    };
    rows.push(<IngredientRow key={ingredientId} months={months} ingredient={ingredient} />)
  }

  // products.forEach((product) => {
  //   if (product.category !== lastCategory) {
  //     rows.push(
  //       <ProductCategoryRow
  //         category={product.category}
  //         key={product.category} />
  //     );
  //   }
  //   rows.push(
  //     <ProductRow
  //       product={product}
  //       key={product.name} />
  //   );
  //   lastCategory = product.category;
  // });

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
