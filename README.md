# Appointment booking system
This is full stack appointment booking system creating with MERN tech.


## Purpose
This project was created as a learning exercise to:
- Manage services and available time slot
- Enable authenticated user to generate the appointment slot
- Provide a scalable backend to integrate with other websites or platforms.
- Serve as a reusable service for embedding booking functionality in external sites.


## Project Structure
-- Frontend/
-- Backend/ (Featured approach)
backend

├── src
│   ├── features
│   │   ├── business
│   │   ├── businessOffer
│   │   ├── slot
│   │   └── user
│   └── shared
│       ├── config
│       ├── middlewares
│       ├── routes
│       ├── services
│       └── utils
├── testDebug.js
└── tests
    └── authMiddleware.test.js
- docker-compose.yml
- README.md


# Work in Progress
This app is currently under development.  
I will keep updating this README with setup instructions, features, and other details as the project evolves.


# 📌 Appointment App API

Version: **Current**  
Base URL: `http://localhost:3000`  
Auth: **Bearer Token (JWT)** for protected routes  

---

## 🔑 Auth APIs - /users

  | Method | Endpoint          | Description         |
  |--------|-------------------|---------------------|
  | POST   | `/register` | Register a new user |
  | POST   | `/login`    | Login and get token |
  | POST   | `/logout`   | Logout user         |
  ---

## 🏢 Business APIs - /business

  | Method | Endpoint                   | Description                          |
  |--------|-----------------------------|--------------------------------------|
  | POST   | `/create`          | Create a new business (auth required) |
  | PUT    | `/update/:id`      | Update business by ID (owner only)   |
  | GET    | `/byAuthUser`      | Get business owned by auth user      |
  | DELETE | `/delete/:id`      | Delete business by ID (owner only)   |

  ---

  ## 💇 Services APIs

  | Method | Endpoint                   | Description               |
  |--------|-----------------------------|---------------------------|
  | POST   | `/service/create` | Create a new service under a business |

  ---

  ## 📅 Appointment Slot APIs

  | Method | Endpoint                        | Description              |
  |--------|--------------------------------|--------------------------|
  | GET    | `/appointment-slot`            | Get all available slots  |
  | POST   | `/customer/book_appointment`   | Book an appointment slot |

            ---

## 👤 Customer APIs - /customer

  | Method | Endpoint                | Description         |
  |--------|--------------------------|---------------------|
  | GET    | `/book_slot`   | Get booked slots    |
  | POST   | `/book_appointment` | Book appointment |
  | POST   | `/appointment_slot/by_date` | Get appointments by date 
  | POST   | `/reschedule_appointment`   | Reschedule appointment 
  ---

### Testing
This project is using using jest and supertest
This project is using separate test env, test db to avoid affecting development
Make sure you have .env.test 

Run test - npm test



## Testing environment configuration 
# jest.config
  testEnvironment: "node",
  transform: {},
  moduleFileExtensions: ["js", "json", "node"],
  setupFiles: ["<rootDir>/tests/setup/jest-dotenv.setup.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup/setup.js"]


# jest-dotenv.setup.js
  dotenv.config({ path: ".env.test", override: true }); 
  console.log("Loaded test environment:", process.env.NODE_ENV);


### ⚠️ Notes
- All protected endpoints require:  
  ```http
  Authorization: Bearer <token>
  