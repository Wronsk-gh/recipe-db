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
const firebaseFunctions = getFunctions(firebaseApp, 'europe-west1');
const getRefreshedAccessToken = httpsCallable<
  unknown,
  {
    access_token: string;
  }
>(firebaseFunctions, 'getRefreshedAccessToken');

export let isRefreshingToken = false;
export let gapiAuthorized = false;

let gapiInited = false;

let gapi_access_token = { access_token: '' };

export function setupGapi() {
  console.log('Setting up gapi');
  if (window.gapi) {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: DRIVE_API_KEY,
          discoveryDocs: [DRIVE_DISCOVERY_DOC, DOCS_DISCOVERY_DOC],
        })
        .then(() => {
          gapiInited = true;
          // Check if access token is already set and set it to gapi client
          if (gapi_access_token.access_token !== '') {
            gapi.client.setToken(gapi_access_token);
          }
        });
    });
  } else {
    console.log('ERROR gapi not loaded');
  }
}

// Attach setupGapi to the window object
(window as any).setupGapi = setupGapi;
(window as any)['setupGapi'] = setupGapi;

// (require as any).ensure([], () => {
//   window['require'] = (module) => require(module);
// });

export async function refreshGapiAccessToken() {
  console.log('Refreshing gapi access token');
  const access_token = (await getRefreshedAccessToken()).data;
  console.log(access_token);
  // Check if gapi is initialized and set the token
  if (gapiInited === true) {
    console.log('Setting gapi token');
    gapi.client.setToken(access_token);
    gapiAuthorized = true;
  } else {
    console.log('Gapi is not initialized, setting token for later');
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

export async function fetchThumbnailLink(googleId: string): Promise<string> {
  return apiCallWrapper(async () => {
    const response = await gapi.client.drive.files.get({
      fileId: googleId,
      fields: 'id, name, thumbnailLink',
    });

    if (response.result.thumbnailLink !== undefined) {
      return response.result.thumbnailLink;
    } else {
      return '';
    }
  });
}

async function apiCallWrapper(apiCall: () => Promise<any>): Promise<any> {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error?.status === 404 || error?.status === 401) {
      if (!isRefreshingToken) {
        isRefreshingToken = true;
        await refreshGapiAccessToken();
        isRefreshingToken = false;
        return await apiCall();
      }
    }
    throw error;
  }
}
