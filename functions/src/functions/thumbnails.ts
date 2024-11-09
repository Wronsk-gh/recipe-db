import { onCall } from 'firebase-functions/v2/https';
import {
  app_client_id,
  app_client_secret,
  app_redirect_uris,
} from '../init/firebase';
import { getUserRefreshToken } from './auth';

const { google } = require('googleapis');

export const testDrive = onCall(
  { region: 'europe-west1' },
  // TODO manage cors for added security -> should be with firebaseapp domain for prod, and local host for development
  // { cors: false },
  async (func_request) => {
    let data;
    const refresh_token = await getUserRefreshToken(
      func_request.auth?.uid ?? ''
    );

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
      // Define query parameters (e.g., to filter files or select a specific folder)
      const query = "mimeType != 'application/vnd.google-apps.folder'"; // Exclude folders

      // Fetch files
      const response = await drive.files.list({
        q: query,
        fields: 'files(id, name, mimeType)',
        pageSize: 10, // Adjust the number of files to retrieve
      });

      // Retrieve files from response
      const files = response.data.files;
      if (files.length === 0) {
        data = 'No files found.';
        // func_response.status(200).send('No files found.');
      } else {
        // func_response.status(200).json(files);
        data = files;
      }
    } catch (error) {
      console.error('Error retrieving files:', error);
      // func_response.status(500).send('Error retrieving files');
      data = 'Error retrieving files';
    }
    return data;
  }
);
