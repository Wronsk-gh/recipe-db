import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createIngredientDisplayUserDb } from '../../rtdb';

import { useContext } from 'react';
import { RtdbContext } from '../auth/RtdbContext';

export function AddIngredientButton() {
  // Get QueryClient from the context
  const queryClient = useQueryClient();
  // Get the Rtdb from the context
  const rtdbCred = useContext(RtdbContext);

  const newIngredientMutation = useMutation({
    mutationFn: async () => {
      await createIngredientDisplayUserDb(rtdbCred);
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
