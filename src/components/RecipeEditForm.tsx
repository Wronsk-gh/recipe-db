import { useState } from 'react';
import _ from 'lodash';
import { TagBox } from './TagBox';
import { IngredientsDb, Recipe, Tag } from '../db-types';

export function RecipeEditForm({
  ingredients,
  displayedObject,
  onDisplayedObjectChange,
}: {
  ingredients: IngredientsDb;
  displayedObject: Recipe;
  onDisplayedObjectChange: (recipe: Recipe) => void;
}) {
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');

  const options = Object.entries(ingredients)
    .sort((a, b) => {
      if (a[1].name > b[1].name) {
        return 1;
      }
      if (b[1].name > a[1].name) {
        return -1;
      }
      return 0;
    })
    .map(([ingredientId, ingredient]) => (
      <option value={ingredientId} key={ingredientId}>
        {ingredient.name}
      </option>
    ));

  const ingredientsTags = Object.keys(
    displayedObject.ingredients !== undefined ? displayedObject.ingredients : {}
  ).map((ingredientId: string) => {
    if (ingredientId in ingredients) {
      return (
        <TagBox
          tag={{ id: ingredientId, name: ingredients[ingredientId].name }}
          onClose={(tag: Tag) => {
            const { [tag.id]: removed, ...newIngredients } = {
              ...displayedObject.ingredients,
            };
            const newDisplayedObject = {
              ...displayedObject,
              ingredients: newIngredients,
            };
            onDisplayedObjectChange(newDisplayedObject);
          }}
          key={ingredientId}
        />
      );
    } else {
      return null;
    }
  });

  return (
    <div>
      <form>
        <label htmlFor="ingredients">Choose an ingredient:</label>
        <select
          name="ingredients"
          onChange={(newValue) => setSelectedIngredient(newValue.target.value)}
        >
          <option value={''} key={''}>
            {'-'}
          </option>
          {options}
        </select>
      </form>
      {ingredientsTags}
      <button
        onClick={() => {
          if (selectedIngredient !== '') {
            // if (displayedObject.ingredients === undefined) {
            //   const newDisplayedObject = {
            //     ...displayedObject,
            //     ingredients: {
            //       [selectedIngredient]: true,
            //     },
            //   };
            //   onDisplayedObjectChange(newDisplayedObject);
            // } else
            if (
              displayedObject.ingredients[selectedIngredient] === undefined
            ) {
              const newDisplayedObject = {
                ...displayedObject,
                ingredients: {
                  [selectedIngredient]: ingredients[selectedIngredient].name,
                  ...displayedObject.ingredients,
                },
              };
              onDisplayedObjectChange(newDisplayedObject);
            }
          }
        }}
      >
        Add
      </button>
    </div>
  );
}
