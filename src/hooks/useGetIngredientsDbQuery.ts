import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { RtdbContext } from '../components/RtdbContext';
import { fetchIngredients } from '../rtdb';

export function useGetIngredientsDbQuery() {
  const rtdbCred = useContext(RtdbContext);

  const query = useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      return await fetchIngredients(rtdbCred);
    },
    enabled: !!rtdbCred.db,
  });

  return { ...query, data: query.data || {} };
}
