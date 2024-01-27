import { useGetMonthsDbQuery } from './useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './useGetRecipesDbQuery';
import { useGetTagsDbQuery } from './useGetTagsDbQuery';

export function useGetIsRecipesLoading(): boolean {
  const { isLoading: isMonthsDbLoading } = useGetMonthsDbQuery();
  const { isLoading: isIngredientsDbLoading } = useGetIngredientsDbQuery();
  const { isLoading: isRecipesDbLoading } = useGetRecipesDbQuery();
  const { isLoading: isTagsDbLoading } = useGetTagsDbQuery();

  return (
    isMonthsDbLoading ||
    isIngredientsDbLoading ||
    isRecipesDbLoading ||
    isTagsDbLoading
  );
}
