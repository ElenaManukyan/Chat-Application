// import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as yup from 'yup';
import React, { useEffect } from 'react';


const AddChannelForm = ({ isOpen, onClose, onSubmit, existingChannels }) => {

  // console.log(`existingChannels in AddChannelForm= ${JSON.stringify(existingChannels, null, 2)}`);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, 'Имя должно содержать минимум 3 символа')
      .max(20, 'Имя должно содержать не более 20 символов')
      .required('Имя обязательно')
      .notOneOf(existingChannels, 'Имя канала должно быть уникальным'),
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
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Formik  
          initialValues={{ name: '' }}  
          validationSchema={validationSchema}  
          onSubmit={(values, { resetForm }) => {  
            onSubmit(values.name); 
            resetForm();  
            onClose();  
          }}  
        >
          {({ errors, touched }) => (
            <FormikForm>
              <Form.Group className="mb-2">
                <Form.Label>Имя канала</Form.Label>
                <Field  
                  name="name"  
                  id="channelNameInput"  
                  as={Form.Control}  
                  isInvalid={touched.name && !!errors.name}  
                /> 
                <Form.Control.Feedback type="invalid">
                  <ErrorMessage name="name" />
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={onClose} className="me-2">
                  Отменить
                </Button>
                <Button type="submit" variant="primary">
                  Отправить
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
