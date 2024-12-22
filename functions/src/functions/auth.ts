import {
  beforeUserCreated,
  beforeUserSignedIn,
} from 'firebase-functions/v2/identity';
import { HttpsError } from 'firebase-functions/v2/https';
// import { debug } from 'firebase-functions/logger';
import { db } from '../init/firebase';

export const beforecreated = beforeUserCreated(
  { region: 'europe-west1', refreshToken: true },
  (event) => {
    try {
      const user = event.data;

      if (!user) {
        throw new Error('No user provided.');
      }
      // Store the refresh token for later offline use.
      // These will only be returned if refresh tokens credentials are included
      // (enabled by Cloud console).
      return saveUserRefreshToken(
        user.uid,
        event.credential?.refreshToken ?? ''
      );
    } catch (error) {
      console.error('Error storing refreshToken:', error);
      throw new HttpsError('internal', 'Unable to store refreshToken', error);
    }
  }
);

export const beforesignedin = beforeUserSignedIn(
  { region: 'europe-west1', refreshToken: true },
  (event) => {
    try {
      const user = event.data;

      if (!user) {
        throw new Error('No user provided.');
      }
      // Store the refresh token for later offline use.
      // These will only be returned if refresh tokens credentials are included
      // (enabled by Cloud console).
      return saveUserRefreshToken(
        user.uid,
        event.credential?.refreshToken ?? ''
      );
    } catch (error) {
      console.error('Error storing refreshToken:', error);
      throw new HttpsError('internal', 'Unable to store refreshToken', error);
    }
  }
);

async function saveUserRefreshToken(userUid: string, refreshToken: string) {
  const ref = db.ref(`users/${userUid}/_admin`);
  await ref.set({ refreshToken: refreshToken });
}

export async function getUserRefreshToken(userUid: string) {
  const ref = db.ref(`users/${userUid}/_admin`);
  return (await ref.get()).val().refreshToken;
}
