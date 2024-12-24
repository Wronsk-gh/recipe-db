import {
  MonthsDb,
  IngredientsDb,
  RecipesDb,
  IdsList,
  IdsDict,
} from './db-types';
import {
  Recipe,
  Ingredient,
  Month,
  IngredientDb,
  RecipeDb,
  TagsDb,
  TagDb,
  Tag,
} from './db-types';

export function getRecipe(
  recipeId: string,
  recipesDb: RecipesDb,
  ingredientsDb: IngredientsDb,
  monthsDb: MonthsDb
) {
  const recipe: Recipe = {
    id: recipeId,
    name: recipesDb[recipeId]?.name,
    google_id: recipesDb[recipeId]?.google_id,
    isFavourite: recipesDb[recipeId]?.isFavourite || false,
    ingredients: getRecipeIngredients(recipeId, recipesDb),
    months: getRecipeMonths(recipeId, recipesDb, ingredientsDb, monthsDb),
    tags: getRecipeTags(recipeId, recipesDb, ingredientsDb),
    thumbnailInfo: recipesDb[recipeId].thumbnailInfo,
  };
  return recipe;
}

export function getIngredient(ingredientId: string, ingredientsDb: MonthsDb) {
  return {
    id: ingredientId,
    name: ingredientsDb[ingredientId]?.name,
    months: getIngredientMonths(ingredientId, ingredientsDb),
    tags: getIngredientTags(ingredientId, ingredientsDb),
  } as Ingredient;
}

export function getMonth(monthId: string, monthsDb: MonthsDb) {
  return {
    id: monthId,
    name: monthsDb[monthId]?.name,
  } as Month;
}

export function getTag(tagId: string, tagsDb: TagsDb) {
  return {
    id: tagId,
    name: tagsDb[tagId]?.name,
  } as Tag;
}

export function getRecipeIngredients(
  recipeId: string,
  recipesDb: RecipesDb
): IdsList {
  return Object.keys(recipesDb[recipeId]?.ingredients || {});
}

export function getRecipeTags(
  recipeId: string,
  recipesDb: RecipesDb,
  ingredientsDb: IngredientsDb
): IdsList {
  const recipeTags = Object.keys(recipesDb[recipeId]?.tags || {});
  const recipeIngredients = getRecipeIngredients(recipeId, recipesDb);
  for (const ingredientId of recipeIngredients) {
    const ingredient = getIngredient(ingredientId, ingredientsDb);
    for (const tagId of ingredient.tags) {
      if (!recipeTags.includes(tagId)) {
        recipeTags.push(tagId);
      }
    }
  }
  return recipeTags;
}

export function getIngredientTags(
  ingredientId: string,
  ingredientsDb: IngredientsDb
): IdsList {
  return Object.keys(ingredientsDb[ingredientId]?.tags || {});
}

export function getIngredientMonths(
  ingredientId: string,
  ingredientsDb: IngredientsDb
): IdsList {
  return Object.keys(ingredientsDb[ingredientId]?.months || {});
}

export function getRecipeMonths(
  recipeId: string,
  recipesDb: RecipesDb,
  ingredientsDb: IngredientsDb,
  monthsDb: MonthsDb
): IdsList {
  const allMonthsId = Object.keys(monthsDb);
  // Consider all months are present to begin with
  const recipeMonths = [...allMonthsId];
  for (const ingredientId of getRecipeIngredients(recipeId, recipesDb)) {
    const ingredientMonths = getIngredientMonths(ingredientId, ingredientsDb);
    for (const monthId of allMonthsId) {
      if (!ingredientMonths.includes(monthId)) {
        // Month is not present for this ingredient, remove it for the recipe if it was present
        const index = recipeMonths.indexOf(monthId);
        if (index !== -1) {
          recipeMonths.splice(index, 1);
        }
      }
    }
  }
  return recipeMonths;
}

export function getTagDbRepr(tag: Tag): TagDb {
  const tagDb: TagDb = {
    name: tag.name,
  };
  return tagDb;
}

export function getIngredientDbRepr(ingredient: Ingredient): IngredientDb {
  const ingredientDb: IngredientDb = {
    name: ingredient.name,
    months: convertIdsListToDict(ingredient.months),
    tags: convertIdsListToDict(ingredient.tags),
  };
  return ingredientDb;
}

export function getRecipeDbRepr(recipe: Recipe): RecipeDb {
  const recipeDb: RecipeDb = {
    ingredients: convertIdsListToDict(recipe.ingredients),
    tags: convertIdsListToDict(recipe.tags),
    name: recipe.name,
    google_id: recipe.google_id,
    isFavourite: recipe.isFavourite,
    thumbnailInfo: recipe.thumbnailInfo,
  };
  return recipeDb;
}

export function convertIdsListToDict(list: IdsList): IdsDict {
  const dict = list.reduce<IdsDict>((dict, id) => {
    dict[id] = true;
    return dict;
  }, {});
  return dict;
}
