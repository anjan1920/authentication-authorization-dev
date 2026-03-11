
---

# Authentication & Authorization System

A **full-stack authentication and authorization system** built with  **Node.js, Express.js, MongoDB, and JWT** .
Implements a complete authentication lifecycle including  **email verification, access & refresh token rotation, password reset, and role-based access control** .

---

# Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Frontend

* HTML
* Tailwind CSS
* JavaScript (Fetch API)

### Security & Authentication

* JWT (Access Token + Refresh Token)
* Refresh Token Rotation
* bcrypt (password hashing)
* HTTP-only cookies

### Email Service

* Nodemailer (development)
* Brevo SMTP (production)

---

# Features

### Authentication

* User registration
* Email verification
* Login with JWT authentication
* Access Token + Refresh Token
* Refresh Token rotation
* Logout with token invalidation

### Account Management

* Forgot password
* Reset password
* Change password
* Get current logged-in user

### Authorization

* Role-based access control (Admin / User)
* Protected routes using middleware
* Admin endpoint to fetch all users

### Security

* Password hashing using bcrypt
* Secure HTTP-only cookie storage
* Token expiration
* Input validation using express-validator

---

# Application Flow

### Registration

```
User Register
→ Validate input
→ Save user in DB
→ Generate email verification token
→ Send verification email
```

### Email Verification

```
User clicks verification link
→ Frontend extracts token
→ Backend verifies token
→ Email marked as verified
```

### Login

```
User login
→ Verify password
→ Generate Access Token + Refresh Token
→ Send tokens in HTTP-only cookies
```

### Access Protected Routes

```
Request
→ verifyJWT middleware
→ verifyRole middleware
→ Controller executes
```

### Refresh Token

```
Access Token expires
→ Client sends refresh token
→ Server verifies token
→ Generates new Access + Refresh tokens
```

### Logout

```
User logout
→ Clear cookies
→ Remove refresh token from DB
```

---

# API Endpoints

## Authentication

| Method | Endpoint                               | Description               |
| ------ | -------------------------------------- | ------------------------- |
| POST   | `/api/v1/auth/register`              | Register new user         |
| POST   | `/api/v1/auth/login`                 | User login                |
| POST   | `/api/v1/auth/logout`                | Logout user               |
| POST   | `/api/v1/auth/refresh-token`         | Generate new access token |
| POST   | `/api/v1/auth/forgot-password`       | Send password reset email |
| POST   | `/api/v1/auth/reset-password/:token` | Reset password            |
| GET    | `/api/v1/auth/verify-email/:token`   | Verify user email         |
| POST   | `/api/v1/auth/resend-verification`   | Resend verification email |

---

## User

| Method | Endpoint                          | Description                |
| ------ | --------------------------------- | -------------------------- |
| GET    | `/api/v1/users/current-user`    | Get current logged-in user |
| POST   | `/api/v1/users/change-password` | Change user password       |
| DELETE | `/api/v1/users/delete-me`       | Delete user account        |

---

## Admin

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| GET    | `/api/v1/admin/login`       | Admin login              |
| GET    | `/api/v1/admin/healthcheck` | Check server health      |
| GET    | `/api/v1/admin/getAllUsers` | Get all registered users |

---

## System

| Method | Endpoint         | Description      |
| ------ | ---------------- | ---------------- |
| GET    | `/api/v1/home` | Basic test route |

---

# API Testing

All API endpoints were tested using **Postman** during development.

---

# Project Structure

```
backend
│
├── src
│   │
│   ├── controllers              # business logic for routes
│   │   ├── admin.Controller.Login.js
│   │   ├── auth.controllers.js
│   │   ├── getAllUsers.controllers.js
│   │   └── healthcheck.controllers.js
│   │
│   ├── db
│   │   └── index.js              # MongoDB connection setup
│   │
│   ├── middlewares               # authentication & validation middlewares
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── validator.middleware.js
│   │
│   ├── models
│   │   └── user.models.js        # user schema
│   │
│   ├── routes                    # API route definitions
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   └── healthcheck.routes.js
│   │
│   ├── utils                     # reusable helpers
│   │   ├── api-error.js
│   │   ├── api-response.js
│   │   ├── async-handler.js
│   │   └── mail.js
│   │
│   └── validators
│       └── index.js              # request validation rules
│
├── app.js                        # express app configuration
├── index.js                      # server entry point
└── .env                          # environment variables
```

---

# Environment Variables

Create a `.env` file:

```
PORT=

MONGO_PASS=
MONGO_USER_ID=
MONGO_URI=

JWT_SECRET=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=10d
```

---

# Installation

### Clone the repository

```
git clone https://github.com/anjan1920/nodejs-authentication-authorization-system
```

---

### Backend Setup

```
npm install
node index.js or npm run dev
```

---

### Frontend Setup

Navigate to frontend directory:

```
cd frontend
```

Run Tailwind CLI:

```
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
```

---

### Development Note

This repository runs in  **development mode** .
Email verification and password reset links will appear in the  **server terminal** .

Open the link using  **Ctrl + Click** , then click **Verify** to continue to the frontend.

---

# Author

**Anjan Das**
LinkedIn:
[https://www.linkedin.com/in/anjan-das-22b278236](https://www.linkedin.com/in/anjan-das-22b278236)
