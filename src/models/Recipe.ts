import { RecipesDb } from '../db-types';
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
  ingredients: IdItemCollection<Ingredient>;
  months: IdItemCollection<Month>;

  constructor(
    id: string,
    recipesDb: RecipesDb,
    allIngredients: IdItemCollection<Ingredient>,
    allMonths: IdItemCollection<Month>
  ) {
    this.recipesDb = recipesDb;
    this.allIngredients = allIngredients;
    this.allMonths = allMonths;
    this.id = id;
    this.name = recipesDb[id].name;
    this.google_id = recipesDb[id].name;
    this.ingredients = getRecipeIngredients(id, recipesDb, allIngredients);
    this.months = getRecipeMonths(this.ingredients, allMonths);
  }
}

export function getRecipeIngredients(
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

export function getRecipeMonths(
  ingredients: IdItemCollection<Ingredient>,
  allMonths: IdItemCollection<Month>
) {
  const months = new IdItemCollection<Month>();
  for (const month of allMonths.iter()) {
    // Assume month is present by default
    let isPresent = true;
    for (const ingredient of ingredients.iter()) {
      if (ingredient.months.isItemIn(month)) {
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
