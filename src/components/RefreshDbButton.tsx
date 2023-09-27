import { useEffect } from 'react';
import { Database } from 'firebase/database';
import { Recipes } from '../db-types';

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID =
  '387763281186-iidr7l3a8ocesogpdt3nvgfodphi631h.apps.googleusercontent.com';
const API_KEY = 'AIzaSyA1kUO5D0N0KAyNP4QVruujJocM7YM6IQc';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

let tokenClient: any;

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
}

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

/**
 * Print metadata for first 10 files.
 */
async function listFiles() {
  await getGapiGoogleIds();
}

function getDbGoogleIds(recipes: Recipes): { [id: string]: boolean } {
  const googleIdsList: { [id: string]: boolean } = {};
  for (const recipeId in recipes) {
    googleIdsList[recipes[recipeId].google_id] = true;
  }
  return googleIdsList;
}

async function getGapiGoogleIds(): Promise<{ [id: string]: boolean }> {
  let response;
  let page_token: string | undefined = '';
  const allFiles: gapi.client.drive.File[] = [];
  const googleIdsList: { [id: string]: boolean } = {};

  try {
    while (true) {
      // Send the request to gdrive api
      response = await gapi.client.drive.files.list({
        pageSize: 500,
        fields: 'nextPageToken,files(id, name)',
        q: "'1-fJ3w31oxP6P1zrHnZXkuCl-f6ACzACI' in parents and trashed=false",
        pageToken: page_token,
      });

      // Get the received files and append them to the list
      const files = response.result.files;
      if (files !== undefined && files.length > 0) {
        allFiles.push(...files);
      }
      // Prepare next request or break out if there are no more items
      page_token = response.result.nextPageToken;
      if (page_token === undefined) {
        break;
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    return {};
  }

  // Create the set of google ids present in the database
  allFiles.forEach((file) => {
    googleIdsList[file!.id!] = true;
  });

  return googleIdsList;
}

// Set operation 'A - B' (aka return elements that are present in A, but not is B)
function arrayDiff(A: string[], B: string[]): string[] {
  const filteredArray = A.filter((value) => !B.includes(value));
  return filteredArray;
}

async function manageAuthClickCallback(
  db: Database | undefined,
  recipes: Recipes | undefined
) {
  if (recipes !== undefined) {
    const dbGoogleIds = getDbGoogleIds(recipes);
    const driveGoogleIds = await getGapiGoogleIds();
  } else {
    // TODO
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(
  db: Database | undefined,
  recipes: Recipes | undefined
) {
  // Get a list of all the IDs in the All recipe folder

  tokenClient.callback = async (resp: any) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    await manageAuthClickCallback(db, recipes);
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '' as any, // defined later
  });
}

export function RefreshDbButton({
  db,
  recipes,
}: {
  db: Database | undefined;
  recipes: Recipes | undefined;
}) {
  useEffect(() => {
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.async = true;
    gapiScript.onload = gapiLoaded;
    document.head.appendChild(gapiScript);

    const gsiScript = document.createElement('script');
    gsiScript.src = 'https://accounts.google.com/gsi/client';
    gsiScript.async = true;
    gsiScript.onload = gisLoaded;
    document.head.appendChild(gsiScript);
  }, []);

  const onButtonClick = () => {
    handleAuthClick(db, recipes);
  };

  return <button onClick={onButtonClick}>Refresh DB</button>;
}
