import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RtdbContext } from '../components/RtdbContext';
import { updateIngredientDisplayUserDb } from '../rtdb';
import { Ingredient } from '../db-types';

export function useIngredientMutation() {
  // Get QueryClient from the context
  const queryClient = useQueryClient();
  // Get the Rtdb from the context
  const rtdbCred = useContext(RtdbContext);

  const ingredientMutation = useMutation({
    mutationFn: async (newIngredient: Ingredient) => {
      await updateIngredientDisplayUserDb(rtdbCred, newIngredient);
    },
    onError: () => {
      window.alert('Could not update...');
    },
    onSuccess: () => {
      // Force a refetch of the ingredients
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
    onSettled: () => {
      ingredientMutation.reset();
    },
  });

  return ingredientMutation;
}
