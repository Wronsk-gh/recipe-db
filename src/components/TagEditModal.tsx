import { useState, useMemo } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Tag } from '../db-types';
import { useGetTag } from '../hooks/useGetTag';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { useTagMutation } from '../hooks/useTagMutation';

export function TagEditModal({
  tagId,
  onClose,
}: {
  tagId: string;
  onClose: () => void;
}) {
  const tag = useGetTag(tagId);
  const [initialObject, setInitialObject] = useState<Tag>(cloneDeep(tag));
  const [displayedObject, setDisplayedObject] = useState<Tag>(cloneDeep(tag));
  const tagMutation = useTagMutation();

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit tag</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <input
            value={displayedObject.name}
            onChange={(newValue) => {
              const newDisplayedObject = cloneDeep(displayedObject);
              newDisplayedObject.name = newValue.target.value;
              setDisplayedObject(newDisplayedObject);
            }}
          />
          <br />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            // Check that the upstream object is still identical to the initial one
            if (!isEqual(tag, initialObject)) {
              alert('Object was modified by another user !!!');
            } else {
              if (tagMutation.isIdle) {
                tagMutation.mutate(displayedObject);
                onClose();
              } else {
                alert('Object is already being modified !!!');
              }
            }
          }}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
