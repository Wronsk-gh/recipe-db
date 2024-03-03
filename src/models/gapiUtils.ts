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
const firebaseFunctions = getFunctions(firebaseApp);
const getRefreshedAccessToken = httpsCallable<
  unknown,
  {
    access_token: string;
  }
>(firebaseFunctions, 'getRefreshedAccessToken');

export let isRefreshingToken = false;

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
  return apiCallWrapper(async () => {
    const response = await gapi.client.drive.files.get({
      fileId: googleId,
      fields: 'id, name, thumbnailLink',
    });

    if (response.result.thumbnailLink !== undefined) {
      const thumbnailResult = await fetch(response.result.thumbnailLink);
      const blob = await thumbnailResult.blob();
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl;
    } else {
      return '';
    }
  });
}

async function apiCallWrapper(apiCall: () => Promise<any>): Promise<any> {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error?.status === 404) {
      if (!isRefreshingToken) {
        isRefreshingToken = true;
        const refreshedAccessToken = await getRefreshedAccessToken();
        gapi.client.setToken(refreshedAccessToken.data);
        isRefreshingToken = false;
        return await apiCall();
      }
    }
    throw error;
  }
}
