import { getFunctions, httpsCallable } from 'firebase/functions';
import { FirebaseError, initializeApp } from 'firebase/app';

import { connectFunctionsEmulator } from 'firebase/functions';
import { getFileLink } from '../storage';

import { RtdbCred, updateRecipeDisplayUserDb } from '../rtdb';

import { FIREBASE_CONFIG } from '../firebase-config';
import { Recipe } from '../db-types';

const firebaseApp = initializeApp(FIREBASE_CONFIG);
const firebaseFunctions = getFunctions(firebaseApp, 'europe-west1');
// connectFunctionsEmulator(firebaseFunctions, '127.0.0.1', 5001);

const saveDriveThumbnail = httpsCallable<
  { fileId: string },
  {
    message: string;
    filePath: string;
  }
>(firebaseFunctions, 'saveDriveThumbnail');

export const getDriveFilesIds = httpsCallable<
  { folderId: string },
  {
    message: string;
    idsNamesDict: { [id: string]: string };
  }
>(firebaseFunctions, 'getDriveFilesIds');

export const testDriveAuth = httpsCallable<unknown, unknown>(
  firebaseFunctions,
  'testDriveAuth'
);

export async function storeAndFetchThumbnailLink(
  rtdbCred: RtdbCred,
  recipe: Recipe
): Promise<string> {
  // return apiCallWrapper(async () => {
  console.log(`Fetching ${recipe.google_id}`);
  // TODO when I call saveDriveThumbnail, and the refresh token is invalid, I must go in an "unauthorised" state for my app
  let result;
  // try {
  result = await saveDriveThumbnail({
    fileId: recipe.google_id,
  });
  // } catch (error) {
  //   if (error instanceof FirebaseError && error.message === 'invalid_grant') {
  //     return 'invalid_grant';
  //   } else {
  //     throw error;
  //   }
  // }
  const link = await getFileLink(rtdbCred, result.data.filePath);

  // Store the thumbnail info of the recipe in the db
  recipe.thumbnailInfo = { link: link, lastRefreshed: Date.now() };
  updateRecipeDisplayUserDb(rtdbCred, recipe);

  return link;
  // .then((result) => {
  //   console.log(result.data.message);
  //   console.log('Stored at:', result.data.filePath);
  // })
  // .catch((error) => {
  //   console.error('Error:', error);
  // });
  // });
}

// async function apiCallWrapper(apiCall: () => Promise<any>): Promise<any> {
//   try {
//     return await apiCall();
//   } catch (error: any) {
//     if (error?.status === 404 || error?.status === 401) {
//       if (!isRefreshingToken) {
//         isRefreshingToken = true;
//         await refreshGapiAccessToken();
//         isRefreshingToken = false;
//         return await apiCall();
//       }
//     }
//     throw error;
//   }
// }

// async function apiCallWrapper(apiCall: () => Promise<any>): Promise<any> {
//   try {
//     return await apiCall();
//   } catch (error: any) {
//     if (error?.status === 404 || error?.status === 401) {
//       if (!isRefreshingToken) {
//         isRefreshingToken = true;
//         await refreshGapiAccessToken();
//         isRefreshingToken = false;
//         return await apiCall();
//       }
//     }
//     throw error;
//   }
// }
