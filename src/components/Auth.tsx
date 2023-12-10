import { useEffect } from 'react';
import { RtdbCred } from '../rtdb';
import {
  gapiLoadOkay,
  gapiLoadFail,
  handleAuthClick,
  handlePageLoad,
} from '../auth';

export function Auth({ setRtdbCred }: { setRtdbCred: (db: RtdbCred) => void }) {
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
      // const rtdbCred = { user: user, db: db };
      setRtdbCred({ user: user, db: db });
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
