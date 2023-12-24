import {
  Months,
  Ingredients,
  Recipe,
  getRecipeIngredients,
  getRecipeMonths,
} from '../db-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { MonthBar } from './MonthBar';

export function RecipeRow({
  months,
  ingredients,
  recipe,
  onEdit,
  filterText,
  monthFilter,
}: {
  months: Months;
  ingredients: Ingredients;
  recipe: Recipe;
  onEdit: (recipeToEdit: Recipe) => void;
  filterText: string;
  monthFilter: string;
}) {
  const recipeMonthsId: {
    [monthId: string]: boolean;
  } = {};

  // Ingredients cell content
  // create the list of ingredient name
  const recipeIngredients = Object.entries(
    getRecipeIngredients(recipe, ingredients)
  ).map(([ingredientId, ingredientName]) => {
    return (
      <Badge pill bg="primary" key={ingredientId}>
        {ingredientName}
      </Badge>
    );
  });
  // ingredientsCell = (
  //   <Col key="ingredients">
  //     <Stack gap={3}>{recipeIngredients}</Stack>
  //   </Col>
  // );

  // Months cell content
  // Intersect all monthsId
  for (const monthId in months) {
    // Assume month is present by default
    recipeMonthsId[monthId] = true;
    for (const ingredientId in recipe.ingredients) {
      if (
        ingredients[ingredientId].months === undefined ||
        !(monthId in ingredients[ingredientId].months)
      ) {
        // Remove the month if it's not present for one ingredient
        recipeMonthsId[monthId] = false;
      }
    }
  }
  // // Build the list of months
  // // Cycle from the months definition to keep the order
  // for (const monthId in months) {
  //   if (recipeMonthsId[monthId] === true) {
  //     recipeMonths.push(<li key={monthId}>{months[monthId].name}</li>);
  //   }
  // }
  // monthsCell = <Col key="months">{recipeMonths}</Col>;

  // Push all the cells into the row
  // cells.push(nameCell);
  // cells.push(ingredientsCell);
  // cells.push(monthsCell);
  const editButton = (
    <button
      onClick={() => {
        onEdit(recipe);
      }}
    >
      Edit
    </button>
  );
  // cells.push(<Col key="editButton"></Col>);

  // Name cell content
  // thumbnail = <img src={recipe.thumbnailLink} width="150px" alt="Loading..." />;
  const recipeCard = (
    <Card style={{ width: '22rem' }} bg="light">
      <Card.Body>
        <h5 className="card-title mb-3">
          <a
            href={'https://docs.google.com/document/d/' + recipe.google_id}
            target="_blank"
            style={{ color: 'black', textDecoration: 'none' }}
          >
            {recipe.name}
          </a>
        </h5>
        <div className="mb-2 text-center">
          <MonthBar months={months} recipeMonthsId={recipeMonthsId} />
        </div>
        {recipeIngredients}
        <Card.Text></Card.Text>
        {editButton}
      </Card.Body>
      <div className="text-center">
        <img
          src={recipe.thumbnailLink}
          className="card-img-bottom"
          alt="Loading..."
          style={{ objectFit: 'cover', width: '200px' }}
        />
      </div>
    </Card>
  );

  // See if filter allows display
  if (
    (monthFilter === '' || recipeMonthsId[monthFilter] === true) &&
    recipe.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
  ) {
    return recipeCard;
  } else {
    return null;
  }
}
