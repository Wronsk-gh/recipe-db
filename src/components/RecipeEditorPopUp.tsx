import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import { updateIngredientDb, updateIngredientNameDb } from '../rtdb';
import { Months, Ingredients, Recipe } from '../db-types';

import { RtdbContext } from './RtdbContext';

export function RecipeEditorPopUp({
  ingredients,
  recipe,
  onEditEnd,
}: {
  ingredients: Ingredients;
  recipe: Recipe;
  onEditEnd: () => void;
}) {
  // Get the Rtdb from the context
  const db = useContext(RtdbContext);

  return (
    <div className="popup">
      <div className="popup-inner">
        {recipe.name}
        <form>
          <label htmlFor="ingredients">Choose an ingredient:</label>
          <select name="ingredients">
            {Object.entries(ingredients).map(([ingredientId, ingredient]) => (
              <option value={ingredientId}>{ingredient.name}</option>
            ))}
          </select>
        </form>
        <button onClick={onEditEnd}>Cancel edit</button>
      </div>
    </div>
  );
}
