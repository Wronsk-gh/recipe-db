import '../App.css';
import { Database } from 'firebase/database';
import { Months, Ingredients, Recipes, Recipe } from '../db-types';
import { RecipeRow } from './RecipeRow';

export function RecipeTable({
  months,
  ingredients,
  recipes,
}: {
  months: Months | undefined;
  ingredients: Ingredients | undefined;
  recipes: Recipes | undefined;
}) {
  const rows = [];
  const headers = [];

  headers.push(<th key="name">Recipes</th>);
  headers.push(<th key="ingredients">Ingredients</th>);
  headers.push(<th key="months">Months</th>);

  for (const recipeId in recipes) {
    const recipe: Recipe = {
      ...recipes[recipeId],
      recipeId: recipeId,
    };
    rows.push(
      <RecipeRow
        key={recipeId}
        months={months}
        ingredients={ingredients}
        recipe={recipe}
      />
    );
    //break;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
