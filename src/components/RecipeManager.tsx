import { useState } from 'react';
import { Database } from 'firebase/database';
import { useQuery } from '@tanstack/react-query';

import { getDb, fetchMonths, fetchIngredients, fetchRecipes } from '../rtdb';

import { FilterableIngredientTable } from './FilterableIngredientTable';
import { RefreshDbButton } from './RefreshDbButton';
import { ConnectDbButton } from './ConnectDbButton';
import { CallbackButton } from './CallbackButton';

export function RecipeManager() {
  const [db, setDb] = useState<Database | undefined>(undefined);
  const {
    isLoading: isMonthsLoading,
    isError: isMonthsError,
    data: monthsData,
    error: monthsError,
  } = useQuery({
    queryKey: ['months'],
    queryFn: async () => {
      return await fetchMonths(db);
    },
    enabled: !!db,
  });
  const {
    isLoading: isIngredientsLoading,
    isError: isIngredientsError,
    data: ingredientsData,
    error: ingredientsError,
  } = useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      return await fetchIngredients(db);
    },
    enabled: !!db,
  });
  const {
    isLoading: isRecipesLoading,
    isError: isRecipesError,
    data: recipesData,
    error: recipesError,
  } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      return await fetchRecipes(db);
    },
    enabled: !!db,
  });

  async function getDbSingleton() {
    setDb(await getDb());
  }

  return (
    <div>
      <RefreshDbButton db={db} recipes={recipesData} />
      <ConnectDbButton onButtonClick={getDbSingleton} />
      <div>
        <br />
      </div>
      <FilterableIngredientTable
        db={db}
        months={monthsData}
        ingredients={ingredientsData}
      />
    </div>
  );
}
