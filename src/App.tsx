import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecipeManager } from './components/RecipeManager';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RecipeManager />
    </QueryClientProvider>
  );
}

export default App;
