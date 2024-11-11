import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeApp } from 'firebase/app';

import { getApp } from 'firebase/app';
import { connectFunctionsEmulator } from 'firebase/functions';
import { getFileLink } from '../storage';

import { RtdbCred } from '../rtdb';

import { FIREBASE_CONFIG } from '../firebase-config';

const DRIVE_API_KEY = 'AIzaSyA1kUO5D0N0KAyNP4QVruujJocM7YM6IQc';

// Discovery doc URL for APIs used by the quickstart
const DRIVE_DISCOVERY_DOC =
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const DOCS_DISCOVERY_DOC =
  'https://docs.googleapis.com/$discovery/rest?version=v1';

const firebaseApp = initializeApp(FIREBASE_CONFIG);
const firebaseFunctions = getFunctions(firebaseApp, 'europe-west1');
// connectFunctionsEmulator(firebaseFunctions, '127.0.0.1', 5001);
const getRefreshedAccessToken = httpsCallable<
  unknown,
  {
    access_token: string;
  }
>(firebaseFunctions, 'getRefreshedAccessToken');

const saveDriveThumbnail = httpsCallable<
  unknown,
  {
    message: string;
    filePath: string;
  }
>(firebaseFunctions, 'saveDriveThumbnail');

export let isRefreshingToken = false;
export let gapiAuthorized = false;

let gapiInited = false;

let gapi_access_token = { access_token: '' };

export function setupGapi() {
  console.group('setupGapi()');
  console.log('Setting up gapi');
  if (window.gapi) {
    console.log('gapi is loaded in window (checked with window.gapi)');
    console.log('running gapi.load');
    gapi.load('client:auth2', () => {
      console.group('gapi.load callback');
      console.log('running gapi.client.init');
      gapi.client
        .init({
          apiKey: DRIVE_API_KEY,
          discoveryDocs: [DRIVE_DISCOVERY_DOC, DOCS_DISCOVERY_DOC],
        })
        .then(() => {
          console.group('gapi.client.init promise success');
          console.log('setting gapiInited = true');
          gapiInited = true;
          // Check if access token is already set and set it to gapi client
          if (gapi_access_token.access_token !== '') {
            console.log(
              'We have a gapi_access_token.access_token -> setting it in client via gapi.client.setToken'
            );
            gapi.client.setToken(gapi_access_token);
          } else {
            console.log("We don't have yet a gapi_access_token.access_token");
          }
          console.groupEnd();
        });
      console.groupEnd();
    });
  } else {
    console.log('ERROR gapi not loaded');
  }
  console.groupEnd();
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

export async function storeAndFetchThumbnailLink(
  rtdbCred: RtdbCred,
  googleId: string
): Promise<string> {
  return apiCallWrapper(async () => {
    console.log(`Fetching ${googleId}`);
    const result = await saveDriveThumbnail({ fileId: googleId });
    const link = await getFileLink(rtdbCred, result.data.filePath);
    return link;
    // .then((result) => {
    //   console.log(result.data.message);
    //   console.log('Stored at:', result.data.filePath);
    // })
    // .catch((error) => {
    //   console.error('Error:', error);
    // });
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
