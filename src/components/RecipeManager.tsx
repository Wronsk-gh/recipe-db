import { useState } from 'react';
import { Database } from 'firebase/database';
import { useQuery } from '@tanstack/react-query';

import { getDb, fetchMonths, fetchIngredients, fetchRecipes } from '../rtdb';

import { FilterableIngredientTable } from './FilterableIngredientTable';
import { FilterableRecipeTable } from './FilterableRecipeTable';
import { RefreshDbButton } from './RefreshDbButton';
import { ConnectDbButton } from './ConnectDbButton';
import { CallbackButton } from './CallbackButton';
import { RtdbContext } from './RtdbContext';
import { Auth } from './Auth';

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

  console.log('rendering RecipeManager !');
  if (
    monthsData !== undefined &&
    ingredientsData !== undefined &&
    recipesData !== undefined
  ) {
    return (
      <RtdbContext.Provider value={db}>
        <Auth setDb={setDb} />
        <div>
          <br />
        </div>
        <FilterableRecipeTable
          months={monthsData}
          ingredients={ingredientsData}
          recipes={recipesData}
        />
        <br />
        <FilterableIngredientTable
          months={monthsData}
          ingredients={ingredientsData}
        />
      </RtdbContext.Provider>
    );
  } else {
    return (
      <>
        <Auth setDb={setDb} />
        <p>Loading...</p>
      </>
    );
  }
}
