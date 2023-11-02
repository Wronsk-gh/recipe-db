import '../App.css';
import {
  Months,
  Ingredients,
  Recipes,
  Recipe,
  RecipesThumbnails,
} from '../db-types';
import { RecipeRow } from './RecipeRow';

export function RecipeTable({
  months,
  ingredients,
  recipes,
  recipesThumbnails,
  filterText,
}: {
  months: Months;
  ingredients: Ingredients;
  recipes: Recipes;
  recipesThumbnails: RecipesThumbnails;
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

  for (const recipeId in recipes) {
    const thumbnailLink =
      recipesThumbnails[recipeId] !== undefined
        ? recipesThumbnails[recipeId]
        : '';
    const recipe: Recipe = {
      ...recipes[recipeId],
      recipeId: recipeId,
      thumbnailLink: thumbnailLink,
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
