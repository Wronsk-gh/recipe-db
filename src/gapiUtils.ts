const appKeys = require('../client_secret.json');

// Discovery doc URL for APIs used by the quickstart
const DRIVE_DISCOVERY_DOC =
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const DOCS_DISCOVERY_DOC =
  'https://docs.googleapis.com/$discovery/rest?version=v1';

export function setupGapiAndRenderApp(renderApp: () => void) {
  function loadGapiAndRenderApp(renderApp: () => void) {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: appKeys.client_secret,
          discoveryDocs: [DRIVE_DISCOVERY_DOC, DOCS_DISCOVERY_DOC],
        })
        .then(() => {
          renderApp();
        });
    });
  }

  // Check if gapi is not loaded then load script

  if (!window.gapi) {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.onload = () => loadGapiAndRenderApp(renderApp);
    document.head.appendChild(script);
  } else {
    loadGapiAndRenderApp(renderApp);
  }
}
