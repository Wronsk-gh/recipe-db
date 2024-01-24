import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { RecipesThumbnails } from '../db-types';
import { useQuery } from '@tanstack/react-query';
import { Recipe } from '../db-types';

export function useGetRecipeThumbnail(recipe: Recipe): string {
  async function fetchThumbnail(googleId: string): Promise<string> {
    const response = await gapi.client.drive.files.get({
      fileId: googleId,
      fields: 'id, name, thumbnailLink',
    });
    if (response.result.thumbnailLink !== undefined) {
      // const thumbnailResult = await fetch(
      //   response.result.thumbnailLink +
      //     '&access_token=' +
      //     gapi.client.getToken().access_token
      // );
      const thumbnailResult = await fetch(response.result.thumbnailLink);
      // const thumbnailResult = await fetch(response.result.thumbnailLink, {
      //   headers: {
      //     Authorization: `Bearer {gapi.client.getToken().access_token}`,
      //   },
      // });
      const blob = await thumbnailResult.blob();
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl;
    } else {
      return '';
    }
  }

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
