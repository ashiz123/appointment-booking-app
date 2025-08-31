Overview
  . This modules created inside the utils folder for logging system.
  . This is created using singleton pattern
  . File based logging during development and console based logging for production

  Features
  1. Multiple Transports
    . File Transport
    . Rejection Transport
    . Exception Transport
    . Console Transport

  2. Structured logging
   . JSON format with timestamps and stack traces for errors.

  3. Global Metadata
    Add service to every log entry.

  4. Automatic log directory creation
    Create the log folder in the project folder using path and fs.

  
  Steps:
   npm install winston

   usage:
   import { getLogger } from './path/to/logger.js';
   const logger = getLogger();


   - working file location - backend/src/shared/utils/logger.js

  folder structure
  project-root/
├─ src/
├─ logs/
├─ docs/
│   └─ logger.md
└─ index.js


