import { useState } from 'react';
import { createPortal } from 'react-dom';
import { MonthBar } from './MonthBar';
import { Ingredient } from '../db-types';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import { IngredientEditModal } from './IngredientEditModal';
import { useGetTagsDbQuery } from '../hooks/useGetTagsDbQuery';
import { useGetIngredient } from '../hooks/useGetIngredient';

export function IngredientRow({ ingredientId }: { ingredientId: string }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { data: tagsDb } = useGetTagsDbQuery();
  const ingredient = useGetIngredient(ingredientId);

  // Create a badge for each tag of the ingredient
  const ingredientTags = ingredient.tags.map((tagId) => {
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
          <div className="row no-gutters">
            <div className="col-md-6">
              <h5 className="card-title mb-3">{ingredient.name}</h5>
            </div>
            <div className="col-md-12">
              <MonthBar selectedMonths={ingredient.months} />
            </div>
            {ingredientTags}
            <div className="col-md-4">{editButton}</div>
          </div>
          {/* <div className="mb-2 text-center">
            <MonthBar selectedMonths={ingredient.months} />
          </div> */}
          {/* {recipeIngredients} */}
          <Card.Text></Card.Text>
          {/* {editButton} */}
        </Card.Body>
      </Card>
      {showModal &&
        createPortal(
          <IngredientEditModal
            ingredientId={ingredient.id}
            onClose={() => setShowModal(false)}
          />,
          document.body
        )}
    </>
  );
}
