import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTagDisplayUserDb } from '../../rtdb';

import { useContext } from 'react';
import { RtdbContext } from '../auth/RtdbContext';

export function AddTagButton() {
  // Get QueryClient from the context
  const queryClient = useQueryClient();
  // Get the Rtdb from the context
  const rtdbCred = useContext(RtdbContext);

  const newTagMutation = useMutation({
    mutationFn: async () => {
      await createTagDisplayUserDb(rtdbCred);
    },
    onError: () => {
      window.alert('Could not create new tag...');
    },
    onSuccess: onMutationSuccess,
    onSettled: () => {
      newTagMutation.reset();
    },
  });

  function onMutationSuccess() {
    // Force an update of the ingredients
    queryClient.invalidateQueries({ queryKey: ['tags'] });
  }

  function onButtonClick() {
    newTagMutation.mutate();
  }

  return <button onClick={onButtonClick}>Add Tag</button>;
}
