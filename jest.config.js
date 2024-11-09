module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/$1', // 根据项目的 alias 配置调整路径
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy' // Mock CSS 模块
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  collectCoverage: true, // 启用覆盖率收集
  collectCoverageFrom: [
    'client/**/*.{js,jsx,ts,tsx}', // 指定要包含的文件范围
    'pages/**/*.{js,jsx,ts,tsx}',
    'server/**/*.{js,jsx,ts,tsx}',
    'src/**/*.{js,jsx,ts,tsx}'
  ],
  coverageDirectory: 'coverage', // 覆盖率报告生成的目录
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // 报告格式
};
