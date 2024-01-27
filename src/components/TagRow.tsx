import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Tag } from '../db-types';
import Card from 'react-bootstrap/Card';
import { TagEditModal } from './TagEditModal';

export function TagRow({
  tag, // onEdit,
}: {
  tag: Tag;
  // onEdit: (ingredientToEdit: Ingredient) => void;
}) {
  const [showModal, setShowModal] = useState<boolean>(false);

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
              <h5 className="card-title mb-3">{tag.name}</h5>
            </div>
            <div className="col-md-4">{editButton}</div>
          </div>
          <Card.Text></Card.Text>
        </Card.Body>
      </Card>
      {showModal &&
        createPortal(
          <TagEditModal tagId={tag.id} onClose={() => setShowModal(false)} />,
          document.body
        )}
    </>
  );
}
