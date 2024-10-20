import Button from 'react-bootstrap/Button';  
import Form from 'react-bootstrap/Form';  
import Modal from 'react-bootstrap/Modal';  
import React, { useEffect, useRef, useState } from 'react';  
import * as yup from 'yup';  

const RenameChannel = ({ isOpen, onClose, onRename, channelId, currChannelName, existingChannels }) => {  
    const [newChannelName, setNewChannelName] = useState(currChannelName || '');  
    const [errors, setErrors] = useState({});  
    const inputRef = useRef(null);  

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
            setNewChannelName(currChannelName || '');  
            if (inputRef.current) {  
                setTimeout(() => {  
                    inputRef.current.focus();  
                    inputRef.current.select();  
                }, 0);  
            }  
        }  
    }, [isOpen, currChannelName]);  

    const handleSubmit = async (e) => {  
        e.preventDefault();  

        setErrors({});  

        try { 
            await validationSchema.validate({ name: newChannelName });  
            onRename(channelId, { name: newChannelName });  
            onClose();  
        } catch (err) {  
            setErrors({ name: err.message });  
        }  
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
                            isInvalid={!!errors.name} 
                            autoFocus  
                        />  
                        <Form.Control.Feedback type="invalid">  
                            {errors.name}  
                        </Form.Control.Feedback>  
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