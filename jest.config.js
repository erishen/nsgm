module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss|less)$'],
  moduleNameMapper: {
    '^replace-in-file$': '<rootDir>/__mocks__/replace-in-file.js',
    '^replace$': '<rootDir>/__mocks__/replace.js',
    '^fs$': '<rootDir>/__mocks__/fs.js',
    '^next$': '<rootDir>/__mocks__/next.js',
    '^express$': '<rootDir>/__mocks__/express.js',
    '^body-parser$': '<rootDir>/__mocks__/body-parser.js',
    '^url$': '<rootDir>/__mocks__/url.js',
    '^dotenv$': '<rootDir>/__mocks__/dotenv.js',
    '^chalk$': '<rootDir>/__mocks__/chalk.js'
  },
  setupFiles: ['<rootDir>/jest.setup-globals.js'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'client/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    'server/**/*.{js,jsx,ts,tsx}',
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/*.config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
