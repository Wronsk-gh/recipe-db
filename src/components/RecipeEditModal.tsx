import { useState, useContext, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RtdbContext } from './RtdbContext';
import { updateRecipeDisplayUserDb } from '../rtdb';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { TagBox } from './TagBox';
import { TagBadge } from '../db-types';
import { ComboSelect } from './ComboSelect';
import { useGetAllIngredients } from '../hooks/useGetAllIngredients';
import { useGetAllTags } from '../hooks/useGetAllTags';
import { useGetIngredientsDbQuery } from '../hooks/useGetIngredientsDbQuery';
import { useGetTagsDbQuery } from '../hooks/useGetTagsDbQuery';
import { useGetRecipe } from '../hooks/useGetRecipe';
import { Recipe } from '../db-types';
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
  // Get QueryClient from the context
  const queryClient = useQueryClient();
  // Get the Rtdb from the context
  const rtdbCred = useContext(RtdbContext);

  const recipeMutation = useMutation({
    mutationFn: async (newRecipe: Recipe) => {
      await updateRecipeDisplayUserDb(rtdbCred, newRecipe);
    },
    onError: () => {
      window.alert('Could not update...');
    },
    onSuccess: onRecipeMutationSuccess,
    onSettled: () => {
      recipeMutation.reset();
    },
  });

  function onRecipeMutationSuccess() {
    // Force an update of the recipes
    queryClient.invalidateQueries({ queryKey: ['recipes'] });
  }

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

  // const ingredientsTagBadges = displayedObject.ingredients
  //   .asArray()
  //   .map((ingredient) => {
  //     return (
  //       <TagBox
  //         tag={{ id: ingredient.id, name: ingredient.name }}
  //         onClose={(tag: TagBadge) => {
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
