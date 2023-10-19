import { useEffect } from 'react';
import { Database } from 'firebase/database';
import {
  gapiLoadOkay,
  gapiLoadFail,
  gisLoadOkay,
  gisLoadFail,
  handleAuthClick,
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

    const gsiScript = document.createElement('script');
    gsiScript.src = 'https://accounts.google.com/gsi/client';
    gsiScript.async = true;
    gsiScript.onload = (event) => {
      gisLoadOkay();
    };
    gsiScript.onerror = (event) => {
      gisLoadFail(event);
    };
    document.head.appendChild(gsiScript);
  }, []);

  async function onButtonClick() {
    setDb(await handleAuthClick());
  }

  return <button onClick={onButtonClick}>Auth</button>;
}
