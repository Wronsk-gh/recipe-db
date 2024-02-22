import { useEffect } from 'react';
import { RtdbCred, fetchDisplay } from '../../rtdb';
// import { handleAuthClick, handlePageLoad } from '../../auth';

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
import { getFunctions, httpsCallable } from 'firebase/functions';

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

export function Auth({
  setRtdbCred,
}: {
  setRtdbCred: (rtdbCred: RtdbCred) => void;
}) {
  // An effect triggered at page load is needed to act after the redirect
  // Note: an empty dependency array means the useEffect hook will run once when the component mounts
  let firebaseDb: Database | null = null;
  let firebaseUser: User | null = null;

  const firebaseApp = initializeApp(FIREBASE_CONFIG);
  const firebaseAuth = getAuth(firebaseApp);
  const firebaseFunctions = getFunctions(firebaseApp);
  const getRefreshedAccessToken = httpsCallable<
    unknown,
    {
      access_token: string;
    }
  >(firebaseFunctions, 'getRefreshedAccessToken');

  async function handleUserChange(user: User | null) {
    console.log('this is the user : ');
    console.log(user);
    if (user) {
      // const uid = user.uid;
      // User is signed in
      // ...
      // const idToken = await user.getIdToken();

      firebaseDb = getDatabase(firebaseApp);

      const rtdbCred: RtdbCred = {
        user: user,
        db: firebaseDb,
        displayUserId: null,
      };
      if (firebaseDb !== null) {
        rtdbCred.displayUserId = await fetchDisplay(rtdbCred);
      }
      setRtdbCred(rtdbCred);

      const access_token = (await getRefreshedAccessToken()).data;
      console.log(access_token);
      gapi.client.setToken(access_token);
    } else {
      // User is signed out
      // ...
      // TODO sign-in again
    }
  }

  useEffect(() => {
    // Set the user observer
    onAuthStateChanged(firebaseAuth, handleUserChange);
    getRedirectResult(firebaseAuth);
    // const onHandlePageLoad = async () => {
    //   const [user, db] = await handlePageLoad();
    // };
    // onHandlePageLoad().catch((error) => {
    //   console.error(error);
    // });
  }, []);

  // async function handlePageLoad(): Promise<[User | null, Database | null]> {
  //   getRedirectResult(firebaseAuth);

  //   return [firebaseUser, firebaseDb];
  // }

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
    const access_token = await getRefreshedAccessToken();
    console.log('MYYYYYYYY access token !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log(access_token);
  }

  return (
    <>
      <button onClick={onButtonClick}>Auth</button>
      <button onClick={onTokenButtonClick}>get token</button>
    </>
  );
}
