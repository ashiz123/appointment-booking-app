export default {
  testEnvironment: "node",
  transform: {},
  moduleFileExtensions: ["js", "json", "node"],
  setupFiles: ["<rootDir>/tests/setup/jest-dotenv.setup.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup/setup.js"]
};


    