const users = []; // Массив для хранения пользователей чата


// Присоединение пользователя к чату
function userJoin(id, username, room) {
  const user = { id, username, room }; // Создание объекта пользователя

  users.push(user); // Добавление пользователя в массив

  return user; // Возвращение добавленного пользователя
}


// Получение текущего пользователя по идентификатору
function getCurrentUser(id) {
  return users.find(user => user.id === id); // Поиск пользователя в массиве по идентификатору
}


// Удаление пользователя из чата
function userLeave(id) {
  const index = users.findIndex(user => user.id === id); // Поиск индекса пользователя в массиве

  if (index !== -1) {
    return users.splice(index, 1); // Удаление пользователя из массива и возвращение удаленного пользователя
  }
}


// Получение пользователей комнаты
function getRoomUsers(room) {
  return users.filter(user => user.room === room); // Фильтрация массива пользователей по комнате
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
