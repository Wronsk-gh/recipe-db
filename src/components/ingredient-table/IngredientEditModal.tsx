import { useState, useMemo } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ComboSelect } from '../ui/ComboSelect';
import { useGetAllMonths } from '../../hooks/month/useGetAllMonths';
import { useGetMonthsDbQuery } from '../../hooks/month/useGetMonthsDbQuery';
import { useGetIngredient } from '../../hooks/ingredient/useGetIngredient';
import { Ingredient } from '../../db-types';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { useGetAllTags } from '../../hooks/tag/useGetAllTags';
import { useGetTagsDbQuery } from '../../hooks/tag/useGetTagsDbQuery';
import { useIngredientMutation } from '../../hooks/ingredient/useIngredientMutation';

export function IngredientEditModal({
  ingredientId,
  onClose,
}: {
  ingredientId: string;
  onClose: () => void;
}) {
  const ingredient = useGetIngredient(ingredientId);
  const [initialObject, setInitialObject] = useState<Ingredient>(
    cloneDeep(ingredient)
  );
  const [displayedObject, setDisplayedObject] = useState<Ingredient>(
    cloneDeep(ingredient)
  );
  const { data: monthsDb } = useGetMonthsDbQuery();
  const { data: tagsDb } = useGetTagsDbQuery();
  const allMonths = useGetAllMonths();
  const allTags = useGetAllTags();
  const ingredientMutation = useIngredientMutation();

  const monthsArray = allMonths;

  const tagsArray = allTags.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (b.name > a.name) {
      return -1;
    }
    return 0;
  });

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit ingredient</Modal.Title>
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

          <div>
            <ComboSelect
              itemsArray={monthsArray}
              initialItems={ingredient.months.map((id) => {
                return {
                  id: id,
                  name: monthsDb[id]?.name,
                };
              })}
              label={'Months'}
              onNewSelectedItems={(newSelectedItems) => {
                // TODO
                // column.setFilterValue(newSelectedItems.map((item) => item.id));
                const newDisplayedObject = cloneDeep(displayedObject);
                newDisplayedObject.months = newSelectedItems.map(
                  (selItem) => selItem.id
                );
                setDisplayedObject(newDisplayedObject);
              }}
            />

            <ComboSelect
              itemsArray={tagsArray}
              initialItems={ingredient.tags.map((id) => {
                return {
                  id: id,
                  name: tagsDb[id]?.name,
                };
              })}
              label={'Tags'}
              onNewSelectedItems={(newSelectedItems) => {
                // TODO
                // column.setFilterValue(newSelectedItems.map((item) => item.id));
                const newDisplayedObject = cloneDeep(displayedObject);
                newDisplayedObject.tags = newSelectedItems.map(
                  (selItem) => selItem.id
                );
                setDisplayedObject(newDisplayedObject);
              }}
            />
          </div>
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
            if (!isEqual(ingredient, initialObject)) {
              alert('Object was modified by another user !!!');
            } else {
              if (ingredientMutation.isIdle) {
                ingredientMutation.mutate(displayedObject);
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
