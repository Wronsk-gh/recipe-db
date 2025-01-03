import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RtdbContext } from '../../components/auth/RtdbContext';
import { updateTagDisplayUserDb } from '../../models/rtdb';
import { Tag } from '../../models/db-types';

export function useTagMutation() {
  // Get QueryClient from the context
  const queryClient = useQueryClient();
  // Get the Rtdb from the context
  const rtdbCred = useContext(RtdbContext);

  const tagMutation = useMutation({
    mutationFn: async (newTag: Tag) => {
      await updateTagDisplayUserDb(rtdbCred, newTag);
    },
    onError: () => {
      window.alert('Could not update...');
    },
    onSuccess: () => {
      // Force a refetch of the tags
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onSettled: () => {
      tagMutation.reset();
    },
  });

  return tagMutation;
}
