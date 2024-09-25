const { defineConfig } = require("cypress");
const dotenvPlugin = require('cypress-dotenv');
const registerDataSession = require('cypress-data-session/src/plugin')

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://m4n4gemy.app/",
    viewportHeight: 1080,
    viewportWidth: 1920,
    watchForFileChanges: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here

      registerDataSession(on, config)

      // Load environment variables from .env file
      config = dotenvPlugin(config);
      return config;
    },
  },
});
