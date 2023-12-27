import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecipeManager } from './components/RecipeManager';
import { FilterableIngredientTable } from './components/FilterableIngredientTable';
import { RecipeTable } from './components/RecipeTable';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Create a client for react-query
const queryClient = new QueryClient();

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
    ],
  },
  {
    index: true,
    element: <Navigate to="recipes" />,
  },
]);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
