/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import {
  beforeUserCreated,
  beforeUserSignedIn,
} from 'firebase-functions/v2/identity';
import { debug } from 'firebase-functions/logger';
import { onCall } from 'firebase-functions/v2/https';

// import admin module
import * as admin from 'firebase-admin';

// Fetch the service account key JSON file contents (path starts from 'node_modules' dir)
const serviceAccount = require('../serviceAccountKey.json');

const appKeys = require('../client_secret.json');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // The database URL depends on the location of the database
  databaseURL:
    'https://oca-drive-manage-default-rtdb.europe-west1.firebasedatabase.app',
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.database();

const client_id = appKeys.client_id;
const client_secret = appKeys.client_secret;
const grant_type = 'refresh_token';

export const beforecreated = beforeUserCreated((event) => {
  debug('beforecreated');
  const user = event.data;
  // Store the refresh token for later offline use.
  // These will only be returned if refresh tokens credentials are included
  // (enabled by Cloud console).
  return saveUserRefreshToken(user.uid, event.credential?.refreshToken ?? '');
});

export const beforesignedin = beforeUserSignedIn((event) => {
  // // TODO
  debug('beforesignedin');
  const user = event.data;
  return saveUserRefreshToken(user.uid, event.credential?.refreshToken ?? '');
});

async function saveUserRefreshToken(userUid: string, refreshToken: string) {
  const ref = db.ref('restricted_access/secret_document');
  await ref.set({ refreshToken: refreshToken });
}

async function getUserRefreshToken(userUid: string) {
  const ref = db.ref('restricted_access/secret_document');
  return (await ref.get()).val().refreshToken;
}

export const getRefreshedAccessToken = onCall(
  // TODO manage cors for added security -> should be with firebaseapp domain for prod, and local host for development
  // { cors: false },
  async (request) => {
    const refresh_token = await getUserRefreshToken(request.auth?.uid ?? '');
    const body = `client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}&grant_type=${grant_type}`;
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: body,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
    });
    const data = await response.json();
    return data;
  }
);
