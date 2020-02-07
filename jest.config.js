module.exports = {
  preset: 'jest-puppeteer',
  transform: {"\\.ts$": ['ts-jest']},
  moduleNameMapper: {
    "botmation/(.*)": "<rootDir>/src/botmation/$1",
    "@tests/(.*)": "<rootDir>/src/tests/$1.ts"
  },
  testPathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/src/tests/server/"
  ]
};