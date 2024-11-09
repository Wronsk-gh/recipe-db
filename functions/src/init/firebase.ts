// import admin module
import * as admin from 'firebase-admin';

// Fetch the service account key JSON file contents (path starts from 'node_modules' dir)
const serviceAccount = require('../../keys/serviceAccountKey.json');
const appKeys = require('../../keys/client_secret.json');

// const { authenticate } = require('@google-cloud/local-auth');

export const app_client_id = appKeys.web.client_id;
export const app_client_secret = appKeys.web.client_secret;
export const app_redirect_uris = appKeys.web.redirect_uris;
export const app_token_uri = appKeys.web.token_uri;
export const grant_type = 'refresh_token';

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // The database URL depends on the location of the database
  databaseURL:
    'https://oca-drive-manage-default-rtdb.europe-west1.firebasedatabase.app',
});

export { admin };

// As an admin, the app has access to read and write all data, regardless of Security Rules
export const db = admin.database();
