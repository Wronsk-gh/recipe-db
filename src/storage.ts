import { RtdbCred } from './rtdb';
import { ref, getDownloadURL } from 'firebase/storage';

export async function getFileLink(rtdbCred: RtdbCred, storageFilePath: string) {
  if (rtdbCred.storage === null || rtdbCred.user === null) {
    throw new Error('No storage connection available');
  }
  // Reference to the thumbnail image in Firebase Storage
  const thumbnailRef = ref(rtdbCred.storage, storageFilePath);

  // Get the download URL
  const url = await getDownloadURL(thumbnailRef);

  // Now you can use the URL to display the image or download it
  // console.log('Download URL:', url);
  return url;
}
