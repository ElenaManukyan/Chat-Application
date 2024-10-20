import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, fetchMessages, removeMessage } from '../store/messagesSlice';
import { fetchChannels } from '../store/channelsSlice';
// import { setCurrentChannelId } from './store/channelsSlice';
import AddChannelForm from './AddNewChanel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Form, Button, Spinner, Alert, Navbar } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './Chat.css';
import { addChannel, removeChannel, editChannel } from '../store/channelsSlice';
import { showNotification } from './NotificationComponent';
import RemoveModal from './RemoveModal';
import RenameChannel from './RenameChannel';
import socket from '../index';
// import { io } from 'socket.io-client';


const Chat = () => {

    const dispatch = useDispatch();
    const channels = useSelector((state) => state.channels.channels);
    const messages = useSelector((state) => state.messages.messages);
    const status = useSelector((state) => state.messages.status);
    const username = useSelector((state) => state.auth.username);
    const [currentChannelId, setCurrentChannelId] = useState(1);
    const [newMessage, setNewMessage] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalRemoveOpen, setModalRemoveOpen] = useState(false);
    const [isModalRenameOpen, setModalRenameOpen] = useState(false);
    const [channelId, setChannelId] = useState(null);
    const [currChannelName, setCurrChannelName] = useState('');
    const navigate = useNavigate();
    const error = useSelector((state) => state.messages.error);
    const inputRef = useRef(null);

    useEffect(() => {
        dispatch(fetchChannels());
        dispatch(fetchMessages()); 
    }, [dispatch]);

    useEffect(() => {
        console.log(`inputRef.current= ${inputRef.current}`);
        if (inputRef.current) {
            setTimeout(() => {
                // inputRef.current.focus();
            }, 0);
        }
    }, []);

    const handleSendMessage = () => {
        // HERE!!!
        if (!newMessage.trim()) {
            return;
        }
        const message = {
            body: newMessage,
            channelId: currentChannelId,
            username: username,
        };
        //console.log(`message in handleSendMessage= ${JSON.stringify(message, null, 2)}`);

        //io.on("connection", (socket) => {
            //socket.emit('newMessage', message);
        //});
        dispatch(addMessage(message));
        setNewMessage('');
    };

    const handleChannelClick = (id) => {
        //console.log('handleChannelClick is working!');
        setCurrentChannelId(id);
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleLogout = () => {
        // Логика выхода из системы  
        navigate('/login');
    };

    if (status === 'loading') {
        return <Spinner animation="border" />;
    }

    if (status === 'failed') {
        return <Alert variant="danger">Ошибка: {error}</Alert>;
    }

    const getMessageCountText = (count) => {
        if (count === 0) return ' сообщений';
        if (count === 1) return ' сообщение';
        if (count > 1 && count < 5) return ' сообщения';
        return ' сообщений';
    };

    const handleAddChannel = async (channelName) => {
        try {
            const newChannel = { name: channelName };
            const resultAction = await dispatch(addChannel(newChannel));
            if (addChannel.fulfilled.match(resultAction)) {
                showNotification('Канал создан', 'success');
                //console.log(`resultAction.payload.id= ${resultAction.payload.id}`);
                handleChannelClick(resultAction.payload.id);
            } else {
                showNotification('Канал не создан', 'error');
            }
        } catch (error) {
            console.error('Error during channel addition:', error);
        }
    };

    const handleOpenRenameChannelModal = (channelId) => { 
        setModalRenameOpen(true);
        setChannelId(channelId);
        const currentChannelName = channels.filter((channel) => channel.id === channelId)[0].name;
        setCurrChannelName(currentChannelName);
    };

    const handleRenameChannel = (channelId, editedChannel) => {  
        dispatch(editChannel({ id: channelId, editedChannel })); // Изменение здесь
        showNotification('Канал переименован', 'success');
    };
    
    const handleDeleteChannel = (channelId) => {
        const toDeletemessages = messages.filter((message) => Number(message.channelId) === Number(channelId));
        toDeletemessages.forEach((message) => dispatch(removeMessage(message.id)));
        dispatch(removeChannel(channelId));
        showNotification('Канал удалён', 'success');
        handleChannelClick(1);
    }; 

    const handleOpenRemoveModal = (channelId) => { 
        setModalRemoveOpen(true);
        setChannelId(channelId); 
    };

    const handleCloseRemoveModal = () => setModalRemoveOpen(false);

    const handleCloseRenameModal = () => setModalRenameOpen(false);

    const handleMessageSubmit = (e) => {
        // console.log(`messages in handleMessageSubmit= ${JSON.stringify(messages, null, 2)}`);
        e.preventDefault();
        handleSendMessage();
    };

    return (
        <Container fluid className="chat-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '0' }}>
            <Navbar bg="light" expand="lg" style={{ width: '100%', height: '5%', display: 'flex', justifyContent: 'space-between', padding: '0 5%', boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)' }}>
                <Navbar.Brand>Hexlet Chat</Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Button variant="primary" onClick={handleLogout}>Выйти</Button>
                </Navbar.Collapse>
            </Navbar>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Row style={{ height: '88vh', width: '88vw', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
                    <Col xs={3} className="channels" style={{ width: '20%', maxHeight: '100%', overflowY: 'auto', borderRight: '1px solid #dee2e6' }}>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <h5 className="mb-0">Каналы</h5>
                            <Button onClick={handleOpenModal} variant="outline-primary" size="sm">+</Button>
                        </div>
                        <ListGroup className="mt-2">
                            {channels.map((channel) => ( 
                                <ListGroup.Item
                                    key={channel.id}
                                    className="d-flex justify-content-between align-items-center"
                                    variant='light'
                                    onClick={() => handleChannelClick(Number(channel.id))}
                                    action
                                    active={Number(channel.id) === Number(currentChannelId)}
                                >
                                <span>
                                    # {channel.name}
                                </span>

                                {channel.id >= 3 &&
                                (
                                    <DropdownButton
                                        key={`dropdown-${channel.id}`}
                                        id={`dropdown-variants-${channel.id}`}
                                        variant='light'
                                        title=''
                                    >
                                        <Dropdown.Item 
                                            eventKey="1"
                                            onClick={() => handleOpenRemoveModal(channel.id)}
                                        >
                                            Удалить
                                        </Dropdown.Item>
                                        <Dropdown.Item 
                                            eventKey="2"
                                            onClick={() => handleOpenRenameChannelModal(channel.id)}
                                        >
                                            Переименовать
                                        </Dropdown.Item>
                                    </DropdownButton>
                                )}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        {/*console.log(`channels in Chat.js= ${JSON.stringify(channels, null, 2)}`)*/}
                        <AddChannelForm
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            onSubmit={handleAddChannel}
                            existingChannels={channels.map((ch) => ch.name)}
                        />
                        <RemoveModal 
                            isOpen={isModalRemoveOpen}
                            onClose={handleCloseRemoveModal}
                            onDelete={handleDeleteChannel}
                            channelId={channelId}
                        />
                        <RenameChannel
                            isOpen={isModalRenameOpen}
                            onClose={handleCloseRenameModal}
                            onRename={handleRenameChannel}
                            channelId={channelId}
                            currChannelName={currChannelName}
                            existingChannels={channels.map((ch) => ch.name)}
                        />
                    </Col>
                    <Col xs={9} className="messages" style={{ maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                        <h5>
                            #{channels.find(channel => Number(channel.id) === currentChannelId)?.name}
                        </h5>
                        <div>
                            {messages.filter(message => Number(message.channelId) === currentChannelId).length}
                            {getMessageCountText(messages.filter(message => Number(message.channelId) === currentChannelId).length)}
                        </div>
                        <div className="message-list" style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                            {Array.isArray(messages) ? messages.map((message) =>
                                Number(message.channelId) === currentChannelId ? (
                                    <div key={message.id} className="message">
                                        <strong>{message.username}</strong>: {message.body}
                                    </div>
                                ) : null
                            ) : null}
                        </div>
                        <Form className="message-input" onSubmit={handleMessageSubmit}>
                            <Form.Group className="d-flex align-items-center">
                                <Form.Control
                                    ref={inputRef}
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Введите сообщение..."
                                    className="me-2"
                                />
                                <Button type="submit" variant="primary">Отправить</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default Chat;