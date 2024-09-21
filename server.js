const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
}));

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
}));

app.use(bodyParser.json());

let messages = [];

// Обработка подключения пользователя
io.on('connection', (socket) => {
    console.log('User connected!');

    socket.emit('allMessages', messages);

    socket.on('sendMessage', (message) => {
        messages.push(message);
        io.emit('newMessage', message); // Отправка сообщения всем клиентам
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Запуск сервера
server.listen(5001, () => {
    console.log('Server is running on port 5001');
});