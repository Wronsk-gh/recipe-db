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
  tags?: {
    [tagId: string]: boolean;
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
  tags: IdsList;
};

export type Recipe = {
  id: string;
  name: string;
  google_id: string;
  ingredients: IdsList;
  months: IdsList;
  tags: IdsList;
};
