import { useQuery } from '@tanstack/react-query';
import { Recipe } from '../../db-types';
import { fetchThumbnail } from '../../gapiUtils';

export function useGetRecipeThumbnail(recipe: Recipe): string {
  const thumbnailQuery = useQuery({
    queryKey: ['thumbnail', recipe.google_id],
    queryFn: async () => {
      // const recipeIdThumbnail: RecipesThumbnails = {};
      // recipeIdThumbnail[recipe.id] = await fetchThumbnail(recipe.google_id);
      // return recipeIdThumbnail;
      return await fetchThumbnail(recipe.google_id);
    },
    // enabled: !!recipesData,
    staleTime: 10 * 60 * 1000, // 10 minute
  });

  return thumbnailQuery.data || '';
}
