module.exports = {
  preset: 'jest-puppeteer',
  transform: {"\\.ts$": ['ts-jest']},
  moduleNameMapper: {
    "@mationbot/(.*)": "<rootDir>/src/mationbot/$1.ts",
    "@mationbot": "<rootDir>/src/mationbot",
    "@helpers/(.*)": "<rootDir>/src/helpers/$1.ts",
    "@config": "<rootDir>/src/config.ts",
    "@bots/(.*)": "<rootDir>/src/bots/$1.ts"
  },
  testPathIgnorePatterns: [
    "<rootDir>/build/"
  ]
};