import { useState } from 'react';
import { Database } from 'firebase/database';
import { useQuery, useQueries } from '@tanstack/react-query';

import { fetchMonths, fetchIngredients, fetchRecipes } from '../rtdb';
import { RecipesThumbnails } from '../db-types';

import { FilterableIngredientTable } from './FilterableIngredientTable';
import { FilterableRecipeTable } from './FilterableRecipeTable';
import { RtdbContext } from './RtdbContext';
import { Auth } from './Auth';

enum CurrentView {
  recipes,
  ingredients,
}

export function RecipeManager() {
  const [db, setDb] = useState<Database | undefined>(undefined);
  const [currentView, setCurrentView] = useState<CurrentView>(
    CurrentView.recipes
  );
  const {
    isLoading: isMonthsLoading,
    isError: isMonthsError,
    data: monthsData,
    error: monthsError,
  } = useQuery({
    queryKey: ['months'],
    queryFn: async () => {
      return await fetchMonths(db);
    },
    enabled: !!db,
  });
  const {
    isLoading: isIngredientsLoading,
    isError: isIngredientsError,
    data: ingredientsData,
    error: ingredientsError,
  } = useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      return await fetchIngredients(db);
    },
    enabled: !!db,
  });
  const {
    isLoading: isRecipesLoading,
    isError: isRecipesError,
    data: recipesData,
    error: recipesError,
  } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      return await fetchRecipes(db);
    },
    enabled: !!db,
  });

  async function fetchThumbnail(googleId: string): Promise<string> {
    const response = await gapi.client.drive.files.get({
      fileId: googleId,
      fields: 'id, name, thumbnailLink',
    });
    if (response.result.thumbnailLink !== undefined) {
      const thumbnailResult = await fetch(
        response.result.thumbnailLink +
          '&access_token=' +
          gapi.client.getToken().access_token
      );
      const blob = await thumbnailResult.blob();
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl;
    } else {
      return '';
    }
  }

  const thumbnailsQueries = useQueries({
    queries: (Object.entries(recipesData || {}) || []).map(
      ([recipeId, recipe]) => {
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
      }
    ),
  });

  const thumbnails: RecipesThumbnails = {};

  thumbnailsQueries.map((query) => {
    if (query.data !== undefined) {
      Object.assign(thumbnails, query.data);
    }
  });

  if (
    monthsData !== undefined &&
    ingredientsData !== undefined &&
    recipesData !== undefined
  ) {
    // See which view to display
    let view = <></>;
    if (currentView === CurrentView.recipes) {
      view = (
        <FilterableRecipeTable
          months={monthsData}
          ingredients={ingredientsData}
          recipes={recipesData}
          recipesThumbnails={thumbnails}
        />
      );
    } else if (currentView === CurrentView.ingredients) {
      view = (
        <FilterableIngredientTable
          months={monthsData}
          ingredients={ingredientsData}
        />
      );
    }

    return (
      <>
        <Auth setDb={setDb} />
        <br />
        <br />
        <button
          onClick={() => {
            setCurrentView(CurrentView.recipes);
          }}
        >
          Recipes
        </button>
        <button
          onClick={() => {
            setCurrentView(CurrentView.ingredients);
          }}
        >
          Ingredients
        </button>
        <RtdbContext.Provider value={db}>
          <br />
          {view}
        </RtdbContext.Provider>
      </>
    );
  } else {
    return (
      <>
        <Auth setDb={setDb} />
        <p>Loading...</p>
      </>
    );
  }
}
