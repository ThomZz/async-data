module.exports = {
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json'
      }
    ]
  },
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/**/index.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text-summary'],
  testPathIgnorePatterns: ['../coverage/', '<rootDir>/dist/', '../node_modules/', '/node_modules/'],
  testMatch: ['<rootDir>/src/*.spec.ts', '<rootDir>/src/**/*.spec.ts']
};
