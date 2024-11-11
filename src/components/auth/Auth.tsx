import { useEffect } from 'react';
import { RtdbCred, fetchDisplay } from '../../rtdb';

import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { refreshGapiAccessToken } from '../../models/gapiUtils';

import { FIREBASE_CONFIG } from '../../firebase-config';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const DOCS_SCOPES = 'https://www.googleapis.com/auth/documents.readonly';
const DRIVE_SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

export function Auth({
  setRtdbCred,
}: {
  setRtdbCred: (rtdbCred: RtdbCred) => void;
}) {
  // An effect triggered at page load is needed to act after the redirect
  // Note: an empty dependency array means the useEffect hook will run once when the component mounts
  let firebaseDb: Database | null = null;
  let firebaseStorage: FirebaseStorage | null = null;

  const firebaseApp = initializeApp(FIREBASE_CONFIG);
  const firebaseAuth = getAuth(firebaseApp);

  async function handleUserChange(user: User | null) {
    console.log('this is the user : ');
    console.log(user);
    if (user) {
      // const uid = user.uid;
      // User is signed in
      // ...
      // const idToken = await user.getIdToken();

      firebaseDb = getDatabase(firebaseApp);
      firebaseStorage = getStorage(firebaseApp);

      const rtdbCred: RtdbCred = {
        user: user,
        db: firebaseDb,
        storage: firebaseStorage,
        displayUserId: null,
      };
      if (firebaseDb !== null) {
        rtdbCred.displayUserId = await fetchDisplay(rtdbCred);
      }

      // Set the initial gapi client token
      await refreshGapiAccessToken();

      setRtdbCred(rtdbCred);
    } else {
      // User is signed out
      // ...
      // TODO sign-in again
      const rtdbCred: RtdbCred = {
        user: null,
        db: null,
        storage: null,
        displayUserId: null,
      };
      setRtdbCred(rtdbCred);
    }
  }

  useEffect(() => {
    // Set the user observer
    onAuthStateChanged(firebaseAuth, handleUserChange);
    // Get the redirect result
    getRedirectResult(firebaseAuth);
  }, []);

  /** Sign in the user upon button click.*/
  function handleAuthClick() {
    // const auth = getAuth();
    const provider = new GoogleAuthProvider();
    //    Google
    //
    //    When a user signs in with Google, the following credentials will be passed:
    //
    //        ID token
    //        Access token
    //        Refresh token: Only provided if the following custom parameters are requested:
    //            access_type=offline
    //            prompt=consent , if the user previously consented and no new scope was requested
    provider.setCustomParameters({
      access_type: 'offline',
      prompt: 'consent',
    });
    provider.addScope(DOCS_SCOPES);
    provider.addScope(DRIVE_SCOPES);
    signInWithRedirect(firebaseAuth, provider);
  }

  async function onButtonClick() {
    handleAuthClick();
  }

  async function onTokenButtonClick() {
    await refreshGapiAccessToken();
  }

  return (
    <>
      <button onClick={onButtonClick}>Auth</button>
      <button onClick={onTokenButtonClick}>get token</button>
    </>
  );
}
