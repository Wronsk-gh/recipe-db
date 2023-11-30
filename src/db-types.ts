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

export interface Ingredient {
  ingredientId: string;
  months?: {
    [monthId: string]: boolean;
  };
  name: string;
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
