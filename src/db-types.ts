export type MonthsDb = {
  [monthId: string]: {
    name: string;
  };
};

export type IngredientsDb = {
  [ingredientId: string]: {
    months?: {
      [monthId: string]: boolean;
    };
    name: string;
  };
};

export type RecipeDb = {
  ingredients?: {
    [ingredientId: string]: boolean;
  };
  name: string;
  google_id: string;
};

export type RecipesDb = {
  [recipeId: string]: RecipeDb;
};

export type ObjectWithName = {
  name: string;
};

export type ObjectWithId = {
  id: string;
};

export type ObjectWithNamedIds = {
  [id: string]: string;
};

export type RecipesThumbnails = {
  [recipeId: string]: string;
};

export type Tag = ObjectWithName & ObjectWithId;

export type Month = ObjectWithName & ObjectWithId;

export type Ingredient = ObjectWithName &
  ObjectWithId & {
    months: ObjectWithNamedIds;
  };

export type Recipe = ObjectWithId &
  ObjectWithName & {
    ingredients: ObjectWithNamedIds;
    months: ObjectWithNamedIds;
    google_id: string;
    thumbnailLink: string;
  };

export function getIngredientMonths(
  ingredientId: string,
  ingredients: IngredientsDb,
  months: MonthsDb
) {
  const monthsNames: ObjectWithNamedIds = {};
  for (const monthId in ingredients[ingredientId].months) {
    if (months[monthId] !== undefined) {
      monthsNames[monthId] = months[monthId].name;
    } else {
      console.error(
        `Ingredient {ingredient.name} has a monthId {monthId} which could not be found in the list of months.`
      );
    }
  }
  return monthsNames;
}

export function getRecipeIngredients(
  recipeId: string,
  recipes: RecipesDb,
  ingredients: IngredientsDb
) {
  const ingredientsNames: ObjectWithNamedIds = {};
  for (const ingredientId in recipes[recipeId].ingredients) {
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
  recipeId: string,
  recipes: RecipesDb,
  ingredients: IngredientsDb,
  months: MonthsDb
) {
  const recipeMonthsId: { [id: string]: boolean } = {};
  for (const monthId in months) {
    // Assume month is present by default
    recipeMonthsId[monthId] = true;
    for (const ingredientId in recipes[recipeId].ingredients) {
      if (
        ingredients[ingredientId].months === undefined ||
        !(monthId in ingredients[ingredientId].months!)
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
