import { Months, Ingredients } from "../db-types";
import { SearchBar } from "./SearchBar";
import { IngredientTable } from "./IngredientTable";

export function FilterableIngredientTable({
  months,
  ingredients
}: {
  months: Months | undefined;
  ingredients: Ingredients | undefined;
}) {
  return (
    <div>
      <SearchBar />
      <IngredientTable months={months} ingredients={ingredients} />
    </div>
  );
}
