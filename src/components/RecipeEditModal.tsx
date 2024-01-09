import { useState, useContext, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RtdbContext } from './RtdbContext';
import { updateRecipeDisplayUserDb } from '../rtdb';
import { Recipe } from '../models/Recipe';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { TagBox } from './TagBox';
import { Tag } from '../db-types';

export function RecipeEditModal({
  recipe,
  onClose,
}: {
  recipe: Recipe;
  onClose: () => void;
}) {
  const [initialObject, setInitialObject] = useState<Recipe>(recipe);
  const [displayedObject, setDisplayedObject] = useState<Recipe>(recipe);
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');
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

  const options = recipe.allIngredients
    .asArray()
    .sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (b.name > a.name) {
        return -1;
      }
      return 0;
    })
    .map((ingredient) => (
      <option value={ingredient.id} key={ingredient.id}>
        {ingredient.name}
      </option>
    ));

  const ingredientsTags = displayedObject.ingredients
    .asArray()
    .map((ingredient) => {
      return (
        <TagBox
          tag={{ id: ingredient.id, name: ingredient.name }}
          onClose={(tag: Tag) => {
            const newDisplayedObject = displayedObject.getCopy();
            newDisplayedObject.ingredients.removeItem(tag.id);
            setDisplayedObject(newDisplayedObject);
          }}
          key={ingredient.id}
        />
      );
    });

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Remove</Modal.Title>
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
            <form>
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
            </form>
            {ingredientsTags}
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
            </button>
          </div>

          <br />
          <button onClick={onClose}>Cancel edit</button>
          <button
            onClick={() => {
              // Check that the upstrem object is still identical to the initial one
              if (displayedObject.isEqual(initialObject)) {
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
          </button>
        </div>
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
