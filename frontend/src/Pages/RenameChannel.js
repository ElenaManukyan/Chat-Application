import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { useRollbar } from '@rollbar/react';
import { useTranslation } from 'react-i18next';

const RenameChannel = ({
  isOpen, onClose, onRename, channelId, currChName, existingChannels,
}) => {
  const [newChannelName, setNewChannelName] = useState(currChName || '');
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);
  const rollbar = useRollbar();
  const { t } = useTranslation();

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, `${t('errors.validation.usernameMinMaxLength')}`)
      .max(20, `${t('errors.validation.usernameMinMaxLength')}`)
      .required(`${t('errors.validation.required')}`)
      .notOneOf(existingChannels, `${t('errors.validation.unique')}`),
  });

  useEffect(() => {
    if (isOpen) {
      setNewChannelName(currChName || '');
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
          inputRef.current.select();
        }, 0);
      }
    }
  }, [isOpen, currChName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await validationSchema.validate({ name: newChannelName });
      onRename(channelId, { name: newChannelName });
      onClose();
    } catch (err) {
      rollbar.error(`${t('errors.editChannelErr')}`, err);
      setErrors({ name: err.message });
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.channels.rename')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control ref={inputRef} type="text" value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} isInvalid={!!errors.name} autoFocus />
            <Form.Label className="visually-hidden">
              Имя канала
            </Form.Label>
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>
        </Form>

        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={onClose} className="me-2">
            {t('chat.channels.cancel')}
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            {t('chat.messages.sendMessage')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
