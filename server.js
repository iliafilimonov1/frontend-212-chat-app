const path = require('path'); // утилиты для работы с путями к файлам и директориям
const http = require('http'); // функциональность HTTP-сервера
const express = require('express');
const socketio = require('socket.io'); // двустороннюю связь в режиме реального времени между веб-клиентами и серверами
const formatMessage = require('./utils/messages'); // наш модуль для форматирования сообщений чата
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users'); // наш модуль для управления функциональностью, связанной с пользователями
require('dotenv').config(); // конфиг для локальных переменных (порт)

const app = express(); // Создание приложения Express
const server = http.createServer(app); // Создание HTTP-сервера с использованием приложения Express
const io = socketio(server); // Создание сервера WebSocket с использованием HTTP-сервера


app.use(express.static(path.join(__dirname, 'public'))); // Установка статической папки

const botName = 'Chat Bot';

// Выполняется при подключении клиента
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room); // Присоединение пользователя к комнате

    socket.join(user.room); // Присоединение сокета пользователя к его комнате

    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!')); // Отправка приветственного сообщения текущему пользователю

    // Отправка широковещательного сообщения о подключении нового пользователя
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Отправка информации о пользователях и комнате
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });


  // Сообщения чата от пользователя
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });


  // Выход пользователя из чата
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    // Отправка сообщения о выходе пользователя из чата
    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Отправка информации о пользователях и комнате
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000; // Порт сервера

server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Запуск сервера на указанном порту
