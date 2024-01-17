import { IngredientsDb } from '../db-types';
import { IdItemCollection } from './IdItemCollection';
import { Month } from './Month';

export class Ingredient {
  ingredientsDb: IngredientsDb;
  allMonths: IdItemCollection<Month>;
  id: string;
  name: string;
  months: IdItemCollection<Month>;

  constructor(
    id: string,
    ingredientsDb: IngredientsDb,
    allMonths: IdItemCollection<Month>
  ) {
    this.id = id;
    this.allMonths = allMonths;
    this.ingredientsDb = ingredientsDb;
    this.name = ingredientsDb[id].name;
    this.months = getIngredientMonths(id, ingredientsDb, allMonths);
  }
}

function getIngredientMonths(
  ingredientId: string,
  ingredientsDb: IngredientsDb,
  allMonths: IdItemCollection<Month>
) {
  const months = new IdItemCollection<Month>();
  for (const ingredientMonthId in ingredientsDb[ingredientId].months) {
    const month = allMonths.getItem(ingredientMonthId);
    if (month !== undefined) {
      months.addItem(month);
    } else {
      console.error(
        `Ingredient ${ingredientsDb[ingredientId].name} has a monthId ${ingredientMonthId} which could not be found in the list of months.`
      );
    }
  }
  return months;
}
