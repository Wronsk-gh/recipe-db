import { User } from 'firebase/auth';
import { Database, ref, child, set, get, push } from 'firebase/database';

import { Months, Ingredients, Recipes, Ingredient, Recipe } from './db-types';

export interface RtdbCred {
  user: User | null;
  db: Database | null;
}

// export async function getDb(): Promise<Database> {
//   // Your web app's Firebase configuration
//   const firebaseConfig = {
//     apiKey: 'AIzaSyA1kUO5D0N0KAyNP4QVruujJocM7YM6IQc',
//     authDomain: 'oca-drive-manage.firebaseapp.com',
//     databaseURL:
//       'https://oca-drive-manage-default-rtdb.europe-west1.firebasedatabase.app',
//     projectId: 'oca-drive-manage',
//     storageBucket: 'oca-drive-manage.appspot.com',
//     messagingSenderId: '387763281186',
//     appId: '1:387763281186:web:73ee9da15e8db71629997b',
//   };
//   const app = initializeApp(firebaseConfig);
//   const auth = getAuth(app);
//   const provider = new GoogleAuthProvider();

//   signInWithPopup(auth, provider)
//     .then((result) => {
//       GoogleAuthProvider.credentialFromResult(result);
//     })
//     .catch((error) => {
//       // Handle Errors here.
//       var errorCode = error.code;
//       console.log(errorCode);
//       alert(errorCode);

//       var errorMessage = error.message;
//       console.log(errorMessage);
//       alert(errorMessage);
//     });

//   return getDatabase(app);
// }

export async function updateRecipeDb(rtdbCred: RtdbCred, newRecipe: Recipe) {
  if (rtdbCred.db === null || rtdbCred.user === null) {
    throw new Error('No database connection available');
  }
  const recipeRef = ref(
    rtdbCred.db,
    `users/${rtdbCred.user.uid}/recipes/${newRecipe.recipeId}`
  );
  const {
    recipeId: removedRecipeId,
    thumbnailLink: removedThumbnailLink,
    ...newDbRecipe
  } = newRecipe;
  await set(recipeRef, newDbRecipe);
}

export async function updateIngredientDb(
  rtdbCred: RtdbCred,
  newIngredient: Ingredient
) {
  if (rtdbCred.db === null || rtdbCred.user === null) {
    throw new Error('No database connection available');
  }

  const ingredientRef = ref(
    rtdbCred.db,
    `users/${rtdbCred.user.uid}/ingredients/${newIngredient.ingredientId}`
  );
  const { ingredientId: removed, ...newDbIngredient } = newIngredient;
  await set(ingredientRef, newDbIngredient);
}

// export async function updateIngredientNameDb(
//   rtdbCred.db: Database | undefined,
//   ingredientId: string,
//   newName: string
// ) {
//   if (rtdbCred.db === undefined) {
//     throw new Error('No database connection available');
//   }
//   // TODO while updating, need to flag it such that the ingredient is not marked as desynced
//   // TODO also, the checkboxes should not be updated while it is updating
//   const ingredientNameRef = ref(rtdbCred.db, 'ingredients/' + ingredientId + '/name');

//   await set(ingredientNameRef, newName);
// }

export async function createIngredientDb(rtdbCred: RtdbCred) {
  if (rtdbCred.db === null || rtdbCred.user === null) {
    throw new Error('No database connection available');
  }
  const defaultIngredientDb = {
    name: 'Nouvel Ingrédient',
  };
  await push(
    child(ref(rtdbCred.db), `users/${rtdbCred.user.uid}/ingredients`),
    defaultIngredientDb
  );
}

async function fetchFromUserDb<DataType>(
  rtdbCred: RtdbCred,
  dataName: string
): Promise<DataType> {
  if (rtdbCred.db === null || rtdbCred.user === null) {
    throw new Error('No database connection available');
  }
  const dbRef = ref(rtdbCred.db, `users/${rtdbCred.user.uid}`);
  const dbData: DataType = (await get(child(dbRef, dataName))).val();
  return dbData;
}

async function fetchFromRootDb<DataType>(
  rtdbCred: RtdbCred,
  dataName: string
): Promise<DataType> {
  if (rtdbCred.db === null || rtdbCred.user === null) {
    throw new Error('No database connection available');
  }
  const dbRef = ref(rtdbCred.db);
  const dbData: DataType = (await get(child(dbRef, dataName))).val();
  return dbData;
}

export async function fetchMonths(rtdbCred: RtdbCred) {
  return await fetchFromRootDb<Months>(rtdbCred, 'months');
}

export async function fetchIngredients(rtdbCred: RtdbCred) {
  return await fetchFromUserDb<Ingredients>(rtdbCred, 'ingredients');
}

export async function fetchRecipes(rtdbCred: RtdbCred) {
  return await fetchFromUserDb<Recipes>(rtdbCred, 'recipes');
}
