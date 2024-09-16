const { defineConfig } = require("cypress");
const dotenvPlugin = require('cypress-dotenv');

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://m4n4gemy.app/",
    viewportHeight: 1080,
    viewportWidth: 1920,
    setupNodeEvents(on, config) {
      // implement node event listeners here

      // Load environment variables from .env file
      config = dotenvPlugin(config);
      return config;
    },
  },
});
