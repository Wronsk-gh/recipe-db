import { Database } from 'firebase/database';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import _ from 'lodash';

import { updateIngredientDb, updateIngredientNameDb } from '../rtdb';
import { Months, Ingredients, Recipe } from '../db-types';

import { CallbackButton } from './CallbackButton';

export function RecipeRow({
  db,
  months,
  ingredients,
  recipe,
}: {
  db: Database | undefined;
  months: Months | undefined;
  ingredients: Ingredients | undefined;
  recipe: Recipe | undefined;
}) {
  return <div></div>;
}
