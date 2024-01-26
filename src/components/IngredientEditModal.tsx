import { useState, useContext, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RtdbContext } from './RtdbContext';
import { updateIngredientDisplayUserDb } from '../rtdb';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { TagBox } from './TagBox';
import { Tag } from '../db-types';
import { ComboSelect } from './ComboSelect';
import { useGetAllMonths } from '../hooks/useGetAllMonths';
import { useGetMonthsDbQuery } from '../hooks/useGetMonthsDbQuery';
import { useGetIngredient } from '../hooks/useGetIngredient';
import { Ingredient } from '../db-types';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

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
  const allMonths = useGetAllMonths();
  // const [selectedIngredient, setSelectedIngredient] = useState<string>('');
  // Get QueryClient from the context
  const queryClient = useQueryClient();
  // Get the Rtdb from the context
  const rtdbCred = useContext(RtdbContext);

  const ingredientMutation = useMutation({
    mutationFn: async (newIngredient: Ingredient) => {
      await updateIngredientDisplayUserDb(rtdbCred, newIngredient);
    },
    onError: () => {
      window.alert('Could not update...');
    },
    onSuccess: onIngredientMutationSuccess,
    onSettled: () => {
      ingredientMutation.reset();
    },
  });

  function onIngredientMutationSuccess() {
    // Force an update of the ingredients
    queryClient.invalidateQueries({ queryKey: ['ingredients'] });
  }

  // const monthsArray = allMonths.sort((a, b) => {
  //   if (a.name > b.name) {
  //     return 1;
  //   }
  //   if (b.name > a.name) {
  //     return -1;
  //   }
  //   return 0;
  // });
  const monthsArray = allMonths;

  // const options = recipe.allIngredients
  //   .asArray()
  //   .sort((a, b) => {
  //     if (a.name > b.name) {
  //       return 1;
  //     }
  //     if (b.name > a.name) {
  //       return -1;
  //     }
  //     return 0;
  //   })
  //   .map((ingredient) => (
  //     <option value={ingredient.id} key={ingredient.id}>
  //       {ingredient.name}
  //     </option>
  //   ));

  // const ingredientsTags = displayedObject.ingredients
  //   .asArray()
  //   .map((ingredient) => {
  //     return (
  //       <TagBox
  //         tag={{ id: ingredient.id, name: ingredient.name }}
  //         onClose={(tag: Tag) => {
  //           const newDisplayedObject = displayedObject.getCopy();
  //           newDisplayedObject.ingredients.removeItem(tag.id);
  //           setDisplayedObject(newDisplayedObject);
  //         }}
  //         key={ingredient.id}
  //       />
  //     );
  //   });

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit ingredient</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <ObjectEditor
          objectToEdit={recipe}
          objectMutation={recipeMutation}
          renderEditForm={(props) => {
            return <RecipeEditForm {...props} ingredients={ingredients} />;
          }}
          onEditEnd={onClose}
        /> */}
        <div>
          {displayedObject.name}
          <br />

          <div>
            {/* <form>
              <label htmlFor="ingredients">Choose an ingredient:</label>
              <select
                name="ingredients"
                onChange={(newValue) =>
                  setSelectedIngredient(newValue.target.value)
                }
              >
                <option value={''} key={''}>
                  {'-'}
                </option>
                {options}
              </select>
            </form> */}
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
            {/* {ingredientsTags}
            <button
              onClick={() => {
                if (selectedIngredient !== '') {
                  if (!displayedObject.ingredients.isIdIn(selectedIngredient)) {
                    const newDisplayedObject = displayedObject.getCopy();
                    const newItem =
                      newDisplayedObject.allIngredients.getItem(
                        selectedIngredient
                      );
                    if (newItem) {
                      newDisplayedObject.ingredients.addItem(newItem);
                    } else {
                      console.error(
                        'Ingredient does not exist in all ingredient list'
                      );
                    }
                    setDisplayedObject(newDisplayedObject);
                  }
                }
              }}
            >
              Add
            </button> */}
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
