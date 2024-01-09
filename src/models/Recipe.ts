import { RecipeDb, RecipesDb } from '../db-types';
import { IdItemCollection } from './IdItemCollection';
import { Month } from './Month';
import { Ingredient } from './Ingredient';

export class Recipe {
  recipesDb: RecipesDb;
  allIngredients: IdItemCollection<Ingredient>;
  allMonths: IdItemCollection<Month>;
  id: string;
  name: string;
  google_id: string;
  thumbnailLink: string;
  ingredients: IdItemCollection<Ingredient>;
  months: IdItemCollection<Month>;

  constructor(
    id: string,
    recipesDb: RecipesDb,
    thumbnailLink: string,
    allIngredients: IdItemCollection<Ingredient>,
    allMonths: IdItemCollection<Month>
  ) {
    this.recipesDb = recipesDb;
    this.allIngredients = allIngredients;
    this.allMonths = allMonths;
    this.id = id;
    this.name = recipesDb[id].name;
    this.google_id = recipesDb[id].google_id;
    this.thumbnailLink = thumbnailLink;
    this.ingredients = getRecipeIngredients(id, recipesDb, allIngredients);
    this.months = getRecipeMonths(this.ingredients, allMonths);
  }

  getDbRepr(): RecipeDb {
    const recipeDb: RecipeDb = {
      name: this.name,
      google_id: this.google_id,
      ingredients: {},
    };
    for (const ingredientId of this.ingredients.IdsAsArray()) {
      recipeDb.ingredients![ingredientId] = true;
    }

    return recipeDb;
  }

  getCopy(): Recipe {
    return new Recipe(
      this.id,
      this.recipesDb,
      this.thumbnailLink,
      this.allIngredients,
      this.allMonths
    );
  }

  isEqual(otherRecipe: Recipe): boolean {
    // No comparison of recipesDb
    // if (this.recipesDb !== otherRecipe.recipesDb) {
    //   return false;
    // }
    if (!this.allIngredients.hasSameIdsList(otherRecipe.allIngredients)) {
      return false;
    }
    if (!this.allMonths.hasSameIdsList(otherRecipe.allMonths)) {
      return false;
    }
    if (this.id !== otherRecipe.id) {
      return false;
    }
    if (this.name !== otherRecipe.name) {
      return false;
    }
    if (this.google_id !== otherRecipe.google_id) {
      return false;
    }
    // No comparison of thumbnailLink
    // if (this.thumbnailLink !== otherRecipe.thumbnailLink) {
    //   return false;
    // }
    if (!this.ingredients.hasSameIdsList(otherRecipe.ingredients)) {
      return false;
    }
    if (!this.months.hasSameIdsList(otherRecipe.months)) {
      return false;
    }
    return true;
  }
}

function getRecipeIngredients(
  recipeId: string,
  recipesDb: RecipesDb,
  allIngredients: IdItemCollection<Ingredient>
) {
  const ingredients = new IdItemCollection<Ingredient>();
  for (const ingredientId in recipesDb[recipeId].ingredients) {
    const ingredient = allIngredients.getItem(ingredientId);
    if (ingredient !== undefined) {
      ingredients.addItem(ingredient);
    } else {
      console.error(
        `Recipe ${recipesDb[recipeId].name} has an ingredientId ${ingredientId} which could not be found in the list of ingredients.`
      );
    }
  }
  return ingredients;
}

function getRecipeMonths(
  ingredients: IdItemCollection<Ingredient>,
  allMonths: IdItemCollection<Month>
) {
  const months = new IdItemCollection<Month>();
  for (const month of allMonths.asArray()) {
    // Assume month is present by default
    let isPresent = true;
    for (const ingredient of ingredients.asArray()) {
      if (!ingredient.months.isItemIn(month)) {
        // Remove the month if it's not present for one ingredient
        isPresent = false;
      }
    }
    if (isPresent) {
      months.addItem(month);
    }
  }

  return months;
}
