import React from 'react';
import ReactDOM from 'react-dom/client';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { RecipeManager } from './components/main-page/RecipeManager';
import { FilterableIngredientTable } from './components/ingredient-table/FilterableIngredientTable';
import { RecipeTable } from './components/recipe-table/RecipeTable';
import { TagTable } from './components/tag-table/TagTable';
// import { setupGapiAndRenderApp } from './models/gapiUtils';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Importing the custom App CSS
import './App.css';

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

// Create a client for react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

// Define the routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <RecipeManager />,
    children: [
      {
        path: 'recipes',
        element: <RecipeTable />,
      },
      {
        path: 'ingredients',
        element: <FilterableIngredientTable />,
      },
      {
        path: 'tags',
        element: <TagTable />,
      },
    ],
  },
  {
    index: true,
    element: <Navigate to="recipes" />,
  },
]);

root.render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <RouterProvider router={router} />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
