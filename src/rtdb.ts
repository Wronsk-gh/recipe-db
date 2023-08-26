import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

//let db: Database;

export async function getDb(): Promise<Database> {
  let db: Database;
  //if (!db) {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA1kUO5D0N0KAyNP4QVruujJocM7YM6IQc",
    authDomain: "oca-drive-manage.firebaseapp.com",
    databaseURL:
      "https://oca-drive-manage-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "oca-drive-manage",
    storageBucket: "oca-drive-manage.appspot.com",
    messagingSenderId: "387763281186",
    appId: "1:387763281186:web:73ee9da15e8db71629997b"
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // signInWithPopup(auth, provider)
  // .then((result: UserCredential) => {
  //   // This gives you a Google Access Token. You can use it to access the Google API.
  //   const credential = GoogleAuthProvider.credentialFromResult(result);
  //   const token = credential!.accessToken;
  //   // The signed-in user info.
  //   const user = result.user;
  //   // IdP data available using getAdditionalUserInfo(result)
  //   // ...
  // }).catch((error) => {
  //   // Handle Errors here.
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // The email of the user's account used.
  //   const email = error.customData.email;
  //   // The AuthCredential type that was used.
  //   const credential = GoogleAuthProvider.credentialFromError(error);
  //   // ...
  // });

  // const credentials = GoogleAuthProvider.credentialFromResult(await signInWithPopup(auth, provider));
  // GoogleAuthProvider.credentialFromResult(
  //   await signInWithPopup(auth, provider)
  // );

  signInWithPopup(auth, provider)
    .then((result) => {
      GoogleAuthProvider.credentialFromResult(result);
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      console.log(errorCode);
      alert(errorCode);

      var errorMessage = error.message;
      console.log(errorMessage);
      alert(errorMessage);
    });

  db = getDatabase(app);
  // }

  return db;
}
