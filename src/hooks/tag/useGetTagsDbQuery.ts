import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { RtdbContext } from '../../components/RtdbContext';
import { fetchTags } from '../../rtdb';

export function useGetTagsDbQuery() {
  const rtdbCred = useContext(RtdbContext);

  const query = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      return await fetchTags(rtdbCred);
    },
    enabled: !!rtdbCred.db,
  });

  return { ...query, data: query.data || {} };
}
