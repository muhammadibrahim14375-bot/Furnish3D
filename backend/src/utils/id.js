const { randomUUID } = require('crypto');

module.exports = function uuidv4() {
  return randomUUID();
};
