import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecipeManager } from './components/RecipeManager';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Create a client
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Hello world!</div>,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RecipeManager />
    </QueryClientProvider>
  );
}

export default App;
