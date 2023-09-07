import { Database } from 'firebase/database';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createIngredientDb } from '../rtdb';

// import { useState } from "react";

export function AddIngredientButton({ db }: { db: Database | undefined }) {
  // Get QueryClient from the context
  const queryClient = useQueryClient();

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
