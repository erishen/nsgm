// Mock for body-parser module
/* global jest */

module.exports = {
  json: jest.fn(() => jest.fn()),
  urlencoded: jest.fn(() => jest.fn()),
  text: jest.fn(() => jest.fn()),
  raw: jest.fn(() => jest.fn())
};
