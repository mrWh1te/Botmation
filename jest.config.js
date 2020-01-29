module.exports = {
  preset: 'jest-puppeteer',
  transform: {"\\.ts$": ['ts-jest']},
  moduleNameMapper: {
    "@mationbot/(.*)": "<rootDir>/build/mationbot/$1.js",
    "@mationbot": "<rootDir>/build/mationbot",
    "@helpers/(.*)": "<rootDir>/build/helpers/$1.js",
    "@config": "<rootDir>/build/config.js",
    "@bots/(.*)": "<rootDir>/build/bots/$1.js"
  }
};