import { useGetMonthsDbQuery } from './useGetMonthsDbQuery';
import { Month } from '../../models/db-types';
import { getMonth } from '../../models/RecipeUtils';

export function useGetAllMonths(): Month[] {
  const { data: monthsDb } = useGetMonthsDbQuery();

  return Object.keys(monthsDb).map((id) => {
    return getMonth(id, monthsDb);
  });
}
