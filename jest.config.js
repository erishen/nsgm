module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/$1', // 根据项目的 alias 配置调整路径
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy' // Mock CSS 模块
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  }
};
