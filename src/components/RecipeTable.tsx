import '../App.css';
import { Database } from 'firebase/database';
import { Months, Ingredients, Recipes, Recipe } from '../db-types';
import { RecipeRow } from './RecipeRow';
import Fuse from 'fuse.js';

export function RecipeTable({
  months,
  ingredients,
  recipes,
  filterText,
}: {
  months: Months;
  ingredients: Ingredients;
  recipes: Recipes;
  filterText: string;
}) {
  const rows = [];
  const headers = [];
  const fuseOptions = {
    // isCaseSensitive: false,
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    // threshold: 0.6,
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: ['title', 'author.firstName'],
  };

  headers.push(<th key="name">Recipes</th>);
  headers.push(<th key="ingredients">Ingredients</th>);
  headers.push(<th key="months">Months</th>);

  const fuse = new Fuse(Object.values(recipes), fuseOptions);

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
    // break;
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
