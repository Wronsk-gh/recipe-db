import { useState } from 'react';
import { Database } from 'firebase/database';
import { useQuery, useQueries } from '@tanstack/react-query';
import { Outlet, Link } from 'react-router-dom';
import { fetchMonths, fetchIngredients, fetchRecipes } from '../rtdb';
import { Months, Ingredients, Recipes, RecipesThumbnails } from '../db-types';

import { RtdbContext } from './RtdbContext';
import { Auth } from './Auth';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export interface RecipeManagerContext {
  months: Months | undefined;
  ingredients: Ingredients | undefined;
  recipes: Recipes | undefined;
  recipesThumbnails: RecipesThumbnails;
}

export function RecipeManager() {
  const [db, setDb] = useState<Database | undefined>(undefined);
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
      console.log('fetching thumbnail : ' + response.result.thumbnailLink);
      console.log(response.result);
      console.log(gapi.client.getToken().access_token);
      console.log(encodeURIComponent(gapi.client.getToken().access_token));
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

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        {/* <Container> */}
        <Navbar.Brand>React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="recipes">
              Recipes
            </Nav.Link>
            <Nav.Link as={Link} to="ingredients">
              ingredients
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        {/* </Container> */}
      </Navbar>

      {/* <Link to={'recipes'}>Recipes</Link>
      <Link to={'ingredients'}>ingredients</Link> */}
      <Auth setDb={setDb} />
      <br />
      <br />
      <RtdbContext.Provider value={db}>
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
  // } else {
  //   return (
  //     <>
  //       <Auth setDb={setDb} />
  //       <p>Loading...</p>
  //     </>
  //   );
  // }
}
