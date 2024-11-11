import { useQuery } from '@tanstack/react-query';
import { Recipe } from '../../db-types';
import {
  fetchThumbnailLink,
  isRefreshingToken,
  gapiAuthorized,
} from '../../models/gapiUtils';
import { useContext } from 'react';
import { RtdbContext } from '../../components/auth/RtdbContext';
import { storeAndFetchThumbnailLink } from '../../models/gapiUtils';

export function useGetRecipeThumbnailLink(recipe: Recipe): string {
  // Get the Rtdb from the context
  const rtdbCred = useContext(RtdbContext);

  const thumbnailQuery = useQuery({
    queryKey: ['thumbnail', recipe.google_id],
    queryFn: async () => {
      // return await fetchThumbnailLink(recipe.google_id);
      return await storeAndFetchThumbnailLink(rtdbCred, recipe.google_id);
    },
    enabled: !isRefreshingToken && gapiAuthorized,
    staleTime: 10 * 60 * 1000, // 10 minute
  });

  return thumbnailQuery.data || '';
}
