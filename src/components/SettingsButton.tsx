import { useQueryClient } from '@tanstack/react-query';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState, useContext } from 'react';
import { RtdbContext } from './RtdbContext';
import { fetchDriveFolderId } from '../rtdb';

export function DriveSyncButton() {
  const rtdbCred = useContext(RtdbContext);
  const [driveFolderId, setDriveFolderId] = useState<string | undefined>(
    undefined
  );
  const [show, setShow] = useState<boolean>(false);
  // Get QueryClient from the context
  const queryClient = useQueryClient();

  async function onButtonClick() {
    setDriveFolderId(await fetchDriveFolderId(rtdbCred));
    setShow(true);
  }

  function handleEditClose() {
    setShow(false);
  }

  async function handleEditAccept() {}

  return (
    <>
      <button onClick={onButtonClick}>Edit Settings</button>

      <Modal show={show} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add</Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditAccept}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
