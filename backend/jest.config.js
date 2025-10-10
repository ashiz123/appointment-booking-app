export default {
  testEnvironment: "node",
  transform: {},
  moduleFileExtensions: ["js", "json", "node"],
  setupFiles: ["<rootDir>/tests/jest-dotenv.setup.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"]
};


