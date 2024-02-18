import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  User,
  onAuthStateChanged,
} from 'firebase/auth';

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

let firebaseDb: Database | null = null;
let firebaseUser: User | null = null;

const firebaseApp = initializeApp(FIREBASE_CONFIG);
const firebaseAuth = getAuth(firebaseApp);

export async function handlePageLoad(): Promise<
  [User | null, Database | null]
> {
  getRedirectResult(firebaseAuth);

  return [firebaseUser, firebaseDb];
}

/**
 *  Sign in the user upon button click.
 */
export async function handleAuthClick() {
  // const auth = getAuth();
  const provider = new GoogleAuthProvider();
  provider.addScope(DOCS_SCOPES);
  provider.addScope(DRIVE_SCOPES);
  signInWithRedirect(firebaseAuth, provider);
}
