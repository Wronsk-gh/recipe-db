import { useState, useEffect } from "react";
import { ref, child, get, Database } from "firebase/database";
import { useQuery } from "@tanstack/react-query"

import { getDb } from "../rtdb";
import { Months, Ingredients } from "../db-types";

import { FilterableIngredientTable } from "./FilterableIngredientTable";
import { RefreshDbButton } from "./RefreshDbButton";
import { ConnectDbButton } from "./ConnectDbButton";
import { CallbackButton } from "./CallbackButton";

export function RecipeManager() {
  const [loading, setLoading] = useState(false);
  const [months, setMonths] = useState({});
  const [ingredients, setIngredients] = useState({});
  const [db, setDb] = useState<Database | undefined>(undefined);
  const { isLoading: isMonthsLoading, isError: isMonthsError, data: monthsData, error: monthsError }
  = useQuery({
    queryKey: ["months"],
    queryFn: fetchMonths,
    enabled: !!db,
  });
  const { isLoading: isIngredientsLoading, isError: isIngredientsError, data: ingredientsData, error: ingredientsError }
  = useQuery({
    queryKey: ["ingredients"],
    queryFn: fetchIngredients,
    enabled: !!db,
  });

  async function getDbSingleton() {
    setDb(await getDb());
  }

  async function fetchFromDb<DataType>(dataName: string) {
    if (!db) {
      throw new Error('No database connection available')
    }
    const dbRef = ref(db);
    const dbData: DataType = (await get(child(dbRef, dataName))).val();
    return dbData;
  }
  
  async function fetchMonths() {
    return await fetchFromDb<Months>("months");
  }

  async function fetchIngredients() {
    return await fetchFromDb<Ingredients>("ingredients");
  }

  // async function fetchMonthsFromButton() {
  //   if (db) {
  //     setLoading(true);

  //     const dbRef = ref(db);
  //     // Fetch the months and ingredients from the db
  //     const dbMonths: Months = (await get(child(dbRef, `months`))).val();
  //     const dbIngredients: Ingredients = (
  //       await get(child(dbRef, `ingredients`))
  //     ).val();

  //     setMonths(dbMonths);
  //     setIngredients(dbIngredients);
  //     setLoading(false);
  //   }
  // }

  return (
    <div>
    <RefreshDbButton />
    <ConnectDbButton onButtonClick={getDbSingleton} />
    <div>
        <br />
    </div>
    <FilterableIngredientTable db={db} months={monthsData} ingredients={ingredientsData} />
    </div>
  );
}
