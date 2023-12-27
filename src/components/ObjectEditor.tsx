import { useState, ReactNode } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { ObjectWithName } from '../db-types';
import _ from 'lodash';

interface PropsEditForm<T> {
  displayedObject: T;
  onDisplayedObjectChange: (newObj: T) => void;
}

export function ObjectEditor<T extends ObjectWithName>({
  objectToEdit,
  objectMutation,
  renderEditForm,
  onEditEnd,
}: {
  objectToEdit: T;
  objectMutation: UseMutationResult<void, unknown, T, unknown>;
  renderEditForm: (props: PropsEditForm<T>) => ReactNode;
  onEditEnd: () => void;
}) {
  // TODO do I really need to clone here ? I have the feeling that I have to, to avoid editing the object from the prop (see experiment_snippet to demonstrate)
  const [initialObject, setInitialObject] = useState<T>(
    _.cloneDeep(objectToEdit)
  );
  const [displayedObject, setDisplayedObject] = useState<T>(
    _.cloneDeep(objectToEdit)
  );

  return (
    <div>
      {objectToEdit.name}
      <br />
      {renderEditForm({
        displayedObject: displayedObject,
        onDisplayedObjectChange: (newObj) => {
          setDisplayedObject(newObj);
        },
      })}
      <br />
      <button onClick={onEditEnd}>Cancel edit</button>
      <button
        onClick={() => {
          // Check that the upstrem object is still identical to the initial one
          if (!_.isEqual(objectToEdit, initialObject)) {
            alert('Object was modified by another user !!!');
          } else {
            if (objectMutation.isIdle) {
              objectMutation.mutate(displayedObject);
              onEditEnd();
            } else {
              alert('Object is already being modified !!!');
            }
          }
        }}
      >
        Submit
      </button>
    </div>
  );
}
