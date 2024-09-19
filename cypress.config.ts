import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env.cssAlias = {
        "--bs-body-color-rgb": "rgb(33, 37, 41)"
      };
      require('@cypress/grep/src/plugin')(config);
      return config;
    },
    baseUrl: "http://localhost:3000/", // update to envvar and set based on environment
  },
});
