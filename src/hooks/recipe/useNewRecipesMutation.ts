import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RtdbContext } from '../../components/auth/RtdbContext';
import { createRecipeDisplayUserDb } from '../../models/rtdb';
import { RecipeDb } from '../../models/db-types';

export function useNewRecipesMutation() {
  // Get the Rtdb from the context
  const rtdbCred = useContext(RtdbContext);

  const newRecipesMutation = useMutation({
    mutationFn: async (data: RecipeDb[]) => {
      if (data.length > 0) {
        await createRecipeDisplayUserDb(
          rtdbCred,
          data[0].google_id,
          data[0].name
        );
      }
    },
    onError: () => {
      window.alert('Could not create new recipes...');
    },
    onSuccess: () => {},
    onSettled: () => {
      newRecipesMutation.reset();
    },
  });
}
