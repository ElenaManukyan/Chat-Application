import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React from 'react';
import { useTranslation } from 'react-i18next';

const RemoveModal = ({ isOpen, onClose, onDelete, channelId }) => {
  const { t } = useTranslation();

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.channels.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('chat.channels.areYouSure')}</p>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={onClose} className="me-2">
            {t('chat.channels.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onDelete(channelId);
              onClose();
            }}
          >
            {t('chat.channels.remove')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveModal;
