// Mock for url module
/* global jest */

const actualUrl = require('url');

module.exports = {
  ...actualUrl,
  parse: jest.fn((urlString, parseQueryString, slashesDenoteHost) => 
    actualUrl.parse(urlString, parseQueryString, slashesDenoteHost)
  ),
  format: jest.fn((urlObject) => actualUrl.format(urlObject)),
  resolve: jest.fn((from, to) => actualUrl.resolve(from, to)),
  URL: actualUrl.URL,
  URLSearchParams: actualUrl.URLSearchParams
};
