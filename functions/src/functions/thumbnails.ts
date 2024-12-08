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
import * as fs from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';
import { gaxios } from 'google-auth-library';

// export const testDrive = onCall(
//   { region: 'europe-west1' },
//   // TODO manage cors for added security -> should be with firebaseapp domain for prod, and local host for development
//   // { cors: false },
//   async (func_request) => {
//     let data;
//     const refresh_token = await getUserRefreshToken(
//       func_request.auth?.uid ?? ''
//     );

//     // Set up OAuth2 client
//     const oauth2Client = new google.auth.OAuth2(
//       app_client_id,
//       app_client_secret,
//       app_redirect_uris[0]
//     );
//     // Set refresh token (obtained after authorizing the app once)
//     oauth2Client.setCredentials({
//       refresh_token: refresh_token,
//     });

//     // Google Drive API client
//     const drive = google.drive({ version: 'v3', auth: oauth2Client });

//     try {
//       // Define query parameters (e.g., to filter files or select a specific folder)
//       const query = "mimeType != 'application/vnd.google-apps.folder'"; // Exclude folders

//       // Fetch files
//       const response = await drive.files.list({
//         q: query,
//         fields: 'files(id, name, mimeType)',
//         pageSize: 10, // Adjust the number of files to retrieve
//       });

//       // Retrieve files from response
//       const files = response.data.files;
//       if (files.length === 0) {
//         data = 'No files found.';
//         // func_response.status(200).send('No files found.');
//       } else {
//         // func_response.status(200).json(files);
//         data = files;
//       }
//     } catch (error) {
//       console.error('Error retrieving files:', error);
//       // func_response.status(500).send('Error retrieving files');
//       data = 'Error retrieving files';
//     }
//     return data;
//   }
// );

export const saveDriveThumbnail = onCall(
  { region: 'europe-west1' },
  // TODO manage cors for added security -> should be with firebaseapp domain for prod, and local host for development
  // { cors: false },
  async (func_request) => {
    try {
      const uid = func_request.auth?.uid;

      if (!uid) {
        throw new Error('No user ID provided.');
      }

      const refresh_token = await getUserRefreshToken(uid);

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

      const { fileId } = func_request.data;

      if (!fileId) {
        throw new Error('File ID not provided.');
      }

      console.log(`Fetching ${fileId}`);

      // Fetch the file metadata to get the thumbnail link
      const fileMetadata = await drive.files.get({
        fileId: fileId,
        fields: 'thumbnailLink',
      });
      const thumbnailLink = fileMetadata.data.thumbnailLink;

      let buffer;
      if (!thumbnailLink) {
        // If the request was ok, but the thumbnail link is empty,
        // this means that the document is empty, and thus no thumbnail exists.
        // We use a default thumbnail in this case.

        // Read the file into a buffer
        // Note : readFileSync will always resolve paths relative to process.cwd() (the directory node was executed from)
        // See https://stackoverflow.com/a/66218866
        // Thus it is needed to use __dirname
        buffer = fs.readFileSync(join(__dirname, '../../res/empty.png'));
      } else {
        // Download the thumbnail
        const response = await fetch(thumbnailLink);
        buffer = await response.arrayBuffer();
      }

      // Define storage path
      const filePath = `${uid}/thumbnails/${fileId}.png`;

      // Compute hash of the image to store
      const md5Hash = createHash('md5')
        .update(Buffer.from(buffer))
        .digest('hex');

      // Get the bucket reference
      const bucket = storage.bucket();

      // Get the filemetadata (if existing)
      const file = bucket.file(filePath);
      let existingMd5Hash;
      try {
        const [metadata] = await file.getMetadata();
        existingMd5Hash = metadata.metadata.md5Hash;
        console.log('MD5 Hash from metadata:', existingMd5Hash);
      } catch (error) {
        existingMd5Hash = '';
      }

      if (existingMd5Hash === md5Hash) {
        console.log('Hash are matching, no need to upload');
      } else {
        console.log('Hash are differing, uploading to firestore');
        // Upload to Firebase Storage
        await file.save(Buffer.from(buffer), {
          contentType: 'image/png',
          metadata: {
            cacheControl: 'private, max-age=3600', // Cache for 1 hour
            metadata: {
              firebaseStorageDownloadTokens: fileId,
              md5Hash: md5Hash,
            },
          },
        });
      }

      // console.log('Hash are differing, uploading to firestore');
      // // Upload to Firebase Storage
      // await file.save(Buffer.from(buffer), {
      //   contentType: 'image/png',
      //   metadata: {
      //     cacheControl: 'private, max-age=3600', // Cache for 1 hour
      //     metadata: {
      //       firebaseStorageDownloadTokens: fileId,
      //       md5Hash: md5Hash,
      //     },
      //   },
      // });

      // const metadata = await file.getMetadata();
      // console.log("here's the metadata :");
      // console.log(inspect(metadata));

      return {
        message: 'Thumbnail stored successfully!',
        filePath: filePath,
      };
    } catch (error) {
      console.error('Error fetching and storing thumbnail:', error);
      if (
        error instanceof gaxios.GaxiosError &&
        error.message === 'invalid_grant'
      ) {
        throw new functions.https.HttpsError(
          'internal',
          'invalid_grant',
          error
        );
      } else {
        throw new functions.https.HttpsError(
          'internal',
          'Unable to fetch and store thumbnail',
          error
        );
      }
    }
  }
);
