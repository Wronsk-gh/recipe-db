import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import { updateIngredientDb, updateIngredientNameDb } from '../rtdb';
import { Months, Ingredients, Recipe } from '../db-types';

import { CallbackButton } from './CallbackButton';
import { RtdbContext } from './RtdbContext';

export function RecipeRow({
  months,
  ingredients,
  recipe,
}: {
  months: Months;
  ingredients: Ingredients;
  recipe: Recipe;
}) {
  let imageUrl = '';
  // Get the Rtdb from the context
  const db = useContext(RtdbContext);
  const [thumbnailLink, setThumbnailLink] = useState('');
  useEffect(() => {
    const getThumbnailLink = async () => {
      // Send the request to gdrive api
      const response = await gapi.client.drive.files.get({
        fileId: recipe!.google_id,
        fields: 'id, name, thumbnailLink',
      });
      if (response.result.thumbnailLink !== undefined) {
        const thumbnailResult = await fetch(
          response.result.thumbnailLink +
            '&access_token=' +
            gapi.client.getToken().access_token
        );
        const blob = await thumbnailResult.blob();
        imageUrl = URL.createObjectURL(blob);
        setThumbnailLink(imageUrl);
      }
    };

    getThumbnailLink();
  }, [recipe]);

  const cells = [];
  let thumbnail = <></>;
  let nameCell = <td key="name"></td>;
  let ingredientsCell = <td key="ingredients"></td>;
  let monthsCell = <td key="months"></td>;
  const recipeIngredients = [];
  const recipeMonthsId: {
    [monthId: string]: boolean;
  } = {};
  const recipeMonths = [];

  // Name cell content
  thumbnail = <img src={thumbnailLink} alt="Loading..." />;
  nameCell = <td key="name">{recipe.name}</td>;
  nameCell = (
    <td key="name">
      <a
        href={'https://docs.google.com/document/d/' + recipe.google_id}
        target="_blank"
      >
        {recipe.name}
      </a>
      <br />
      {thumbnail}
    </td>
  );

  // Ingredients cell content
  // create the list of ingredient name
  for (const ingredientId in recipe.ingredients) {
    if (ingredients[ingredientId] !== undefined) {
      recipeIngredients.push(
        <li key={ingredientId}>{ingredients[ingredientId].name}</li>
      );
    } else {
      console.error(
        `Recipe {recipe.name} has an ingredientId {ingredientId} which could not be found in the list of ingredients.`
      );
    }
  }
  ingredientsCell = <td key="ingredients">{recipeIngredients}</td>;

  // Months cell content
  // Intersect all monthsId
  for (const monthId in months) {
    // Assume month is present by default
    recipeMonthsId[monthId] = true;
    for (const ingredientId in recipe.ingredients) {
      if (
        ingredients[ingredientId].months === undefined ||
        !(monthId in ingredients[ingredientId].months)
      ) {
        // Remove the month if it's not present for one ingredient
        recipeMonthsId[monthId] = false;
      }
    }
  }
  // Build the list of months
  // Cycle from the months definition to keep the order
  for (const monthId in months) {
    if (recipeMonthsId[monthId] === true) {
      recipeMonths.push(<li key={monthId}>{months[monthId].name}</li>);
    }
  }
  monthsCell = <td key="months">{recipeMonths}</td>;

  // Push all the cells into the row
  cells.push(nameCell);
  cells.push(ingredientsCell);
  cells.push(monthsCell);

  return <tr>{cells}</tr>;
}
