import { ComponentType, useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { NamedObject } from "../db-types";
import _ from 'lodash';

export function ObjectEditor<T extends NamedObject>({
  objectToEdit,
  objectMutation,
  EditForm,
  onEditEnd,
}: {
  objectToEdit: T;
  objectMutation: UseMutationResult<void, unknown, T, unknown>;
  EditForm: ComponentType;
  onEditEnd: () => void;
}) {
  // TODO do I really need to clone here ? I have the feeling that I have to, to avoid editing the object from the prop (see experiment_snippet to demonstrate)
  const [initialObject, setInitialObject] = useState<T>(_.cloneDeep(objectToEdit));
  const [displayedObject, setDisplayedObject] = useState<T>(_.cloneDeep(objectToEdit));

  return (
    <div>
      {objectToEdit.name}
      <br />
      <EditForm />
      <br />
      <button onClick={onEditEnd}>Cancel edit</button>
      <button
        onClick={() => {
          // Check that the upstrem object is still identical to the initial one
          if (!_.isEqual(objectToEdit, initialObject)) {
            alert('Object was modified by another user !!!');
          } else {
            if (objectMutation.isIdle) {
              objectMutation.mutate(
                displayedObject
              );
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
