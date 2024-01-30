import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';

export function useGetAllIngredientsId(): string[] {
  const { data: ingredientsDb } = useGetIngredientsDbQuery();

  return Object.keys(ingredientsDb);
}
