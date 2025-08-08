// Mock for fs module
/* global jest */

const actualFs = require('fs');

module.exports = {
  // Sync methods
  readFileSync: jest.fn((path) => {
    if (typeof path === 'string' && path.includes('package.json')) {
      return JSON.stringify({ name: 'test', version: '1.0.0' });
    }
    return '';
  }),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => true),
  mkdirSync: jest.fn(),
  readdirSync: jest.fn(() => []),
  statSync: jest.fn(() => ({ 
    isDirectory: () => true, 
    isFile: () => false,
    size: 0,
    mtime: new Date()
  })),
  rmSync: jest.fn(),
  copyFileSync: jest.fn(),
  unlinkSync: jest.fn(),
  
  // Async methods (promises)
  promises: {
    readFile: jest.fn(() => Promise.resolve('')),
    writeFile: jest.fn(() => Promise.resolve()),
    mkdir: jest.fn(() => Promise.resolve()),
    readdir: jest.fn(() => Promise.resolve([])),
    stat: jest.fn(() => Promise.resolve({ 
      isDirectory: () => true, 
      isFile: () => false,
      size: 0,
      mtime: new Date()
    })),
    rm: jest.fn(() => Promise.resolve()),
    copyFile: jest.fn(() => Promise.resolve()),
    unlink: jest.fn(() => Promise.resolve()),
    access: jest.fn(() => Promise.resolve())
  },
  
  // Constants
  constants: actualFs.constants || {
    F_OK: 0,
    R_OK: 4,
    W_OK: 2,
    X_OK: 1
  }
};
