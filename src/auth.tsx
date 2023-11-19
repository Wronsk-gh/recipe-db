import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import {
  GoogleAuthProvider,
  signInWithCredential,
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';

const DRIVE_CLIENT_ID =
  '387763281186-iidr7l3a8ocesogpdt3nvgfodphi631h.apps.googleusercontent.com';
const DRIVE_API_KEY = 'AIzaSyA1kUO5D0N0KAyNP4QVruujJocM7YM6IQc';

// Discovery doc URL for APIs used by the quickstart
const DRIVE_DISCOVERY_DOC =
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const DOCS_DISCOVERY_DOC =
  'https://docs.googleapis.com/$discovery/rest?version=v1';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const DOCS_SCOPES = 'https://www.googleapis.com/auth/documents.readonly';
const DRIVE_SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

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

export let gapiLoadOkay: () => void;
export let gapiLoadFail: (reason?: any) => void;
// export let gisLoadOkay: () => void;
// export let gisLoadFail: (reason?: any) => void;

let firebaseDb: Database | null = null;

const gapiLoadPromise = new Promise<void>((resolve, reject) => {
  gapiLoadOkay = resolve;
  gapiLoadFail = reject;
});
// const gisLoadPromise = new Promise<void>((resolve, reject) => {
//   gisLoadOkay = resolve;
//   gisLoadFail = reject;
// });

export async function handlePageLoad() {
  // First, load and initialize the gapi.client
  await gapiLoadPromise;
  await new Promise((resolve, reject) => {
    // NOTE: the 'auth2' module is no longer loaded.
    gapi.load('client', { callback: resolve, onerror: reject });
  });
  await gapi.client.init({
    apiKey: DRIVE_API_KEY,
    discoveryDocs: [DRIVE_DISCOVERY_DOC, DOCS_DISCOVERY_DOC],
  });
  // .then(function () {
  //   // Load the Drive API discovery document.
  //   // gapi.load('client', initializeGapiClient);
  //   // OCA Nothing to do here ?
  // });

  const firebaseApp = initializeApp(FIREBASE_CONFIG);
  const firebaseAuth = getAuth(firebaseApp);

  // After returning from the redirect when your app initializes you can obtain the result
  const userCred = await getRedirectResult(firebaseAuth);
  console.log('this is the userCred from redirect result : ' + userCred);
  if (userCred !== null) {
    // This is the signed-in user
    const user = userCred.user;
    // This gives you a Google Access Token.
    const credential = GoogleAuthProvider.credentialFromResult(userCred);
    if (credential !== null) {
      const token = credential.accessToken;
      if (token !== undefined) {
        console.log('I received a token !');
        console.log(token);
        gapi.client.setToken({ access_token: token });
        firebaseDb = getDatabase(firebaseApp);
      }
    }
    // As this API can be used for sign-in, linking and reauthentication,
    // check the operationType to determine what triggered this redirect
    // operation.
    const operationType = userCred.operationType;
  }

  return firebaseDb;
}

/**
 *  Sign in the user upon button click.
 */
export async function handleAuthClick() {
  const firebaseApp = initializeApp(FIREBASE_CONFIG);
  const firebaseAuth = getAuth(firebaseApp);
  // const auth = getAuth();
  const provider = new GoogleAuthProvider();
  provider.addScope(DOCS_SCOPES);
  provider.addScope(DRIVE_SCOPES);
  signInWithRedirect(firebaseAuth, provider);
}
