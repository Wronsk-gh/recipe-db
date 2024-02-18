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

import axios from 'axios';

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

  async function handleUserChange(user: User | null) {
    console.log('this is the user : ');
    console.log(user);
    if (user) {
      // const uid = user.uid;
      // User is signed in
      // ...
      const idToken = await user.getIdToken();

      const auth2 = gapi.auth2.getAuthInstance();

      // if (!auth2.isSignedIn.get()) {
      //   // The user is not signed in with gapi, so sign them in
      //   const id_token = auth.currentUser.getIdToken(/* forceRefresh */ true).then(idToken => {
      //     const googleUser = new gapi.auth2.GoogleAuth();
      //     googleUser.getAuthResponse().id_token = idToken;
      //     auth2.signIn(googleUser);
      //   });
      // }

      if (!auth2.isSignedIn.get()) {
        // The user is not signed in, so try to sign them in
        auth2.signIn();
      }

      // getting refresh token
      // final url = Uri.parse('https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=$apiKey');

      // final response = await http.post(
      //   url,
      //   headers: {'Content-type': 'application/json'},
      //   body: jsonEncode({
      //     'postBody': 'id_token=$token&providerId=$provider',
      //     'requestUri': 'http://localhost',
      //     'returnIdpCredential': true,
      //     'returnSecureToken': true
      //   })
      // );
      // if (response.statusCode != 200) {
      //   throw 'Refresh token request failed: ${response.statusCode}';
      // }

      // final data = Map<String, dynamic>.of(jsonDecode(response.body));
      // if (data.containsKey('refreshToken')) {
      //    // here is your refresh token, store it in a secure way
      // } else {
      //   throw 'No refresh token in response';
      // }

      // // // // let accessTokenRequest = await axios.request({
      // // // //   method: 'post',
      // // // //   url:
      // // // //     'https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=' +
      // // // //     FIREBASE_CONFIG.apiKey,
      // // // //   headers: { 'content-type': 'application/json' },
      // // // //   params: {
      // // // //     postBody: 'id_token=' + idToken + '&providerId=google.com',
      // // // //     requestUri: 'http://localhost',
      // // // //     returnIdpCredential: true,
      // // // //     returnSecureToken: true,
      // // // //   },
      // // // // });

      // // // // let refreshToken = accessTokenRequest.data['refreshToken'];

      // // // // console.log('refresh token !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      // // // // console.log(refreshToken);

      // // // // // Exchanging refresh token for access code

      // // // // let tokenRequest = await axios.request({
      // // // //   method: 'post',
      // // // //   url: 'https://oauth2.googleapis.com/token',
      // // // //   headers: { 'content-type': 'application/x-www-form-urlencoded' },
      // // // //   params: {
      // // // //     client_id:
      // // // //       '387763281186-iidr7l3a8ocesogpdt3nvgfodphi631h.apps.googleusercontent.com',
      // // // //     client_secret: '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',
      // // // //     refresh_token: user.refreshToken,
      // // // //     grant_type: 'refresh_token',
      // // // //   },
      // // // // });

      // // // // let accessToken = tokenRequest.data['access_token'];
      // // // // console.log('access token !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      // // // // console.log(accessToken);

      // // // // gapi.client.setToken({ access_token: accessToken });
      // gapi.client.setToken({ access_token: idToken });
      firebaseDb = getDatabase(firebaseApp);

      // // This gives you a Google Access Token.
      // const credential = GoogleAuthProvider.credential(idToken);
      // if (credential !== null) {
      //   const token = credential.accessToken;
      //   if (token !== undefined) {
      //     console.log('I received a token !');
      //     console.log(token);
      //     gapi.client.setToken({ access_token: token });
      //     firebaseDb = getDatabase(firebaseApp);
      //     console.log(firebaseDb);
      //   }
      // }

      const rtdbCred: RtdbCred = {
        user: user,
        db: firebaseDb,
        displayUserId: null,
      };
      if (firebaseDb !== null) {
        rtdbCred.displayUserId = await fetchDisplay(rtdbCred);
      }
      setRtdbCred(rtdbCred);
    } else {
      // User is signed out
      // ...
      // TODO sign-in again
    }
  }

  useEffect(() => {
    // Set the user observer
    onAuthStateChanged(firebaseAuth, handleUserChange);

    const onHandlePageLoad = async () => {
      const [user, db] = await handlePageLoad();
      // const rtdbCred: RtdbCred = { user: user, db: db, displayUserId: null };
      // if (db !== null) {
      //   rtdbCred.displayUserId = await fetchDisplay(rtdbCred);
      // }
      // setRtdbCred(rtdbCred);
      // console.log('user');
      // console.log(user);
      // console.log('db');
      // console.log(db);

      // if (user === null) {
      //   await handleAuthClick();
      // }

      // const rtdbCred = { user: user, db: db };
      // if (db !== null) {
      //   rtdbCred.db = db;
      // }
      // if (user !== null) {
      //   setUser(user);
      //   console.log(user.uid);
      // }
    };
    onHandlePageLoad().catch((error) => {
      console.error(error);
    });
  }, []);

  async function handlePageLoad(): Promise<[User | null, Database | null]> {
    getRedirectResult(firebaseAuth);

    return [firebaseUser, firebaseDb];
  }

  /** Sign in the user upon button click.*/
  async function handleAuthClick() {
    // const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.addScope(DOCS_SCOPES);
    provider.addScope(DRIVE_SCOPES);
    signInWithRedirect(firebaseAuth, provider);
  }

  async function onButtonClick() {
    await handleAuthClick();
  }

  return <button onClick={onButtonClick}>Auth</button>;
}
