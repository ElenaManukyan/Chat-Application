import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Row, Col, Button, Spinner, Alert, ButtonGroup, Form,
} from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';
import leoProfanity from 'leo-profanity';
import { useRollbar } from '@rollbar/react';
import {
  addMessage, fetchMessages, removeMessage, clearMessageError,
} from '../store/messagesSlice';
import AddChannelForm from './AddNewChanel';
import {
  addChannel, removeChannel, editChannel, fetchChannels, clearChError, setCurrChIdStore,
} from '../store/channelsSlice';
import { showNotification } from '../DefaulltComponents/NotificationComponent';
import RemoveModal from './RemoveModal';
import RenameChannel from './RenameChannel';

const Chat = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const messages = useSelector((state) => state.messages.messages);
  const status = useSelector((state) => state.messages.status);
  const username = useSelector((state) => state.auth.username);
  const currentChId = useSelector((state) => state.channels.currentChannelId);
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
      dispatch(clearChError());
    }
  }, [channelError, dispatch]);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  // ПОСЛЕ ДОБАВЛЕНИЯ КАНАЛА В НОВОМ ЧАТЕ НЕ УСТАНАВЛИВАЕТСЯ ФОКУС
  // НА ИНПУТЕ НОВОГО ЧАТА!!!

  useEffect(() => {
    if (inputRef.current && !isModalOpen) {
      inputRef.current.focus();
    }
  });

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
      channelId: currentChId,
      username,
    };

    await dispatch(addMessage(message));
    setNewMessage('');
  };

  const handleChannelClick = async (id) => {
    await dispatch(setCurrChIdStore(id));
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (status === 'loading') {
    return <Spinner animation="border" />;
  }

  if (status === 'failed') {
    return (
      <Alert variant="danger">
        {t('errors.error')}
        :
        <span>{error}</span>
      </Alert>
    );
  }

  const getCountText = (count) => t('chat.messages.count', { count });

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
      } else {
        showNotification(`${t('chat.channels.channelNotCreate')}`, 'error');
      }
    } catch (err) {
      rollbar.error('Error during channel addition:', err);
      console.error('Error during channel addition:', err);
    }
  };

  const handleOpenRenameChannelModal = (chId) => {
    setModalRenameOpen(true);
    setChannelId(chId);
    const currentChannelName = channels.filter((channel) => channel.id === chId)[0].name;
    setCurrChannelName(currentChannelName);
  };

  const handleRenameChannel = async (chId, editedChannel) => {
    await dispatch(editChannel({ id: chId, editedChannel })); // Изменение здесь
    showNotification(`${t('chat.channels.channelIsRenamed')}`, 'success');
  };

  const handleDeleteChannel = async (chId) => {
    try {
      const delMessages = messages.filter((message) => Number(message.channelId) === Number(chId));
      delMessages.forEach((message) => dispatch(removeMessage(message.id)));
      await dispatch(removeChannel(chId));
      showNotification(`${t('chat.channels.channelIsRemoved')}`, 'success');
      handleChannelClick(1);
    } catch (err) {
      rollbar.error('Ошибка при удалении канала:', err);
    }
  };

  const handleOpenRemoveModal = (chId) => {
    setModalRemoveOpen(true);
    setChannelId(chId);
  };

  const handleCloseRemoveModal = () => setModalRemoveOpen(false);

  const handleCloseRenameModal = () => setModalRenameOpen(false);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <Container className="mt-4">
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
              className="d-flex align-items-center justify-content-center"
              style={{
                width: '20px',
                height: '20px',
                padding: 0,
                borderRadius: '2px',
                verticalAlign: 'baseline',
                fontSize: '16px',
                lineHeight: '20px',
              }}
            >
              +
            </Button>
          </div>
          <ButtonGroup vertical className="w-100">
            {channels.map((channel) => { 
              return Number(channel.id) < 3 ? (
              <Button
                key={channel.id}
                variant={`${Number(currentChId) === Number(channel.id) ? 'secondary' : 'light'}`}
                className="w-100 rounded-0 text-start"
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
                >
                  <Button
                    variant={`${Number(currentChId) === Number(channel.id) ? 'secondary' : 'light'}`}
                    title={`# ${channel.name}`}
                    className="w-100 rounded-0 text-start text-truncate"
                    style={{
                      width: '80%',
                      borderRadius: 0,
                    }}
                  >
                    {`# ${channel.name}`}
                  </Button>
                  <Dropdown.Toggle
                    split
                    variant={`${Number(currentChId) === Number(channel.id) ? 'secondary' : 'light'}`}
                    id={`dropdown-split-basic-${channel.id}`}
                    style={{
                      width: '20%',
                      borderRadius: 0,
                    }}
                  >
                    <span className="visually-hidden">Управление каналом</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleOpenRemoveModal(channel.id)}>{t('chat.channels.remove')}</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleOpenRenameChannelModal(channel.id)}>{t('chat.channels.rename')}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
            )})}
          </ButtonGroup>
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
        <Col xs={10} lg={10} className="d-flex flex-column p-0">
          <div className="w-100" style={{ padding: '16px' }}>
            <h5>
              #
              {(
                channels.find((channel) => Number(channel.id) === currentChId)?.name
              )}
            </h5>
            <div>
              {getCountText(messages.filter((m) => Number(m.channelId) === currentChId.length))}
            </div>
          </div>
          <div className="border-top h-100" style={{ borderColor: 'lightgray' }}>
            {messages.map((message) => {
              if (Number(message.channelId) === Number(currentChId)) {
                return (
                  <div key={message.id} className="message">
                    <strong>{message.username}</strong>
                    :
                    <span>{message.body}</span>
                  </div>
                );
              }
              return null;
            })}
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
                aria-label="Новое сообщение"
              />
              <Button type="submit" variant="primary">
                {t('chat.messages.sendMessage')}
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
