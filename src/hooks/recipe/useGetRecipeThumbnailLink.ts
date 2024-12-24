import { useQuery } from '@tanstack/react-query';
import { Recipe } from '../../db-types';
import { storeAndFetchThumbnailLink } from '../../models/funcUtils';
import { useContext } from 'react';
import { RtdbContext } from '../../components/auth/RtdbContext';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { DriveAuthorizationDispatchContext } from '../../components/auth/DriveAuthorizationDispatchContext';
import { FirebaseError } from '@firebase/app';

// Thumbnail expires after one day
const THUMBNAIL_EXPIRY_DELAY_ms = 1000 * 60 * 60 * 24 * 1;
// const THUMBNAIL_EXPIRY_DELAY_ms = 0;

export function useGetRecipeThumbnailLink(recipe: Recipe): string {
  // Get the Rtdb from the context
  const rtdbCred = useContext(RtdbContext);
  const dispatch = useContext(DriveAuthorizationDispatchContext);

  const thumbnailQuery = useQuery({
    queryKey: ['thumbnail', recipe.google_id],
    queryFn: async () => {
      if (
        recipe.thumbnailInfo &&
        Date.now() <
          recipe.thumbnailInfo.lastRefreshed + THUMBNAIL_EXPIRY_DELAY_ms
      ) {
        return recipe.thumbnailInfo.link;
      } else {
        try {
          return await storeAndFetchThumbnailLink(rtdbCred, recipe);
        } catch (error) {
          if (
            error instanceof FirebaseError &&
            error.message === 'invalid_grant'
          ) {
            dispatch!({ type: 'invalid_grant' });
          } else {
            throw error;
          }
        }
      }
    },
    // enabled: !isRefreshingToken,
    // staleTime: 10 * 60 * 1000, // 10 minute
  });

  return thumbnailQuery.data || '';
}
