import { RtdbCred } from '../../models/rtdb';
import { useState, useReducer, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { DriveSyncButton } from './DriveSyncButton';
import { SettingsButton } from './SettingsButton';

import { DriveAuthorizationDispatchContext } from '../auth/DriveAuthorizationDispatchContext';
import { RtdbContext } from '../auth/RtdbContext';
import { Auth } from '../auth/Auth';
import { testDriveAuth } from '../../models/funcUtils';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FirebaseError } from '@firebase/app';

function driveAuthorisationReducer(state: boolean, action: { type: string }) {
  if (action.type === 'authorized') {
    return true;
  } else if (action.type === 'invalid_grant') {
    return false;
  } else {
    return false;
  }
}

export function RecipeManager() {
  const [rtdbCred, setRtdbCred] = useState<RtdbCred>({
    user: null,
    db: null,
    storage: null,
    displayUserId: null,
  });
  // const [driveAuthorisationState, driveAuthorisationDispatch] = useReducer(
  //   driveAuthorisationReducer,
  //   false
  // );
  const [driveAuthorisationState, driveAuthorisationDispatch] = useReducer(
    driveAuthorisationReducer,
    false
  );

  // // Perform a test of drive authorisation when loading the app
  // useEffect(() => {
  //   async function runTestDriveAuth() {
  //     await testDriveAuth();
  //   }
  //   try {
  //     runTestDriveAuth();
  //   } catch (error) {
  //     if (error instanceof FirebaseError && error.message === 'invalid_grant') {
  //       driveAuthorisationDispatch({ type: 'invalid_grant' });
  //     } else {
  //       throw error;
  //     }
  //   }
  // }, []);

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Navbar.Brand>Recipes Manager</Navbar.Brand>
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

      <Auth
        setRtdbCred={setRtdbCred}
        driveAuthorisationDispatch={driveAuthorisationDispatch}
      />
      <RtdbContext.Provider value={rtdbCred}>
        <DriveAuthorizationDispatchContext.Provider
          value={driveAuthorisationDispatch}
        >
          <DriveSyncButton />
          <SettingsButton />
          <br />
          <br />
          <br />
          {driveAuthorisationState ? <Outlet /> : <div>Please log in !</div>}
          {/* <Outlet /> */}
        </DriveAuthorizationDispatchContext.Provider>
      </RtdbContext.Provider>
    </>
  );
}
