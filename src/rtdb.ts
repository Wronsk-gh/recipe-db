import { User } from 'firebase/auth';
import { Database, ref, child, set, get, push } from 'firebase/database';

import { Months, Ingredients, Recipes, Ingredient, Recipe } from './db-types';

export interface RtdbCred {
  user: User | null;
  db: Database | null;
  displayUserId: string | null;
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

export async function createIngredientDisplayUserDb(rtdbCred: RtdbCred) {
  if (rtdbCred.db === null || rtdbCred.user === null) {
    throw new Error('No database connection available');
  }
  const uid =
    rtdbCred.displayUserId !== null
      ? rtdbCred.displayUserId
      : rtdbCred.user.uid;
  const defaultIngredientDb = {
    name: 'Nouvel Ingrédient',
  };
  await push(
    child(ref(rtdbCred.db), `users/${uid}/ingredients`),
    defaultIngredientDb
  );
}

export async function createRecipeDisplayUserDb(
  rtdbCred: RtdbCred,
  google_id: string,
  name: string
) {
  if (rtdbCred.db === null || rtdbCred.user === null) {
    throw new Error('No database connection available');
  }
  const uid =
    rtdbCred.displayUserId !== null
      ? rtdbCred.displayUserId
      : rtdbCred.user.uid;
  const newRecipeDb = {
    google_id: google_id,
    name: name,
  };
  await push(child(ref(rtdbCred.db), `users/${uid}/recipes`), newRecipeDb);
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

async function fetchFromDisplayUserDb<DataType>(
  rtdbCred: RtdbCred,
  dataName: string
): Promise<DataType> {
  if (rtdbCred.db === null || rtdbCred.user === null) {
    throw new Error('No database connection available');
  }
  const uid =
    rtdbCred.displayUserId !== null
      ? rtdbCred.displayUserId
      : rtdbCred.user.uid;
  const dbRef = ref(rtdbCred.db, `users/${uid}`);
  try {
    const dbData: DataType = (await get(child(dbRef, dataName))).val();
    return dbData;
  } catch (error) {
    console.log(error);
    return null as DataType;
  }
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
  return await fetchFromDisplayUserDb<Ingredients>(rtdbCred, 'ingredients');
}

export async function fetchRecipes(rtdbCred: RtdbCred) {
  return await fetchFromDisplayUserDb<Recipes>(rtdbCred, 'recipes');
}

export async function fetchDisplay(rtdbCred: RtdbCred) {
  // Note this will return null in case the key doesn't exist !
  return await fetchFromUserDb<string>(rtdbCred, 'display');
}
