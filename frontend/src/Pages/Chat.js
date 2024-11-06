import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, fetchMessages, removeMessage } from '../store/messagesSlice';
import AddChannelForm from './AddNewChanel';
import { Container, Row, Col, ListGroup, Form, Button, Spinner, Alert } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './Chat.css';
import { addChannel, removeChannel, editChannel, fetchChannels } from '../store/channelsSlice';
import { showNotification } from '../DefaulltComponents/NotificationComponent';
import RemoveModal from './RemoveModal';
import RenameChannel from './RenameChannel';
//import socket from '../index';
// import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { clearMessageError } from '../store/messagesSlice';
import { clearChannelError } from '../store/channelsSlice';
import leoProfanity from 'leo-profanity';
// import rollbar from '../rollbar';
import axios from 'axios';
import { useRollbar } from '@rollbar/react';

// Как в компоненте обрабатывать ошибки через RollBar?

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
    const error = useSelector((state) => state.messages.error);
    const inputRef = useRef(null);
    const { t } = useTranslation();
    const messageError = useSelector((state) => state.messages.error);
    const channelError = useSelector((state) => state.channels.error);
    const rollbar = useRollbar();

    useEffect(() => {
        if (messageError) {
            showNotification(`${messageError}`, 'error');
            dispatch(clearMessageError());
        }
    }, [messageError, dispatch]);

    useEffect(() => {
        if (channelError) {
            showNotification(`${channelError}`, 'error');
            dispatch(clearChannelError());
        }
    }, [channelError, dispatch]);

     
    useEffect(() => {
        dispatch(fetchChannels());
        dispatch(fetchMessages()); 
    }, [dispatch]);

    useEffect(() => {
        //console.log(`inputRef.current= ${inputRef.current}`);
        if (inputRef.current) {
            setTimeout(() => {
                // inputRef.current.focus();
            }, 0);
        }
    }, []);

    const handleSendMessage = async () => {
        // HERE!!!
        if (!newMessage.trim()) {
            return;
        }

        leoProfanity.loadDictionary('ru');
        let cleanMessage = leoProfanity.clean(newMessage);
        leoProfanity.loadDictionary('en');
        cleanMessage = leoProfanity.clean(cleanMessage);

        
        const message = {
            body: cleanMessage,
            channelId: currentChannelId,
            username: username,
        };

        await dispatch(addMessage(message));
        setNewMessage('');

        // await axios.post('/api/v1/messages', message);

        /*
        try {
            const token = localStorage.getItem('token');
            // console.log(`token fetchData= ${JSON.stringify(token, null, 2)}`);
            await axios.post('/api/v1/messages', message, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNewMessage('');
        } catch (error) {
            // return rejectWithValue(error.message || i18next.t('errors.addMessageErr'));
            rollbar.error('Error during message addition:', error);
            console.error('Error during message addition:', error);
        }
            */

        //console.log(`message in handleSendMessage= ${JSON.stringify(message, null, 2)}`);

        //io.on("connection", (socket) => {
            //socket.emit('newMessage', message);
        //});
        
        //dispatch(addMessage(message));

        /*
        socket.on('newMessage', (message) => {
            console.log('Новое сообщение:', message);
            // Здесь можно обновить пользовательский интерфейс для отображения нового сообщения
            
        });
        */

        // socket.emit('newMessage', message);
    };

    const handleChannelClick = (id) => {
        //console.log('handleChannelClick is working!');
        setCurrentChannelId(id);
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    if (status === 'loading') {
        return <Spinner animation="border" />;
    }

    if (status === 'failed') {
        return <Alert variant="danger">{t("errors.error")}: {error}</Alert>;
    }

    const getMessageCountText = (count) => {
       return t('chat.messages.count', { count });
    };

    const handleAddChannel = async (channelName) => {
        try {

            leoProfanity.loadDictionary('ru');
            let cleanChannelName = leoProfanity.clean(channelName);
            leoProfanity.loadDictionary('en');
            cleanChannelName = leoProfanity.clean(cleanChannelName);

            // const cleanChannelName = leoProfanity.clean(channelName);
            const newChannel = { name: cleanChannelName };
            const resultAction = await dispatch(addChannel(newChannel));
            if (addChannel.fulfilled.match(resultAction)) {
                showNotification(`${t('chat.channels.channelCreate')}`, 'success');
                handleChannelClick(resultAction.payload.id);
            } else {
                showNotification(`${t('chat.channels.channelNotCreate')}`, 'error');
            }
            /*
            if (addChannel.rejected.match(resultAction)) {
                console.log('Error!!');
                rollbar.error('Error during channel addition:', `${t('chat.channels.channelNotCreate')}`);
            }
                */
        } catch (error) {

            rollbar.error('Error during channel addition:', error);
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
        showNotification(`${t('chat.channels.channelIsRenamed')}`, 'success');
    };
    
    const handleDeleteChannel = (channelId) => {
        try {
            const toDeletemessages = messages.filter((message) => Number(message.channelId) === Number(channelId));
            toDeletemessages.forEach((message) => dispatch(removeMessage(message.id)));
            dispatch(removeChannel(channelId));
            showNotification(`${t('chat.channels.channelIsRemoved')}`, 'success');
            handleChannelClick(1);
        } catch (error) {
            rollbar.error('Ошибка при удалении канала:', error);
        }
        
    }; 

    const handleOpenRemoveModal = (channelId) => { 
        setModalRemoveOpen(true);
        setChannelId(channelId); 
    };

    const handleCloseRemoveModal = () => setModalRemoveOpen(false);

    const handleCloseRenameModal = () => setModalRenameOpen(false);

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        handleSendMessage();
    };

    return (
        <Container fluid className="chat-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '0' }}>
            
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Row style={{ height: '88vh', width: '88vw', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
                    <Col xs={3} className="channels" style={{ width: '20%', maxHeight: '100%', overflowY: 'auto', borderRight: '1px solid #dee2e6' }}>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <h5 className="mb-0">{t('chat.channels.channels')}</h5>
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
                                            {t('chat.channels.remove')}
                                        </Dropdown.Item>
                                        <Dropdown.Item 
                                            eventKey="2"
                                            onClick={() => handleOpenRenameChannelModal(channel.id)}
                                        >
                                            {t('chat.channels.rename')}
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
                            {/*messages.filter(message => Number(message.channelId) === currentChannelId).length*/}
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
                                    placeholder={t('chat.messages.enterMessage')}
                                    className="me-2"
                                />
                                <Button type="submit" variant="primary">{t('chat.messages.sendMessage')}</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default Chat;