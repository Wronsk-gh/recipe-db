import { useState, useContext, useMemo } from 'react';
import { Recipe } from '../db-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export function RecipeEditModal({
  editedItem,
  onClose,
}: {
  editedItem: Recipe | null;
  onClose: () => void;
}) {
  return (
    <Modal show={editedItem !== null} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Remove</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ObjectEditor
          objectToEdit={editedItem}
          objectMutation={recipeMutation}
          renderEditForm={(props) => {
            return <RecipeEditForm {...props} ingredients={ingredients} />;
          }}
          onEditEnd={onClose}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        {/* <Button variant="primary" onClick={handleRemoveAccept}>
            Remove
          </Button> */}
      </Modal.Footer>
    </Modal>
  );
}
