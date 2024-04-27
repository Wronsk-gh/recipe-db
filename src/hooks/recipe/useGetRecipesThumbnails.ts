import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { RecipesThumbnails } from '../../db-types';
import { useQueries } from '@tanstack/react-query';
import {
  fetchThumbnail,
  isRefreshingToken,
  gapiAuthorized,
} from '../../models/gapiUtils';

export function useGetRecipesThumbnails(): RecipesThumbnails {
  const { data: recipesData } = useGetRecipesDbQuery();

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
              enabled: !!recipesData && !isRefreshingToken && gapiAuthorized,
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
