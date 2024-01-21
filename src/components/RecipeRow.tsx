import { useState } from 'react';
import { createPortal } from 'react-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import { RecipeEditModal } from './RecipeEditModal';
import Card from 'react-bootstrap/Card';
import { MonthBar } from './MonthBar';
import { useGetRecipe } from '../hooks/useGetRecipe';
import { useGetIngredientsDbQuery } from '../hooks/useGetIngredientsDbQuery';

export function RecipeRow({ recipeId }: { recipeId: string }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const recipe = useGetRecipe(recipeId);
  const { data: ingredientsDb } = useGetIngredientsDbQuery();

  // Create a badge for each ingredient of the recipe
  const recipeIngredients = recipe.ingredients.map((ingredientId) => {
    return (
      <Badge pill bg="primary" key={ingredientId}>
        {ingredientsDb[ingredientId].name}
      </Badge>
    );
  });

  const editButton = (
    <button
      onClick={() => {
        setShowModal(true);
      }}
    >
      Edit
    </button>
  );

  return (
    <>
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
            <MonthBar selectedMonths={recipe.months} />
          </div>
          {recipeIngredients}
          <Card.Text></Card.Text>
          {editButton}
        </Card.Body>
        <div className="text-center">
          <img
            // src={recipe.thumbnailLink}
            src={''}
            className="card-img-bottom"
            alt="Loading..."
            style={{ objectFit: 'cover', width: '200px' }}
          />
        </div>
      </Card>
      {showModal &&
        createPortal(
          <RecipeEditModal
            recipeId={recipe.id}
            onClose={() => setShowModal(false)}
          />,
          document.body
        )}
    </>
  );
}
