import { useState } from 'react';
import { createPortal } from 'react-dom';
import { MonthBarOld } from './MonthBarOld';
import { MonthBar } from './MonthBar';
import { Ingredient } from '../db-types';
import { useGetMonthsDbQuery } from '../hooks/useGetMonthsDbQuery';
import Card from 'react-bootstrap/Card';

export function IngredientRow({
  ingredient, // onEdit,
}: {
  ingredient: Ingredient;
  // onEdit: (ingredientToEdit: Ingredient) => void;
}) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { data: months } = useGetMonthsDbQuery();

  // const cells = [];
  // const nameCell = <td key="name">{ingredient.name}</td>;
  // const monthsCell = (
  //   <td key="months">
  //     <MonthBarOld
  //       months={months}
  //       recipeMonthsId={ingredient.months.reduce<{
  //         [monthId: string]: boolean;
  //       }>((monthsIds, monthId) => {
  //         monthsIds[monthId] = true;
  //         return monthsIds;
  //       }, {})}
  //     />
  //   </td>
  // );

  // cells.push(nameCell);
  // cells.push(monthsCell);
  // cells.push(
  //   <td key="editButton">
  //     <button
  //       onClick={() => {
  //         onEdit(ingredient);
  //       }}
  //     >
  //       Edit
  //     </button>
  //   </td>
  // );

  // return <tr>{cells}</tr>;

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
          <h5 className="card-title mb-3">{ingredient.name}</h5>
          <div className="mb-2 text-center">
            <MonthBar selectedMonths={ingredient.months} />
          </div>
          {/* {recipeIngredients} */}
          <Card.Text></Card.Text>
          {editButton}
        </Card.Body>
        {/* <div className="text-center">
          <img
            // src={recipe.thumbnailLink}
            // src={''}
            src={thumbnail}
            className="card-img-bottom"
            alt="Loading..."
            style={{ objectFit: 'cover', width: '200px' }}
          />
        </div> */}
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
