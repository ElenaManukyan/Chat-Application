import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import React, { useEffect, useState, useRef } from 'react';

const RenameChannel = ({ isOpen, onClose, onRename, channelId, currChannelName }) => {
  const [newChannelName, setNewChannelName] = useState(currChannelName || '');
  const inputRef = useRef(null);

  useEffect(() => {
      if (isOpen) {
          setNewChannelName(currChannelName || '');
          if (inputRef.current) {
              setTimeout(() => {
                  inputRef.current.focus();
                  inputRef.current.select();
              }, 0);
          }
      }
  }, [isOpen, currChannelName]);

  const handleSubmit = (e) => {
      e.preventDefault();
      onRename(channelId, { name: newChannelName });
      onClose();
  };

  return (
      <Modal show={isOpen} onHide={onClose} centered>
          <Modal.Header closeButton>
              <Modal.Title>Переименовать канал</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Control
                          ref={inputRef}
                          type="text"
                          value={newChannelName}
                          onChange={(e) => setNewChannelName(e.target.value)}
                          autoFocus
                      />
                  </Form.Group>
              </Form>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={onClose}>
                  Отменить
              </Button>
              <Button variant="primary" type="submit" onClick={handleSubmit}>
                  Отправить
              </Button>
          </Modal.Footer>
      </Modal>
  );
};

export default RenameChannel;
