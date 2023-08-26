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
  const [db, setDb] = useState((null as unknown) as Database);

  const getDbSingleton = async () => {
    setDb(await getDb());
  };

  // useEffect(async () => {
  //   // await setDb(getDb());
  //   let a = 1;
  // }, []);

  // useEffect(() => {
  //   const awaitGetDb = async () => {
  //     if (dbStatus === "empty") {
  //       setDb(await getDb());
  //       SetDbStatus("Pending");
  //       console.log("setting the DB object");
  //     }
  //     console.log("App init effect");
  //   };
  //   awaitGetDb();
  // }, [db, dbStatus]);

  const fetchMonths = async () => {
    setLoading(true);

    const dbRef = ref(db);
    // Fetch the months and ingredients from the db
    const dbMonths: Months = (await get(child(dbRef, `months`))).val();
    const dbIngredients: Ingredients = (
      await get(child(dbRef, `ingredients`))
    ).val();

    // const res = _.cloneDeep(dbMonths)
    // setMonths({...dbMonths})

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

  // useEffect(() => {
  //   const fetchMonths = async () => {
  //     setLoading(true);

  //     const dbRef = ref(db);
  //     // Fetch the months from the db
  //     const dbMonths: Months = (await get(child(dbRef, `months`))).val();

  //     // const res = _.cloneDeep(dbMonths)
  //     // setMonths({...dbMonths})

  //     setMonths(dbMonths);
  //     setLoading(false);
  //     console.log(months);
  //   };
  //   const awaitFetchMonths = async () => {
  //     if (db) {
  //       await fetchMonths();
  //     }
  //   };
  //   awaitFetchMonths();
  // }, [db]);

  // useEffect(() => {
  //   fetchMonths()
  // }, [])

  // return (
  //   // <div className="App">
  //   //   <header className="App-header">
  //   //     <img src={logo} className="App-logo" alt="logo" />
  //   //     <p>
  //   //       Edit <code>src/App.tsx</code> and save to reload.
  //   //     </p>
  //   //     <a
  //   //       className="App-link"
  //   //       href="https://reactjs.org"
  //   //       target="_blank"
  //   //       rel="noopener noreferrer"
  //   //     >
  //   //       Learn React
  //   //     </a>
  //   //   </header>
  //   // </div>
  //   <FilterableIngredientTable months={months} />
  // );
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
