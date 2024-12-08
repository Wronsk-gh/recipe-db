import { onCall } from 'firebase-functions/v2/https';
import {
  app_client_id,
  app_client_secret,
  app_redirect_uris,
} from '../init/firebase';
import { getUserRefreshToken } from './auth';
import { google, drive_v3 } from 'googleapis';
import * as functions from 'firebase-functions';
import { inspect } from 'util';

export const getDriveFilesIds = onCall(
  { region: 'europe-west1' },
  // TODO manage cors for added security -> should be with firebaseapp domain for prod, and local host for development
  // { cors: false },
  async (func_request) => {
    try {
      const uid = func_request.auth?.uid;

      if (!uid) {
        throw new Error('No user ID provided.');
      }

      // Get the refresh token of the user
      const refresh_token = await getUserRefreshToken(uid);

      // Set up OAuth2 client
      const oauth2Client = new google.auth.OAuth2(
        app_client_id,
        app_client_secret,
        app_redirect_uris[0]
      );
      // Set refresh token
      oauth2Client.setCredentials({
        refresh_token: refresh_token,
      });

      // Google Drive API client
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const { folderId } = func_request.data;

      if (!folderId) {
        throw new Error('Folder ID not provided.');
      }

      console.log(`Getting list of files in folder ${folderId}`);
      let page_token: string = '';
      const allFiles: drive_v3.Schema$File[] = [];
      // Using an object with keys allow for setting duplicate entries as one
      const idsNamesDict: { [id: string]: string } = {};

      while (true) {
        // Send the request to gdrive api
        const response: drive_v3.Schema$FileList = (
          await drive.files.list({
            pageSize: 500,
            fields: 'nextPageToken,files(id, name)',
            q: `'${folderId}' in parents and trashed=false`,
            pageToken: page_token,
          })
        ).data;

        // Get the received files and append them to the list
        const files = response.files;
        if (files !== undefined && files.length > 0) {
          allFiles.push(...files);
        }
        // Prepare next request or break out if there are no more items
        if (!response.nextPageToken) {
          break;
        } else {
          page_token = response.nextPageToken;
        }
      }

      // Create the set of google ids present in the Drive folder
      allFiles.forEach((file) => {
        idsNamesDict[file!.id!] = file!.name!;
      });

      return {
        message: `List of files in folder ${folderId} retrieved successfully!`,
        idsNamesDict: idsNamesDict,
      };
    } catch (error) {
      console.error('Error fetching and storing thumbnail:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Unable to get list of files',
        error
      );
    }
  }
);
