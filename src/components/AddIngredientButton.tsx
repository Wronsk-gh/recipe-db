import { Database } from 'firebase/database';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createIngredientDb } from '../rtdb';

import { useContext } from 'react';
import { RtdbContext } from './RtdbContext';

export function AddIngredientButton() {
  // Get QueryClient from the context
  const queryClient = useQueryClient();
  // Get the Rtdb from the context
  const db = useContext(RtdbContext);

  const newIngredientMutation = useMutation({
    mutationFn: async () => {
      await createIngredientDb(db);
    },
    onError: () => {
      window.alert('Could not create new ingredient...');
    },
    onSuccess: onMutationSuccess,
    onSettled: () => {
      newIngredientMutation.reset();
    },
  });

  function onMutationSuccess() {
    // Force an update of the ingredients
    queryClient.invalidateQueries({ queryKey: ['ingredients'] });
  }

  function onButtonClick() {
    newIngredientMutation.mutate();
  }

  return <button onClick={onButtonClick}>Add Ingredient</button>;
}
