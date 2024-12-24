import { useQueryClient } from '@tanstack/react-query';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState, useContext } from 'react';
import { RtdbContext } from '../auth/RtdbContext';
import {
  fetchDriveFolderId,
  updateDriveFolderIdDisplayUserDb,
} from '../../models/rtdb';

export function SettingsButton() {
  const rtdbCred = useContext(RtdbContext);
  const [displayedDriveFolderId, setDisplayedDriveFolderId] = useState<
    string | undefined
  >(undefined);
  const [show, setShow] = useState<boolean>(false);
  // Get QueryClient from the context
  const queryClient = useQueryClient();

  async function onButtonClick() {
    setDisplayedDriveFolderId(await fetchDriveFolderId(rtdbCred));
    setShow(true);
  }

  function handleEditClose() {
    setShow(false);
  }

  async function handleEditAccept() {
    if (displayedDriveFolderId !== undefined) {
      await updateDriveFolderIdDisplayUserDb(rtdbCred, displayedDriveFolderId);
    }
    handleEditClose();
  }

  return (
    <>
      <button onClick={onButtonClick}>Edit Settings</button>

      <Modal show={show} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formDriveFolderId">
              <Form.Label>Drive Folder Id:</Form.Label>
              <Form.Control
                type="text"
                value={displayedDriveFolderId}
                placeholder="Enter the ID of the Drive folder..."
                onChange={(e) => setDisplayedDriveFolderId(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditAccept}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
