import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeApp } from 'firebase/app';

const DRIVE_API_KEY = 'AIzaSyA1kUO5D0N0KAyNP4QVruujJocM7YM6IQc';

// Discovery doc URL for APIs used by the quickstart
const DRIVE_DISCOVERY_DOC =
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const DOCS_DISCOVERY_DOC =
  'https://docs.googleapis.com/$discovery/rest?version=v1';

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
const firebaseApp = initializeApp(FIREBASE_CONFIG);

export function setupGapiAndRenderApp(renderApp: () => void) {
  function loadGapiAndRenderApp(renderApp: () => void) {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: DRIVE_API_KEY,
          discoveryDocs: [DRIVE_DISCOVERY_DOC, DOCS_DISCOVERY_DOC],
        })
        .then(() => {
          renderApp();
        });
    });
  }

  // Check if gapi is not loaded then load script

  if (!window.gapi) {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.onload = () => loadGapiAndRenderApp(renderApp);
    document.head.appendChild(script);
  } else {
    loadGapiAndRenderApp(renderApp);
  }
}

export async function fetchThumbnail(googleId: string): Promise<string> {
  let response;
  try {
    response = await gapi.client.drive.files.get({
      fileId: googleId,
      fields: 'id, name, thumbnailLink',
    });
  } catch (error) {
    const firebaseFunctions = getFunctions(firebaseApp);
    const getRefreshedAccessToken = httpsCallable<
      unknown,
      {
        access_token: string;
      }
    >(firebaseFunctions, 'getRefreshedAccessToken');
    // const access_token = (await getRefreshedAccessToken()).data;
    // console.log(access_token);
    // gapi.client.setToken(access_token);
    // console.error('Error fetching thumbnail: ', error);
    return '';
  }

  if (response.result.thumbnailLink !== undefined) {
    // const thumbnailResult = await fetch(
    //   response.result.thumbnailLink +
    //     '&access_token=' +
    //     gapi.client.getToken().access_token
    // );
    const thumbnailResult = await fetch(response.result.thumbnailLink);
    // const thumbnailResult = await fetch(response.result.thumbnailLink, {
    //   headers: {
    //     Authorization: `Bearer {gapi.client.getToken().access_token}`,
    //   },
    // });
    const blob = await thumbnailResult.blob();
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  } else {
    return '';
  }
}
