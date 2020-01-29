// jest-puppeteer.config.js
module.exports = {
  server: {
    command: './node_modules/http-server/bin/http-server ./src/tests/server',
    port: 8080
  },
}