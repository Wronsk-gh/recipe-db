import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, Database, ref, child, set, get } from "firebase/database";

import { Months, Ingredients, Ingredient } from "./db-types";

export async function getDb(): Promise<Database> {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA1kUO5D0N0KAyNP4QVruujJocM7YM6IQc",
    authDomain: "oca-drive-manage.firebaseapp.com",
    databaseURL:
      "https://oca-drive-manage-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "oca-drive-manage",
    storageBucket: "oca-drive-manage.appspot.com",
    messagingSenderId: "387763281186",
    appId: "1:387763281186:web:73ee9da15e8db71629997b"
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      GoogleAuthProvider.credentialFromResult(result);
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      console.log(errorCode);
      alert(errorCode);

      var errorMessage = error.message;
      console.log(errorMessage);
      alert(errorMessage);
    });

  return getDatabase(app);
}

  export async function updateIngredientDb(db: Database | undefined, newIngredient: Ingredient) {
    if (db === undefined) {
      throw new Error('No database connection available')
    }
    // TODO while updating, need to flag it such that the ingredient is not marked as desynced
    // TODO also, the checkboxes should not be updated while it is updating
    const ingredientRef = ref(db, 'ingredients/' + newIngredient.ingredientId);
    const {ingredientId: removed, ...newDbIngredient} = newIngredient;
    await set(ingredientRef, newDbIngredient);
  }

async function fetchFromDb<DataType>(db: Database | undefined, dataName: string): Promise<DataType> {
    if (!db) {
      throw new Error('No database connection available')
    }
    const dbRef = ref(db);
    const dbData: DataType = (await get(child(dbRef, dataName))).val();
    return dbData;
}
  
export async function fetchMonths(db: Database | undefined) {
    return await fetchFromDb<Months>(db, "months");
}

export async function fetchIngredients(db: Database | undefined) {
    return await fetchFromDb<Ingredients>(db, "ingredients");
}