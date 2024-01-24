import { useGetMonthsDbQuery } from './useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';

export function useGetIsRecipesLoading(): boolean {
  const { isLoading: isMonthsDbLoading } = useGetMonthsDbQuery();
  const { isLoading: isIngredientsDbLoading } = useGetIngredientsDbQuery();
  const { isLoading: isRecipesDbLoading } = useGetRecipesDbQuery();

  return isMonthsDbLoading || isIngredientsDbLoading || isRecipesDbLoading;
}
