import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import {
  GoogleAuthProvider,
  signInWithCredential,
  getAuth,
} from 'firebase/auth';

const DRIVE_CLIENT_ID =
  '387763281186-iidr7l3a8ocesogpdt3nvgfodphi631h.apps.googleusercontent.com';
const DRIVE_API_KEY = 'AIzaSyA1kUO5D0N0KAyNP4QVruujJocM7YM6IQc';

// Discovery doc URL for APIs used by the quickstart
const DRIVE_DISCOVERY_DOC =
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const DRIVE_SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyA1kUO5D0N0KAyNP4QVruujJocM7YM6IQc',
  authDomain: 'oca-drive-manage.firebaseapp.com',
  databaseURL:
    'https://oca-drive-manage-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'oca-drive-manage',
  storageBucket: 'oca-drive-manage.appspot.com',
  messagingSenderId: '387763281186',
  appId: '1:387763281186:web:73ee9da15e8db71629997b',
};

let googleTokenClient: any;

// export let gapiLoadOkay: (value: any) => void;
// export let gapiLoadFail: (reason?: any) => void;
// export let gisLoadOkay: (value: any) => void;
// export let gisLoadFail: (reason?: any) => void;
export let gapiLoadOkay: () => void;
export let gapiLoadFail: (reason?: any) => void;
export let gisLoadOkay: () => void;
export let gisLoadFail: (reason?: any) => void;

export let firebaseDb: Database | undefined = undefined;

const gapiLoadPromise = new Promise<void>((resolve, reject) => {
  gapiLoadOkay = resolve;
  gapiLoadFail = reject;
});
const gisLoadPromise = new Promise<void>((resolve, reject) => {
  gisLoadOkay = resolve;
  gisLoadFail = reject;
});

/**
 *  Sign in the user upon button click.
 */
export async function handleAuthClick() {
  // First, load and initialize the gapi.client
  await gapiLoadPromise;
  await new Promise((resolve, reject) => {
    // NOTE: the 'auth2' module is no longer loaded.
    gapi.load('client', { callback: resolve, onerror: reject });
  });
  await gapi.client.init({
    apiKey: DRIVE_API_KEY,
    discoveryDocs: [DRIVE_DISCOVERY_DOC],
  });
  // .then(function () {
  //   // Load the Drive API discovery document.
  //   // gapi.load('client', initializeGapiClient);
  //   // OCA Nothing to do here ?
  // });

  // Now load the GIS client
  await gisLoadPromise;
  await new Promise<void>((resolve, reject) => {
    try {
      googleTokenClient = google.accounts.oauth2.initTokenClient({
        client_id: DRIVE_CLIENT_ID,
        scope: DRIVE_SCOPES,
        callback: '' as any, // defined later
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });

  // The access token is missing, invalid, or expired, prompt for user consent to obtain one.
  const tokenResponse: any = await new Promise((resolve, reject) => {
    try {
      // Settle this promise in the response callback for requestAccessToken()
      googleTokenClient.callback = (resp: any) => {
        if (resp.error !== undefined) {
          reject(resp);
        }
        // GIS has automatically updated gapi.client with the newly issued access token.
        console.log(
          'gapi.client access token: ' + JSON.stringify(gapi.client.getToken())
        );
        resolve(resp);
      };
      if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        googleTokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        // Skip display of account chooser and consent dialog for an existing session.
        googleTokenClient.requestAccessToken({ prompt: '' });
      }
    } catch (err) {
      console.log(err);
    }
  });

  await handleFirebaseAuth(tokenResponse.access_token);
  return firebaseDb;
}

async function handleFirebaseAuth(googleAccessToken: any) {
  if (firebaseDb === undefined) {
    const firebaseApp = initializeApp(FIREBASE_CONFIG);
    const firebaseAuth = getAuth(firebaseApp);

    const firebaseCredential = GoogleAuthProvider.credential(
      null,
      googleAccessToken
    );
    const result = await signInWithCredential(firebaseAuth, firebaseCredential);
    // TODO check the result
    firebaseDb = getDatabase(firebaseApp);
    console.log(firebaseDb);
  } else {
    console.log('firebase db is already init');
  }
}
