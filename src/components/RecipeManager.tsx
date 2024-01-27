import { RtdbCred, fetchMonths, fetchIngredients, fetchRecipes } from '../rtdb';
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { DriveSyncButton } from './DriveSyncButton';
import { SettingsButton } from './SettingsButton';

import { RtdbContext } from './RtdbContext';
import { Auth } from './Auth';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// export interface RecipeManagerContext {
//   months: MonthsDb | undefined;
//   ingredients: IngredientsDb | undefined;
//   recipes: RecipesDb | undefined;
//   recipesThumbnails: RecipesThumbnails;
// }

export function RecipeManager() {
  const [rtdbCred, setRtdbCred] = useState<RtdbCred>({
    user: null,
    db: null,
    displayUserId: null,
  });

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Navbar.Brand>Drive RecipesDb</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="recipes">
              Recipes
            </Nav.Link>
            <Nav.Link as={Link} to="ingredients">
              Ingredients
            </Nav.Link>
            <Nav.Link as={Link} to="tags">
              Tags
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Auth setRtdbCred={setRtdbCred} />
      <RtdbContext.Provider value={rtdbCred}>
        <DriveSyncButton />
        <SettingsButton />
        <br />
        <br />
        <br />
        <Outlet
        // context={
        //   {
        //     months: monthsData,
        //     ingredients: ingredientsData,
        //     recipes: recipesData,
        //     recipesThumbnails: thumbnails,
        //   } satisfies RecipeManagerContext
        // }
        />
      </RtdbContext.Provider>
    </>
  );
}
