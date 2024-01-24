import { useGetMonthsDbQuery } from './useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { MonthsDb, IngredientsDb, RecipesDb, Month } from '../db-types';

export function useGetAllMonths(): Month[] {
  const { data: monthsDb } = useGetMonthsDbQuery();

  return Object.keys(monthsDb).map((monthId) => {
    return {
      id: monthId,
      name: monthsDb[monthId]?.name,
    } as Month;
  });
}
