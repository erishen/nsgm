// Mock for dotenv module
/* global jest */

module.exports = {
  config: jest.fn(() => ({ parsed: {} }))
};
