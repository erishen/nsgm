// Mock for express module
/* global jest */

const mockExpress = jest.fn(() => ({
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  listen: jest.fn((port, callback) => {
    if (callback) callback();
    return { close: jest.fn() };
  }),
  set: jest.fn(),
  static: jest.fn()
}));

mockExpress.static = jest.fn();
mockExpress.json = jest.fn();
mockExpress.urlencoded = jest.fn();
mockExpress.Router = jest.fn(() => ({
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

module.exports = mockExpress;
