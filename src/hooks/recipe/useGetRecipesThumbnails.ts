import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { RecipesThumbnails } from '../../db-types';
import { useQueries } from '@tanstack/react-query';

export function useGetRecipesThumbnails(): RecipesThumbnails {
  const { data: recipesData } = useGetRecipesDbQuery();

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

  const thumbnailsQueries = useQueries({
    queries:
      recipesData && Object.entries(recipesData)
        ? Object.entries(recipesData).map(([recipeId, recipe]) => {
            return {
              queryKey: ['thumbnail', recipe.google_id],
              queryFn: async () => {
                const recipeIdThumbnail: RecipesThumbnails = {};
                recipeIdThumbnail[recipeId] = await fetchThumbnail(
                  recipe.google_id
                );
                return recipeIdThumbnail;
              },
              enabled: !!recipesData,
              staleTime: 10 * 60 * 1000, // 10 minute
            };
          })
        : [], // if recipesData is undefined or entries in recipesData is null, an empty array is returned
  });

  const recipesThumbnails: RecipesThumbnails = {};

  thumbnailsQueries.map((query) => {
    if (query.data !== undefined) {
      Object.assign(recipesThumbnails, query.data);
    }
  });

  return recipesThumbnails;
}
