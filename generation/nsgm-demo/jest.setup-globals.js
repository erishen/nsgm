// Jest global setup - mock process.exit and other Node.js globals
/* global jest */

// Store original implementations
const originalExit = process.exit;
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Mock process.exit to prevent tests from actually exiting
process.exit = jest.fn(() => {
  throw new Error("process.exit() was called");
});

// Mock console methods to reduce test output noise
console.log = jest.fn();
console.error = jest.fn();
