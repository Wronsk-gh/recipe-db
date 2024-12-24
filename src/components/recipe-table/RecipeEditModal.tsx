import { useState, useMemo } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { TagBox } from '../ui/TagBox';
import { TagBadge } from '../../models/db-types';
import { ComboSelect } from '../ui/ComboSelect';
import { useGetAllIngredients } from '../../hooks/ingredient/useGetAllIngredients';
import { useGetAllTags } from '../../hooks/tag/useGetAllTags';
import { useGetIngredientsDbQuery } from '../../hooks/ingredient/useGetIngredientsDbQuery';
import { useGetTagsDbQuery } from '../../hooks/tag/useGetTagsDbQuery';
import { useGetRecipe } from '../../hooks/recipe/useGetRecipe';
import { useRecipeMutation } from '../../hooks/recipe/useRecipeMutation';
import { Recipe } from '../../models/db-types';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

export function RecipeEditModal({
  recipeId,
  onClose,
}: {
  recipeId: string;
  onClose: () => void;
}) {
  const recipe = useGetRecipe(recipeId);
  const [initialObject, setInitialObject] = useState<Recipe>(cloneDeep(recipe));
  const [displayedObject, setDisplayedObject] = useState<Recipe>(
    cloneDeep(recipe)
  );
  const { data: ingredientsDb } = useGetIngredientsDbQuery();
  const { data: tagsDb } = useGetTagsDbQuery();
  const allIngredients = useGetAllIngredients();
  const allTags = useGetAllTags();
  // const [selectedIngredient, setSelectedIngredient] = useState<string>('');

  const recipeMutation = useRecipeMutation();

  const ingredientsArray = allIngredients.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (b.name > a.name) {
      return -1;
    }
    return 0;
  });

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
        <Modal.Title>Edit recipe</Modal.Title>
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
              itemsArray={ingredientsArray}
              initialItems={recipe.ingredients.map((id) => {
                return {
                  id: id,
                  name: ingredientsDb[id]?.name,
                };
              })}
              label={'Ingredients'}
              onNewSelectedItems={(newSelectedItems) => {
                // TODO
                // column.setFilterValue(newSelectedItems.map((item) => item.id));
                const newDisplayedObject = cloneDeep(displayedObject);
                newDisplayedObject.ingredients = newSelectedItems.map(
                  (selItem) => selItem.id
                );
                setDisplayedObject(newDisplayedObject);
              }}
            />

            <ComboSelect
              itemsArray={tagsArray}
              initialItems={recipe.tags.map((id) => {
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
            {/* {ingredientsTagBadges}
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
            if (!isEqual(recipe, initialObject)) {
              alert('Object was modified by another user !!!');
            } else {
              if (recipeMutation.isIdle) {
                recipeMutation.mutate(displayedObject);
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
