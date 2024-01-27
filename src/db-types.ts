export type IdsDict = {
  [id: string]: boolean;
};

export type IdsList = string[];

export type TagDb = {
  name: string;
};

export type TagsDb = {
  [tagId: string]: TagDb;
};

export type MonthsDb = {
  [monthId: string]: {
    name: string;
  };
};

export type IngredientDb = {
  months?: {
    [monthId: string]: boolean;
  };
  name: string;
};

export type IngredientsDb = {
  [ingredientId: string]: IngredientDb;
};

export type RecipeDb = {
  ingredients?: {
    [ingredientId: string]: boolean;
  };
  tags?: {
    [tagId: string]: boolean;
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

export type TagBadge = ObjectWithName & ObjectWithId;

export type Tag = {
  id: string;
  name: string;
};

export type Month = {
  id: string;
  name: string;
};

export type Ingredient = {
  id: string;
  name: string;
  months: IdsList;
};

// export type Recipe = ObjectWithId &
//   ObjectWithName & {
//     ingredients: ObjectWithNamedIds;
//     months: ObjectWithNamedIds;
//     google_id: string;
//     thumbnailLink: string;
//   };

export type Recipe = {
  id: string;
  name: string;
  google_id: string;
  ingredients: IdsList;
  months: IdsList;
  tags: IdsList;
};

// export function getIngredientMonths(
//   ingredientId: string,
//   ingredients: IngredientsDb,
//   months: MonthsDb
// ) {
//   const monthsNames: ObjectWithNamedIds = {};
//   for (const monthId in ingredients[ingredientId].months) {
//     if (months[monthId] !== undefined) {
//       monthsNames[monthId] = months[monthId].name;
//     } else {
//       console.error(
//         `Ingredient {ingredient.name} has a monthId {monthId} which could not be found in the list of months.`
//       );
//     }
//   }
//   return monthsNames;
// }

// export function getRecipeIngredients(
//   recipeId: string,
//   recipes: RecipesDb,
//   ingredients: IngredientsDb
// ) {
//   const ingredientsNames: ObjectWithNamedIds = {};
//   for (const ingredientId in recipes[recipeId].ingredients) {
//     if (ingredients[ingredientId] !== undefined) {
//       ingredientsNames[ingredientId] = ingredients[ingredientId].name;
//     } else {
//       console.error(
//         `Recipe {recipe.name} has an ingredientId {ingredientId} which could not be found in the list of ingredients.`
//       );
//     }
//   }
//   return ingredientsNames;
// }

// export function getRecipeMonths(
//   recipeId: string,
//   recipes: RecipesDb,
//   ingredients: IngredientsDb,
//   months: MonthsDb
// ) {
//   const recipeMonthsId: { [id: string]: boolean } = {};
//   for (const monthId in months) {
//     // Assume month is present by default
//     recipeMonthsId[monthId] = true;
//     for (const ingredientId in recipes[recipeId].ingredients) {
//       if (
//         ingredients[ingredientId].months === undefined ||
//         !(monthId in ingredients[ingredientId].months!)
//       ) {
//         // Remove the month if it's not present for one ingredient
//         recipeMonthsId[monthId] = false;
//       }
//     }
//   }

//   const recipeMonths: { [id: string]: string } = {};
//   for (const monthId in recipeMonthsId) {
//     if (recipeMonthsId[monthId] === true) {
//       recipeMonths[monthId] = months[monthId].name;
//     }
//   }

//   return recipeMonths;
// }
