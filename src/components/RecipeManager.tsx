import { useState } from 'react';
import { Database } from 'firebase/database';
import { useQuery } from '@tanstack/react-query';

import { getDb, fetchMonths, fetchIngredients } from '../rtdb';

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

  async function getDbSingleton() {
    setDb(await getDb());
  }

  return (
    <div>
      <RefreshDbButton />
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
