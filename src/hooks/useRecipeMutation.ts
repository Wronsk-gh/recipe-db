import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RtdbContext } from '../components/RtdbContext';
import { updateRecipeDisplayUserDb } from '../rtdb';
import { Recipe, RecipesDb } from '../db-types';
import { getRecipeDbRepr } from '../models/RecipeUtils';

export function useRecipeMutation() {
  // Get QueryClient from the context
  const queryClient = useQueryClient();
  // Get the Rtdb from the context
  const rtdbCred = useContext(RtdbContext);

  const recipeMutation = useMutation<RecipesDb, any, Recipe, RecipesDb>({
    // When mutate is called:
    mutationFn: async (newRecipe: Recipe) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['recipes'] });

      // Snapshot the previous value
      const previousRecipesDb = queryClient.getQueryData(['recipes']);

      // Optimistically update to the new value
      queryClient.setQueryData<RecipesDb>(['recipes'], (oldDb) => {
        const newRecipeDb = getRecipeDbRepr(newRecipe);
        return { ...oldDb, [newRecipe.id]: newRecipeDb };
      });

      await updateRecipeDisplayUserDb(rtdbCred, newRecipe);

      return { previousRecipesDb };
    },
    onError: (err, newRecipe, context) => {
      queryClient.setQueryData(['recipes'], context.previousRecipesDb);
      window.alert('Could not update...');
    },
    // onSuccess: onRecipeMutationSuccess,
    onSettled: () => {
      recipeMutation.reset();
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });

  // function onRecipeMutationSuccess() {
  //   // Force an update of the recipes
  //   queryClient.invalidateQueries({ queryKey: ['recipes'] });
  // }

  return recipeMutation;
}
