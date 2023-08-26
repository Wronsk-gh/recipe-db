export interface Months {
  [monthId: string]: {
    name: string
  };
};

export interface Ingredients {
  [ingredientId: string]: {
    months: {
      [monthId: string]: boolean
    },
    name: string
  };
};

export interface Ingredient {
  ingredientId: string,
  months: {
    [monthId: string]: boolean
  },
  name: string
};
