module.exports = {
  preset: 'jest-puppeteer',
  transform: {"\\.ts$": ['ts-jest']},
  moduleNameMapper: {
    '^botmation/(.*)$': '<rootDir>/src/botmation/$1',
    "^tests/(.*)$": "<rootDir>/src/tests/$1",
  },
  testPathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/src/tests/server/"
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/build/"
  ],
  // Code Coverage, pass the --coverage flag in CLI to run
  coverageDirectory: '<rootDir>/build/coverage',
  collectCoverageFrom: [
    "**/botmation/**/*.ts",
    "!**/botmation/bots/**/*.ts",
    "!**/botmation/index.ts",
    "!**/node_modules/**",
    "!**/build/**",
    "!**/dist/**",
    "!**/assets/**",
  ]
};