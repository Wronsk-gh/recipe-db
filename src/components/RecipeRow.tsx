import { useState } from 'react';
import { createPortal } from 'react-dom';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { RecipeEditModal } from './RecipeEditModal';
import Card from 'react-bootstrap/Card';
import { MonthBar } from './MonthBar';
import { useGetRecipe } from '../hooks/useGetRecipe';
import { useGetIngredientsDbQuery } from '../hooks/useGetIngredientsDbQuery';
import { useGetTagsDbQuery } from '../hooks/useGetTagsDbQuery';
import { useGetRecipeThumbnail } from '../hooks/useGetRecipeThumbnail';
import { useRecipeMutation } from '../hooks/useRecipeMutation';

export function RecipeRow({ recipeId }: { recipeId: string }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { data: ingredientsDb } = useGetIngredientsDbQuery();
  const { data: tagsDb } = useGetTagsDbQuery();
  const recipe = useGetRecipe(recipeId);
  const editableRecipe = useGetRecipe(recipeId);
  const thumbnail = useGetRecipeThumbnail(recipe);
  const recipeMutation = useRecipeMutation();

  // Create a badge for each ingredient of the recipe
  const recipeIngredients = recipe.ingredients.map((ingredientId) => {
    return (
      <Badge pill bg="primary" key={ingredientId}>
        {ingredientsDb[ingredientId]?.name}
      </Badge>
    );
  });

  // Create a badge for each tag of the recipe
  const recipeTags = recipe.tags.map((tagId) => {
    return (
      <Badge pill bg="secondary" key={tagId}>
        {tagsDb[tagId]?.name}
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
          <Button
            variant={recipe.isFavourite ? 'primary' : 'secondary'}
            onClick={() => {
              editableRecipe.isFavourite = !recipe.isFavourite;
              if (recipeMutation.isIdle) {
                recipeMutation.mutate(editableRecipe);
              } else {
                alert('Object is already being modified !!!');
              }
            }}
          >
            Fav
          </Button>
          <div className="mb-2 text-center">
            <MonthBar selectedMonths={recipe.months} />
          </div>
          {recipeIngredients}
          {recipeTags}
          <Card.Text></Card.Text>
          {editButton}
        </Card.Body>
        <div className="text-center">
          <img
            // src={recipe.thumbnailLink}
            // src={''}
            src={thumbnail}
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
