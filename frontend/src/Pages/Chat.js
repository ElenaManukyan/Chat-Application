import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, fetchMessages, removeMessage } from '../store/messagesSlice';
import AddChannelForm from './AddNewChanel';
import { Container, Row, Col, ListGroup, Form, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
// import './Chat.css';
import { addChannel, removeChannel, editChannel, fetchChannels } from '../store/channelsSlice';
import { showNotification } from '../DefaulltComponents/NotificationComponent';
import RemoveModal from './RemoveModal';
import RenameChannel from './RenameChannel';
//import socket from '../index';
// import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { clearMessageError } from '../store/messagesSlice';
import { clearChannelError, setCurrentChannelIdInStore } from '../store/channelsSlice';
import leoProfanity from 'leo-profanity';
// import rollbar from '../rollbar';
import axios from 'axios';
import { useRollbar } from '@rollbar/react';
import { Plus } from 'react-bootstrap-icons';


// Как в компоненте обрабатывать ошибки через RollBar?

const Chat = () => {

    const dispatch = useDispatch();
    const channels = useSelector((state) => state.channels.channels);
    const messages = useSelector((state) => state.messages.messages);
    const status = useSelector((state) => state.messages.status);
    const username = useSelector((state) => state.auth.username);
    const currentChannelId = useSelector((state) => state.channels.currentChannelId);
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

    // const [manualRendering, setManualRendering] = useState(false);

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
        /*
        const setFocus = () => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        };
        */
        dispatch(fetchChannels());//.then(setFocus);
        dispatch(fetchMessages());//.then(setFocus);        
    }, [dispatch]);


    // ПОСЛЕ ДОБАВЛЕНИЯ КАНАЛА В НОВОМ ЧАТЕ НЕ УСТАНАВЛИВАЕТСЯ ФОКУС
    // НА ИНПУТЕ НОВОГО ЧАТА!!!
    useEffect(() => {
        //console.log(`isModalOpen in useEffect= ${isModalOpen}`);
        //console.log('inputRef.current in useEffect', inputRef.current);
        if (inputRef.current && !isModalOpen) {
            inputRef.current.focus();
        }
    });

    /*
    useEffect(() => {
        if (inputRef.current && !isModalOpen) {
            inputRef.current.focus();
        }
    }, [isModalOpen]);
    */

    const handleSendMessage = async () => {
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
    };

    const handleChannelClick = async (id) => {
        // console.log('id', id);
        //setCurrentChannelId(id);
        // inputRef.current.focus();
        await dispatch(setCurrentChannelIdInStore(id));
        /*
        if (inputRef.current) {
            console.log('handleChannelClick inputRef.current.focus() is working');
            inputRef.current.focus();
        }
            */
    };

    const handleOpenModal = () => {
        //console.log(`isModalOpen in handleOpenModal= ${isModalOpen}`);
        //inputRef.current.blur();
        setModalOpen(true);
        //setManualRendering(false);
    };

    const handleCloseModal = () => {
        //console.log(`isModalOpen in handleCloseModal= ${isModalOpen}`);

        setModalOpen(false);

        if (inputRef.current) {
            console.log('handleCloseModal inputRef.current.focus() is working');
            console.log('inputRef.current', inputRef.current);
            inputRef.current.focus();
        }

        //setTimeout(() => {
        /*
    if (inputRef.current) { // && !isModalOpen
        console.log(`isModalOpen in handleCloseModal= ${isModalOpen}`);
        console.log('inputRef.current in handleCloseModal', inputRef.current);
        inputRef.current.focus();
    }
        */
        //}, 0);

    };

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

            const newChannel = { name: cleanChannelName };
            const resultAction = await dispatch(addChannel(newChannel));
            

            if (addChannel.fulfilled.match(resultAction)) {
                showNotification(`${t('chat.channels.channelCreate')}`, 'success');
                await handleChannelClick(Number(resultAction.payload.id));
                
                
                
                //inputRef.current.focus();
                //console.log(`currentChannelId in handleAddChannel= ${currentChannelId}`);

                // inputRef.current.focus();
                //setManualRendering(true);
            } else {
                showNotification(`${t('chat.channels.channelNotCreate')}`, 'error');
            }
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

    const handleRenameChannel = async (channelId, editedChannel) => {
        await dispatch(editChannel({ id: channelId, editedChannel })); // Изменение здесь
        showNotification(`${t('chat.channels.channelIsRenamed')}`, 'success');
    };

    const handleDeleteChannel = async (channelId) => {
        try {
            const toDeletemessages = messages.filter((message) => Number(message.channelId) === Number(channelId));
            toDeletemessages.forEach((message) => dispatch(removeMessage(message.id)));
            await dispatch(removeChannel(channelId));
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
        // inputRef.current.focus();
        handleSendMessage();
    };

    return (
        <Container className="mt-4">
            {/*<Row style={{ height: '88vh', width: '88vw', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>*/}
            <Row style={{ height: '90vh', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
                <Col xs={2} lg={2} className="border-end" style={{ borderColor: 'lightgray' }}>
                    <div
                        className="d-flex justify-content-between align-items-center"
                        style={{
                            marginTop: '4px',
                            marginBottom: '8px',
                            paddingTop: '24px',
                            paddingLeft: '24px',
                            paddingBottom: '24px',
                            paddingRight: '8px',
                        }}
                    >
                        <h5 className="mb-0">{t('chat.channels.channels')}</h5>
                        <Button
                            onClick={handleOpenModal}
                            variant="outline-primary"
                            className='d-flex align-items-center justify-content-center'
                            style={{
                                width: '20px',
                                height: '20px',
                                padding: 0,
                                borderRadius: '2px',
                            }}
                        >
                            <Plus 
                                style={{
                                    verticalAlign: 'baseline',
                                }}
                            />
                        </Button>
                    </div>
                    {/* ВОТ ТУТ КНОПКИ ДОДЕЛАТЬ НУЖНО! */}
                    <ButtonGroup 
                        vertical 
                        className='w-100'
                    >
                        {channels.map((channel) => (
                            Number(channel.id) < 3 ? (
                                <Button
                                    key={channel.id}
                                    variant="light"
                                    className={`w-100 text-start ${Number(currentChannelId) === Number(channel.id) ? 'active' : ''}`}
                                    style={{ 
                                        padding: '6px 12px',
                                        borderRadius: 0,
                                    }}
                                    onClick={() => handleChannelClick(Number(channel.id))}
                                >
                                    {`# ${channel.name}`}
                                </Button>
                            ) : (
                                <Dropdown
                                    as={ButtonGroup}
                                    key={channel.id}
                                    onClick={() => handleChannelClick(Number(channel.id))}
                                    className={`w-100 ${Number(currentChannelId) === Number(channel.id) ? 'active' : ''}`}
                                >
                                    <Button
                                        variant="light"
                                        title={`# ${channel.name}`}
                                        className={`text-start flex-grow-1 ${Number(currentChannelId) === Number(channel.id) ? 'active' : ''}`}
                                        style={{ 
                                            width: '80%',
                                            borderRadius: 0,
                                        }}
                                    >
                                        {`# ${channel.name}`}
                                    </Button>
                                    <Dropdown.Toggle
                                        split
                                        variant="light"
                                        id={`dropdown-split-basic-${channel.id}`}
                                        className={`${Number(currentChannelId) === Number(channel.id) ? 'active' : ''}`}
                                        style={{ 
                                            width: '20%',
                                            borderRadius: 0,
                                        }}
                                    />

                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            onClick={() => handleOpenRemoveModal(channel.id)}
                                        >
                                            {t('chat.channels.remove')}
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => handleOpenRenameChannelModal(channel.id)}
                                        >
                                            {t('chat.channels.rename')}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>

                                </Dropdown>
                            )
                        ))}
                    </ButtonGroup>
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
                {/*<Col xs={9} className="messages" style={{ maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>*/}
                <Col xs={10} lg={10} className="d-flex flex-column p-0">
                    <div className="w-100" style={{ padding: '16px' }} >
                        <h5>
                            #{channels.find(channel => Number(channel.id) === currentChannelId)?.name}
                        </h5>
                        <div>
                            {getMessageCountText(messages.filter(message => Number(message.channelId) === currentChannelId).length)}
                        </div>
                    </div>
                    <div className="border-top h-100" style={{ borderColor: 'lightgray' }}>
                        {Array.isArray(messages) ? messages.map((message) =>
                            Number(message.channelId) === Number(currentChannelId) ? (
                                <div key={message.id} className="message">
                                    <strong>{message.username}</strong>: {message.body}
                                </div>
                            ) : null
                        ) : null}
                    </div>
                    <Form onSubmit={handleMessageSubmit}>
                        <Form.Group className="d-flex align-items-center" style={{ padding: '16px 48px' }}>
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
        </Container >
    );
};

export default Chat;