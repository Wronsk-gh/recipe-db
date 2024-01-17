import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { RtdbContext } from '../components/RtdbContext';
import { fetchIngredients } from '../rtdb';
import { useGetIngredientsDbQuery } from './useGetIngredientsDbQuery';

export function useGetIngredientsDb() {
  const { data: ingredientsDb } = useGetIngredientsDbQuery();

  return ingredientsDb || {};
}
