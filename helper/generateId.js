const { v4: uuidv4 } = require("uuid");

function generateUniqID(prefix) {
  const uniqueId = uuidv4().split("-")[0];
  const randomChars = Math.random().toString(36).substring(2, 6);
  const timestamp = Date.now();

  return `${prefix}-${uniqueId}-${randomChars}-${timestamp}`;
}

module.exports = generateUniqID