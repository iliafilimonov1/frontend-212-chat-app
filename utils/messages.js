const { format } = require("date-fns"); // Библиотека для работы с датами и временем

/**
 * Функция для форматирования сообщений
 * @param {string} username - Имя пользователя
 * @param {string} text - Текст сообщения
 * @returns {Object} - Объект сообщения с дополнительным полем time
 */
function formatMessage(username, text) {
  return {
    username,
    text,
    time: format(new Date(), "h:mm a") // Форматирование текущего времени с использованием date-fns
  };
}

module.exports = formatMessage; // Экспорт функции formatMessage
