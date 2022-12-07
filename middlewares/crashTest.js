const { crashTestErrorText } = require('../utils/const');

module.exports = () => {
  setTimeout(() => {
    throw new Error(crashTestErrorText);
  }, 0);
};
