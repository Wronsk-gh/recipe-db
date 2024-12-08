import { onCall } from 'firebase-functions/v2/https';
import {
  app_client_id,
  app_client_secret,
  app_redirect_uris,
  storage,
} from '../init/firebase';
import { getUserRefreshToken } from './auth';
import { google } from 'googleapis';
import * as functions from 'firebase-functions';
import { inspect } from 'util';
import { gaxios } from 'google-auth-library';

export const testDriveAuth = onCall(
  { region: 'europe-west1' },
  // TODO manage cors for added security -> should be with firebaseapp domain for prod, and local host for development
  // { cors: false },
  async (func_request) => {
    const uid = func_request.auth?.uid;

    if (!uid) {
      throw new Error('No user ID provided.');
    }

    const refresh_token = await getUserRefreshToken(uid);

    if (!refresh_token) {
      throw new Error('No refresh token found for user.');
    }

    // Set up OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      app_client_id,
      app_client_secret,
      app_redirect_uris[0]
    );
    // Set refresh token (obtained after authorizing the app once)
    oauth2Client.setCredentials({
      refresh_token: refresh_token,
    });

    // Google Drive API client
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    try {
      // TODO work on which request to perform

      // Define query parameters (e.g., to filter files or select a specific folder)
      const query = "mimeType != 'application/vnd.google-apps.folder'"; // Exclude folders
      // const query = '';

      // dummy request to Drive API to check the auth
      await drive.files.list({
        q: query,
        fields: 'files(id, name)',
        pageSize: 10, // Adjust the number of files to retrieve
      });
    } catch (error) {
      console.log('Error testing Drive authorisation');
      if (
        error instanceof gaxios.GaxiosError &&
        error.message === 'invalid_grant'
      ) {
        console.log('invalid_grant, returning specific error');
        throw new functions.https.HttpsError(
          'internal',
          'invalid_grant',
          error
        );
      } else {
        console.error('Error testing Drive authorisation:', error);
        throw new functions.https.HttpsError(
          'internal',
          `Unable to test Drive authorisation (${(error as any)?.message})`,
          error
        );
      }
    }
  }
);
