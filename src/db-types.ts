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
}
