import { useEffect } from 'react';
import { RtdbCred, fetchDisplay } from '../rtdb';
import {
  gapiLoadOkay,
  gapiLoadFail,
  handleAuthClick,
  handlePageLoad,
} from '../auth';

export function Auth({
  setRtdbCred,
}: {
  setRtdbCred: (rtdbCred: RtdbCred) => void;
}) {
  // An effect triggered at page load is needed to act after the redirect
  useEffect(() => {
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.async = true;
    gapiScript.onload = (event) => {
      gapiLoadOkay();
    };
    gapiScript.onerror = (event) => {
      gapiLoadFail(event);
    };
    document.head.appendChild(gapiScript);

    const onHandlePageLoad = async () => {
      const [user, db] = await handlePageLoad();
      const rtdbCred: RtdbCred = { user: user, db: db, displayUserId: null };
      if (db !== null) {
        rtdbCred.displayUserId = await fetchDisplay(rtdbCred);
      }
      setRtdbCred(rtdbCred);
      console.log('user');
      console.log(user);
      console.log('db');
      console.log(db);
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

  async function onButtonClick() {
    await handleAuthClick();
  }

  return <button onClick={onButtonClick}>Auth</button>;
}
