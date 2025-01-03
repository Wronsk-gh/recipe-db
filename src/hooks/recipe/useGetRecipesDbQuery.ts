import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { RtdbContext } from '../../components/auth/RtdbContext';
import { fetchRecipes } from '../../models/rtdb';

export function useGetRecipesDbQuery() {
  const rtdbCred = useContext(RtdbContext);

  const query = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      return await fetchRecipes(rtdbCred);
    },
    enabled: !!rtdbCred.db,
  });

  return { ...query, data: query.data || {} };
}
