import { Modal, Button, Form } from 'react-bootstrap';
import {
  Formik, Field, Form as FormikForm, ErrorMessage,
} from 'formik';
import * as yup from 'yup';
import React, { useEffect } from 'react';
import { useRollbar } from '@rollbar/react';
import { useTranslation } from 'react-i18next';

const AddChannelForm = ({
  isOpen, onClose, onSubmit, existingChannels,
}) => {
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
      const inputElement = document.getElementById('channelNameInput');
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [isOpen]);

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.channels.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              await onSubmit(values.name); // Тут onSubmit должен возвращать промис
              resetForm();
              onClose();
            } catch (error) {
              rollbar.error(`${t('errors.addChannelErr')}`, error);
            }
          }}
        >
          {({ errors, touched }) => (
            <FormikForm>
              <Form.Group className="mb-2">
                <Form.Label className="visually-hidden">
                  Имя канала
                </Form.Label>
                <Field name="name" id="channelNameInput" as={Form.Control} isInvalid={touched.name && !!errors.name} />
                <Form.Control.Feedback type="invalid">
                  <ErrorMessage name="name" />
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={onClose} className="me-2">
                  {t('chat.channels.cancel')}
                </Button>
                <Button type="submit" variant="primary">
                  {t('chat.messages.sendMessage')}
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannelForm;
