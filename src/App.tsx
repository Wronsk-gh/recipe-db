import "./App.css";
import { useState, useEffect } from "react";
import { ref, child, get, Database } from "firebase/database";
// import _ from 'lodash';

import { getDb } from "./rtdb";
import { FilterableIngredientTable } from "./components/FilterableIngredientTable";
import { RefreshDbButton } from "./components/RefreshDbButton";
import { ConnectDbButton } from "./components/ConnectDbButton";
import { CallbackButton } from "./components/CallbackButton";
import { Months } from "./db-types";
import { Ingredients } from "./db-types";
import { DATA_MOCKUP } from "./db-mockup";

function App() {
  const [loading, setLoading] = useState(false);
  const [months, setMonths] = useState({});
  const [ingredients, setIngredients] = useState({});
  const [db, setDb] = useState(null as unknown as Database);

  const getDbSingleton = async () => {
    setDb(await getDb());
  };

  const fetchMonths = async () => {
    setLoading(true);

    const dbRef = ref(db);
    // Fetch the months and ingredients from the db
    const dbMonths: Months = (await get(child(dbRef, `months`))).val();
    const dbIngredients: Ingredients = (
      await get(child(dbRef, `ingredients`))
    ).val();

    setMonths(dbMonths);
    setIngredients(dbIngredients);
    setLoading(false);
    console.log(dbMonths);
    console.log(months);
  };
  const awaitFetchMonths = async () => {
    if (db) {
      await fetchMonths();
    }
  };

  const printStatus = () => {
    console.log(db);
  };

  return (
    <div>
      <RefreshDbButton />
      <ConnectDbButton onButtonClick={getDbSingleton} />
      <CallbackButton label={"Get Months"} onButtonClick={awaitFetchMonths} />
      <CallbackButton label={"Print Status"} onButtonClick={printStatus} />
      <div>
        <br />
      </div>
      <FilterableIngredientTable months={months} ingredients={ingredients} />
    </div>
  );
}

export default App;
