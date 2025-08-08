// Mock for path module
/* global jest */

// Use the actual Node.js path module as base
const actualPath = require('path');

module.exports = {
  ...actualPath,
  resolve: jest.fn((...args) => actualPath.resolve(...args)),
  join: jest.fn((...args) => actualPath.join(...args)),
  dirname: jest.fn((p) => actualPath.dirname(p)),
  basename: jest.fn((p, ext) => actualPath.basename(p, ext)),
  extname: jest.fn((p) => actualPath.extname(p)),
  relative: jest.fn((from, to) => actualPath.relative(from, to)),
  isAbsolute: jest.fn((p) => actualPath.isAbsolute(p)),
  normalize: jest.fn((p) => actualPath.normalize(p)),
  parse: jest.fn((p) => actualPath.parse(p)),
  format: jest.fn((obj) => actualPath.format(obj)),
  sep: actualPath.sep,
  delimiter: actualPath.delimiter,
  posix: actualPath.posix,
  win32: actualPath.win32
};
