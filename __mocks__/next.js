// Mock for next module
/* global jest */

const mockNext = jest.fn(() => ({
  prepare: jest.fn().mockResolvedValue(),
  getRequestHandler: jest.fn(() => jest.fn()),
  render: jest.fn(),
  renderToHTML: jest.fn(),
  setAssetPrefix: jest.fn(),
  close: jest.fn().mockResolvedValue()
}));

mockNext.default = mockNext;

module.exports = mockNext;
