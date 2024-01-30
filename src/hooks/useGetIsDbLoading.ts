import { useGetMonthsDbQuery } from './month/useGetMonthsDbQuery';
import { useGetIngredientsDbQuery } from './ingredient/useGetIngredientsDbQuery';
import { useGetRecipesDbQuery } from './recipe/useGetRecipesDbQuery';
import { useGetTagsDbQuery } from './tag/useGetTagsDbQuery';

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
