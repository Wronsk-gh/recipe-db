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

import { beforecreated, beforesignedin } from './functions/auth';
import { saveDriveThumbnail } from './functions/thumbnails';
import { getDriveFilesIds } from './functions/driveFiles';
import { testDriveAuth } from './functions/testDriveAuth';

export {
  beforecreated,
  beforesignedin,
  saveDriveThumbnail,
  getDriveFilesIds,
  testDriveAuth,
};
