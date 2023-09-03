import { Database } from "firebase/database";
import { Months, Ingredients } from "../db-types";
import { SearchBar } from "./SearchBar";
import { IngredientTable } from "./IngredientTable";

export function FilterableIngredientTable({
  db,
  months,
  ingredients
}: {
  db: Database | undefined;
  months: Months | undefined;
  ingredients: Ingredients | undefined;
}) {
  return (
    <div>
      <SearchBar />
      <IngredientTable db={db} months={months} ingredients={ingredients} />
    </div>
  );
}
