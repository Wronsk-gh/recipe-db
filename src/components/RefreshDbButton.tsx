import { useEffect } from "react";

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID =
  "387763281186-iidr7l3a8ocesogpdt3nvgfodphi631h.apps.googleusercontent.com";
const API_KEY = "AIzaSyA1kUO5D0N0KAyNP4QVruujJocM7YM6IQc";

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/drive.metadata.readonly";

let tokenClient: any;

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC]
  });
}

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

/**
 * Print metadata for first 10 files.
 */
async function listFiles() {
  let response;
  try {
    response = await gapi.client.drive.files.list({
      pageSize: 10,
      fields: "files(id, name)"
    });
  } catch (err) {
    console.log(err.message);
    return;
  }
  const files = response.result.files;
  if (!files || files.length === 0) {
    console.log("No files found.");
    return;
  }
  // Flatten to string to display
  const output = files.reduce(
    (str: any, file: any) => `${str}${file.name} (${file.id})\n`,
    "Files:\n"
  );
  console.log(output);
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp: any) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    await listFiles();
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "" as any // defined later
  });
}

export function RefreshDbButton() {
  useEffect(() => {
    const gapiScript = document.createElement("script");
    gapiScript.src = "https://apis.google.com/js/api.js";
    gapiScript.async = true;
    gapiScript.onload = gapiLoaded;
    document.head.appendChild(gapiScript);

    const gsiScript = document.createElement("script");
    gsiScript.src = "https://accounts.google.com/gsi/client";
    gsiScript.async = true;
    gsiScript.onload = gisLoaded;
    document.head.appendChild(gsiScript);
  }, []);

  return <button onClick={handleAuthClick}>Refresh DB</button>;
}
