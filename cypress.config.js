const { defineConfig } = require("cypress");
const dotenvPlugin = require('cypress-dotenv');

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://m4n4gemy.app/",
    setupNodeEvents(on, config) {
      // implement node event listeners here

      // Load environment variables from .env file
      config = dotenvPlugin(config);
      return config;
    },
  },
});
