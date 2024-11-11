import { useQuery } from '@tanstack/react-query';
import { Recipe } from '../../db-types';
import {
  fetchThumbnailLink,
  isRefreshingToken,
  gapiAuthorized,
} from '../../models/gapiUtils';

export function useGetRecipeThumbnailLink(recipe: Recipe): string {
  const thumbnailQuery = useQuery({
    queryKey: ['thumbnail', recipe.google_id],
    queryFn: async () => {
      return await fetchThumbnailLink(recipe.google_id);
    },
    enabled: !isRefreshingToken && gapiAuthorized,
    staleTime: 10 * 60 * 1000, // 10 minute
  });

  return thumbnailQuery.data || '';
}
