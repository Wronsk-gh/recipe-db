import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { RecipeManager } from './components/RecipeManager';
import { FilterableIngredientTable } from './components/FilterableIngredientTable';
import { FilterableRecipeTable } from './components/FilterableRecipeTable';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

// Create a client
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <RecipeManager />,
    children: [
      {
        path: 'recipes',
        element: <FilterableRecipeTable />,
      },
      {
        path: 'ingredients',
        element: <FilterableIngredientTable />,
      },
    ],
  },
  // {
  //   path: 'recipes',
  //   element: <Contact />,
  // },
]);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
