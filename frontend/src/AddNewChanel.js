import React from 'react';  
import { Formik, Form, Field, ErrorMessage } from 'formik';  
import * as Yup from 'yup';  
import { useDispatch } from 'react-redux';  
import { addChannel } from './store/channelsSlice';  

const AddChannelForm = () => {  
  const dispatch = useDispatch();  

  const validationSchema = Yup.object().shape({  
    name: Yup.string()  
      .min(3, 'Должно быть минимум 3 символа')  
      .max(20, 'Должно быть максимум 20 символов')  
      .required('Это поле обязательно')  
      .test('unique', 'Имя канала должно быть уникальным', (value, context) => {  
        // Здесь логика, проверяющая уникальность имени

        
        console.log(`value in validationSchema= ${JSON.stringify(value, null, 2)}`);
        console.log(`context in validationSchema= ${JSON.stringify(context, null, 2)}`);
      }),  
  });  

  return (  
    <Formik  
      initialValues={{ name: '' }}  
      validationSchema={validationSchema}  
      onSubmit={(values, { setSubmitting }) => {  
        dispatch(addChannel({ name: values.name }));  
        setSubmitting(false);  
      }}  
    >  
      {({ isSubmitting }) => (  
        <Form>  
          <Field name="name" placeholder="Название канала" />  
          <ErrorMessage name="name" component="div" />  
          <button type="submit" disabled={isSubmitting}>Добавить канал</button>  
        </Form>  
      )}  
    </Formik>  
  );  
};  

export default AddChannelForm;