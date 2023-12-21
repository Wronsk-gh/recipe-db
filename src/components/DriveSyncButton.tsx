import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Recipes } from '../db-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { createRecipeDisplayUserDb } from '../rtdb';
import { useContext } from 'react';
import { RtdbContext } from './RtdbContext';

interface RecipeMutationData {
  google_id: string;
  name: string;
}

export function DriveSyncButton({ recipes }: { recipes: Recipes | undefined }) {
  const rtdbCred = useContext(RtdbContext);
  const [show, setShow] = useState<'nothing' | 'add' | 'remove'>('nothing');
  const [listToAdd, setListToAdd] = useState<{ [id: string]: string }>({});
  const [listToRemove, setListToRemove] = useState<{ [id: string]: string }>(
    {}
  );
  // Get QueryClient from the context
  const queryClient = useQueryClient();
  const newRecipesMutation = useMutation({
    mutationFn: async (data: RecipeMutationData[]) => {
      if (data.length > 0) {
        await createRecipeDisplayUserDb(
          rtdbCred,
          data[0].google_id,
          data[0].name
        );
      }
    },
    onError: () => {
      window.alert('Could not create new recipes...');
    },
    onSuccess: () => {},
    onSettled: () => {
      newRecipesMutation.reset();
    },
  });

  async function onButtonClick() {
    if (recipes === undefined) {
      alert('Did not load the database yet');
      return;
    }
    const rtdbIdsNames = getDbGoogleIdsNames(recipes);
    const driveIdsNames = await getGapiGoogleIdsNames();

    const newIds = arrayDiff(
      Object.keys(driveIdsNames),
      Object.keys(rtdbIdsNames)
    );
    const deletedIds = arrayDiff(
      Object.keys(rtdbIdsNames),
      Object.keys(driveIdsNames)
    );
    setListToAdd(
      newIds.reduce<{ [id: string]: string }>((acc, id) => {
        acc[id] = driveIdsNames[id];
        return acc;
      }, {})
    );
    setListToRemove(
      deletedIds.reduce<{ [id: string]: string }>((acc, id) => {
        acc[id] = rtdbIdsNames[id];
        return acc;
      }, {})
    );
    // alert(
    //   'new : ' + newIds.toString() + '\ndeleted : ' + deletedIds.toString()
    // );
    if (newIds.length !== 0) {
      setShow('add');
    } else if (deletedIds.length !== 0) {
      setShow('remove');
    } else {
      alert('Already synced !');
    }
  }

  function handleAddClose() {
    if (Object.keys(listToRemove).length !== 0) {
      setShow('remove');
    } else {
      setShow('nothing');
    }
  }

  async function handleAddAccept() {
    for (const googleId in listToAdd) {
      // I should have an 'await' here, as I don't want the next screen to be displayed before it is finished + a state to show it's loading + a refetch of recipes at the end
      await createRecipeDisplayUserDb(rtdbCred, googleId, listToAdd[googleId]); // TODO must use a mutation here !
    }
    queryClient.invalidateQueries({ queryKey: ['recipes'] });
    for (const googleId in listToAdd) {
      queryClient.invalidateQueries({ queryKey: ['thumbnail', googleId] });
    }
    handleAddClose();
  }

  function handleRemoveClose() {
    setShow('nothing');
  }
  // return (<><br> {listToAdd[key]}</>);

  return (
    <>
      <button onClick={onButtonClick}>DriveSync</button>

      <Modal show={show === 'add'} onHide={handleAddClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to add :
          {Object.keys(listToAdd).map((key) => {
            return (
              <>
                <br />
                {listToAdd[key]}
              </>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddAccept}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show === 'remove'} onHide={handleRemoveClose}>
        <Modal.Header closeButton>
          <Modal.Title>Remove</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to remove :
          {Object.keys(listToRemove).map((key) => {
            return (
              <>
                <br />
                {listToRemove[key]}
              </>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRemoveClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRemoveClose}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function getDbGoogleIdsNames(recipes: Recipes): { [id: string]: string } {
  // Using an object with keys allow for setting duplicate entries as one
  const idsNamesList: { [id: string]: string } = {};
  for (const recipeId in recipes) {
    idsNamesList[recipes[recipeId].google_id] = recipes[recipeId].name;
  }
  return idsNamesList;
}

async function getGapiGoogleIdsNames(): Promise<{ [id: string]: string }> {
  let response;
  let page_token: string | undefined = '';
  const allFiles: gapi.client.drive.File[] = [];
  // Using an object with keys allow for setting duplicate entries as one
  const idsNamesList: { [id: string]: string } = {};

  try {
    while (true) {
      // Send the request to gdrive api
      response = await gapi.client.drive.files.list({
        pageSize: 500,
        fields: 'nextPageToken,files(id, name)',
        q: "'1-fJ3w31oxP6P1zrHnZXkuCl-f6ACzACI' in parents and trashed=false",
        pageToken: page_token,
      });

      // Get the received files and append them to the list
      const files = response.result.files;
      if (files !== undefined && files.length > 0) {
        allFiles.push(...files);
      }
      // Prepare next request or break out if there are no more items
      page_token = response.result.nextPageToken;
      if (page_token === undefined) {
        break;
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    return {};
  }

  // Create the set of google ids present in the Drive folder
  allFiles.forEach((file) => {
    idsNamesList[file!.id!] = file!.name!;
  });

  return idsNamesList;
}

// Set operation 'A - B' (aka return elements that are present in A, but not in B)
function arrayDiff(A: string[], B: string[]): string[] {
  const filteredArray = A.filter((value) => !B.includes(value));
  return filteredArray;
}
