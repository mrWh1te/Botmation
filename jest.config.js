module.exports = {
  preset: 'jest-puppeteer',
  transform: {"\\.ts$": ['ts-jest']},
  moduleNameMapper: {
    "@botmation/(.*)": "<rootDir>/src/botmation/$1.ts",
    "@botmation": "<rootDir>/src/botmation",
    "@helpers/(.*)": "<rootDir>/src/helpers/$1.ts",
    "@config": "<rootDir>/src/config.ts",
    "@bots/(.*)": "<rootDir>/src/bots/$1.ts",
    "@tests/(.*)": "<rootDir>/src/tests/$1.ts"
  },
  testPathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/src/tests/server/"
  ]
};