import { useState } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { Outlet, Link } from 'react-router-dom';
import { RtdbCred, fetchMonths, fetchIngredients, fetchRecipes } from '../rtdb';
import {
  MonthsDb,
  IngredientsDb,
  RecipesDb,
  Recipe,
  RecipesThumbnails,
  getRecipeIngredients,
  getRecipeMonths,
} from '../db-types';
import { DriveSyncButton } from './DriveSyncButton';
import { SettingsButton } from './SettingsButton';

import { RtdbContext } from './RtdbContext';
import { Auth } from './Auth';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export interface RecipeManagerContext {
  months: MonthsDb | undefined;
  ingredients: IngredientsDb | undefined;
  recipes: RecipesDb | undefined;
  recipesThumbnails: RecipesThumbnails;
}

export function RecipeManager() {
  const [rtdbCred, setRtdbCred] = useState<RtdbCred>({
    user: null,
    db: null,
    displayUserId: null,
  });

  const {
    isLoading: isMonthsLoading,
    isError: isMonthsError,
    data: monthsData,
    error: monthsError,
  } = useQuery({
    queryKey: ['months'],
    queryFn: async () => {
      return await fetchMonths(rtdbCred);
    },
    enabled: !!rtdbCred.db,
  });
  const {
    isLoading: isIngredientsLoading,
    isError: isIngredientsError,
    data: ingredientsData,
    error: ingredientsError,
  } = useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      return await fetchIngredients(rtdbCred);
    },
    enabled: !!rtdbCred.db,
  });
  const {
    isLoading: isRecipesLoading,
    isError: isRecipesError,
    data: recipesData,
    error: recipesError,
  } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      return await fetchRecipes(rtdbCred);
    },
    enabled: !!rtdbCred.db,
  });

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

  const thumbnails: RecipesThumbnails = {};

  thumbnailsQueries.map((query) => {
    if (query.data !== undefined) {
      Object.assign(thumbnails, query.data);
    }
  });

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Navbar.Brand>Drive RecipesDb</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="recipes">
              RecipesDb
            </Nav.Link>
            <Nav.Link as={Link} to="ingredients">
              ingredients
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Auth setRtdbCred={setRtdbCred} />
      <RtdbContext.Provider value={rtdbCred}>
        <DriveSyncButton recipes={recipesData} />
        <SettingsButton />
        <br />
        <br />
        <br />
        <Outlet
          context={
            {
              months: monthsData,
              ingredients: ingredientsData,
              recipes: recipesData,
              recipesThumbnails: thumbnails,
            } satisfies RecipeManagerContext
          }
        />
      </RtdbContext.Provider>
    </>
  );
}
