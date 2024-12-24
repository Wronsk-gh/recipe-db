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

import { FIREBASE_CONFIG } from '../firebase-config';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const DOCS_SCOPES = 'https://www.googleapis.com/auth/documents.readonly';
const DRIVE_SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

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
