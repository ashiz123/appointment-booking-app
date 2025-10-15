import dotenv from "dotenv";
dotenv.config({ path: ".env.test", override: true }); // Load environment variables from .env.test. The override option ensures a consistent test environment.
console.log("Loaded test environment:", process.env.NODE_ENV);
