import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import { TagBox } from './TagBox';

import { updateIngredientDb, updateIngredientNameDb } from '../rtdb';
import { Months, Ingredients, Recipe, Tag } from '../db-types';

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

  const [displayedIngredients, setDisplayedIngredients] = useState({
    ...recipe.ingredients,
  });

  const options = Object.entries(ingredients).map(
    ([ingredientId, ingredient]) => (
      <option value={ingredientId}>{ingredient.name}</option>
    )
  );

  const ingredientsTags = Object.keys(
    displayedIngredients !== undefined ? displayedIngredients : {}
  ).map((ingredientId: string) => {
    if (ingredientId in ingredients) {
      return (
        <TagBox
          tag={{ id: ingredientId, name: ingredients[ingredientId].name }}
          onClose={(tag: Tag) => {
            const { [tag.id]: removed, ...newIngredients } =
              displayedIngredients;
            setDisplayedIngredients(newIngredients);
          }}
        />
      );
    } else {
      return null;
    }
  });

  return (
    <div className="popup">
      <div className="popup-inner">
        {recipe.name}
        <form>
          <label htmlFor="ingredients">Choose an ingredient:</label>
          <select name="ingredients">{options}</select>
        </form>
        {ingredientsTags}
        <button onClick={onEditEnd}>Cancel edit</button>
      </div>
    </div>
  );
}
