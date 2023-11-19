import { useEffect } from 'react';
import { Database } from 'firebase/database';
import {
  gapiLoadOkay,
  gapiLoadFail,
  handleAuthClick,
  handlePageLoad,
} from '../auth';

export function Auth({ setDb }: { setDb: (db: Database | undefined) => void }) {
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
      const db = await handlePageLoad();
      if (db !== null) {
        setDb(db);
      }
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
