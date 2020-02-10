module.exports = {
  preset: 'jest-puppeteer',
  transform: {"\\.ts$": ['ts-jest']},
  moduleNameMapper: {
    "botmation/(.*)": "<rootDir>/src/botmation/$1",
    "@tests/(.*)": "<rootDir>/src/tests/$1.ts"
  },
  testPathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/src/tests/server/"
  ]
};