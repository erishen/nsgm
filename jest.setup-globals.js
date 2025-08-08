// Jest global setup - mock process.exit and other Node.js globals
/* global jest */

// Mock process.exit to prevent tests from actually exiting
const originalExit = process.exit;
process.exit = jest.fn();

// Restore original process.exit after each test
global.afterEach = global.afterEach || [];
global.afterEach.push(() => {
  process.exit.mockClear();
});

// Mock console methods to reduce test output noise
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
console.log = jest.fn();
console.error = jest.fn();

// Restore console methods after all tests
global.afterAll = global.afterAll || [];
global.afterAll.push(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  process.exit = originalExit;
});
