export interface Months {
  [monthId: string]: {
    name: string;
  };
}

export interface Ingredients {
  [ingredientId: string]: {
    months: {
      [monthId: string]: boolean;
    };
    name: string;
  };
}

export interface Recipes {
  [recipeId: string]: {
    ingredients: {
      [ingredientId: string]: boolean;
    };
    name: string;
    google_id: string;
  };
}

export interface RecipesThumbnails {
  [recipeId: string]: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Ingredient extends NamedObject {
  ingredientId: string;
  months?: {
    [monthId: string]: boolean;
  };
  // name: string;
}

export interface Recipe {
  recipeId: string;
  ingredients: {
    [ingredientId: string]: boolean;
  };
  name: string;
  google_id: string;
  thumbnailLink: string;
}

export interface NamedObject {
  name: string;
}

export function getRecipeIngredients(recipe: Recipe, ingredients: Ingredients) {
  const ingredientsNames: { [id: string]: string } = {};
  for (const ingredientId in recipe.ingredients) {
    if (ingredients[ingredientId] !== undefined) {
      ingredientsNames[ingredientId] = ingredients[ingredientId].name;
    } else {
      console.error(
        `Recipe {recipe.name} has an ingredientId {ingredientId} which could not be found in the list of ingredients.`
      );
    }
  }
  return ingredientsNames;
}

export function getRecipeMonths(
  recipe: Recipe,
  ingredients: Ingredients,
  months: Months
) {
  const recipeMonthsId: { [id: string]: boolean } = {};
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

  const recipeMonths: { [id: string]: string } = {};
  for (const monthId in recipeMonthsId) {
    if (recipeMonthsId[monthId] === true) {
      recipeMonths[monthId] = months[monthId].name;
    }
  }

  return recipeMonths;
}
