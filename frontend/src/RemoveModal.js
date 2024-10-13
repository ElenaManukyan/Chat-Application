import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React from 'react';

const RemoveModal = ({ isOpen, onClose, onDelete, channelId }) => {
    return (
        <Modal show={isOpen} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Удалить канал</Modal.Title>
            </Modal.Header>
            <Modal.Body>Уверены?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Отменить
                </Button>
                <Button variant="danger" onClick={() => {
                    onDelete(channelId);
                    onClose();
                }}>
                    Удалить
                </Button>
            </Modal.Footer>
            
      </Modal>
    )
};

export default RemoveModal;