import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { RtdbContext } from '../../components/auth/RtdbContext';
import { fetchMonths } from '../../rtdb';

export function useGetMonthsDbQuery() {
  const rtdbCred = useContext(RtdbContext);

  const query = useQuery({
    queryKey: ['months'],
    queryFn: async () => {
      return await fetchMonths(rtdbCred);
    },
    enabled: !!rtdbCred.db,
  });

  return { ...query, data: query.data || {} };
}
