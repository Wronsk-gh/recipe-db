import '../App.css';
import { Database } from 'firebase/database';
import { Months, Ingredients, Recipes } from '../db-types';
import { RecipeRow } from './RecipeRow';

export function RecipeTable({
  db,
  months,
  ingredients,
  recipes,
}: {
  db: Database | undefined;
  months: Months | undefined;
  ingredients: Ingredients | undefined;
  recipes: Recipes | undefined;
}) {
  return <div></div>;
}
