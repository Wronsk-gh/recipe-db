import { useQuery } from '@tanstack/react-query';
import { Recipe } from '../../db-types';
import { fetchThumbnailLink, isRefreshingToken } from '../../models/gapiUtils';

export function useGetRecipeThumbnailLink(recipe: Recipe): string {
  const thumbnailQuery = useQuery({
    queryKey: ['thumbnail', recipe.google_id],
    queryFn: async () => {
      // const recipeIdThumbnail: RecipesThumbnails = {};
      // recipeIdThumbnail[recipe.id] = await fetchThumbnail(recipe.google_id);
      // return recipeIdThumbnail;
      return await fetchThumbnailLink(recipe.google_id);
    },
    enabled: !isRefreshingToken,
    staleTime: 10 * 60 * 1000, // 10 minute
  });

  return thumbnailQuery.data || '';
}
