const DRIVE_CLIENT_ID =
  '387763281186-iidr7l3a8ocesogpdt3nvgfodphi631h.apps.googleusercontent.com';
const DRIVE_API_KEY = 'AIzaSyA1kUO5D0N0KAyNP4QVruujJocM7YM6IQc';

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
          apiKey: DRIVE_API_KEY,
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
