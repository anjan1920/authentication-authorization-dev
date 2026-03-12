# Authentication & Authorization System -- Technical Documentation

This document explains **how the system works internally** so that when
the project is reopened later it is easy to understand the flow of
routes, middleware, controllers, and database interactions.

---

# 1. Project Overview

This project is a backend authentication and authorization system built
using:

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Nodemailer

Main features:

- User Registration
- Email Verification
- Login with JWT
- Refresh Token System
- Forgot Password / Reset Password
- Role Based Authorization
- Admin Protected Routes

---

# 2. High Level Architecture

Client ↓ Express Server ↓ Route Layer ↓ Middleware Layer (Validation /
Authentication / Authorization) ↓ Controller Layer ↓ Database (MongoDB)
↓ Response to Client

---

# 3. Server Startup Flow

Server is started using:

node index.js

Flow:

index.js → connectDB() → app.listen() → server starts listening for
requests

After this, all requests are handled by **app.js**.

Request lifecycle:

Client Request → app.js → Route File → Middleware → Controller →
Database → Response

---

# 4. Project Folder Structure

backend
│
├── src
│   │
│   ├── controllers              # business logic for routes
│   │   ├── admin.Controller.Login.js
│   │   ├── auth.controllers.js
│   │   ├── getAllUsers.controllers.js
│   │
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


---

# 5. Request Lifecycle

General request flow inside the system:

Client Request → app.js → Route File → Validation Middleware →
Authentication Middleware → Authorization Middleware → Controller →
Database Operation → Response Sent

---

# 6. Middleware System

Middleware runs before the controller and processes the request.

## verifyJWT (Authentication)

Purpose: Authenticate user using JWT access token.

Flow:

Extract token from:

cookies → accessToken

OR

Authorization Header → Bearer token

Then:

jwt.verify(token, ACCESS_TOKEN_SECRET)

After verification:

Decode payload

Get userId

Find user from database

Attach user to request:

req.user = user

Call next()

Meaning:

Authentication = "Who are you"

---

## verifyRole (Authorization)

Purpose: Allow only specific roles to access route.

Example:

verifyRole("admin")

Flow:

Check:

req.user.role === "admin"

If role matches:

next()

Otherwise:

Access denied

Meaning:

Authorization = "Are you allowed"

---

# 7. Registration Flow

Endpoint:

POST /api/v1/auth/register

Flow:

Client Request → auth.route.js → validation middleware → register
controller

Controller logic:

Extract email, username, password

Check existing user:

\$or : \[email, username\]

If exists:

Return 409 Conflict

If not exists:

Create user with

isEmailVerified = false

Generate email verification token.

Token function returns:

rawToken → send to user

hashedToken → store in database

expiryTime

Store in DB:

emailVerificationToken

emailVerificationExpiry

Send email using nodemailer.

Return response:

User registered successfully.

---

# 8. Email Verification Flow

User receives verification email.

Flow:

User clicks verification link → React page loads → token read from URL

Client calls:

POST /api/v1/auth/verify-email/:token

Server logic:

Extract token

Hash token

Search user where:

emailVerificationToken = hashedToken

If found:

Set:

isEmailVerified = true

Remove verification token

Return success response.

---

# 9. Login Flow

Endpoint:

POST /api/v1/auth/login

Flow:

Client → validation middleware → login controller

Controller:

Extract email and password

Find user using email

Compare password with hashed password in database

If valid:

Generate:

accessToken

refreshToken

Send tokens as HTTP-only cookies.

---

# 10. Token System

Two tokens are used.

## Access Token

Short lived

Used for authenticating API requests.

## Refresh Token

Long lived

Used to generate new access tokens.

Flow:

Access token expires → client sends refresh token → server verifies
refresh token → server generates new tokens

---

# 11. Forgot Password Flow

User clicks:

Forgot Password

Client calls:

POST /forgot-password

Body:

email

Server:

Find user using email

Generate password reset token

Token generator returns:

rawToken

hashedToken

expiry

Store in DB:

forgotPasswordToken

forgotPasswordExpiry

Send email with reset link:

client/reset-password/RAW_TOKEN

---

# 12. Reset Password Flow

User clicks reset password link.

Flow:

User enters new password

Client calls:

POST /reset-password/:token

Server:

Extract token

Hash token

Find user where:

forgotPasswordToken = hashedToken

AND

expiry \> current time

If valid:

Update password

Remove reset token fields

Return response:

Password reset successful

---

# 13. Get Current User

Endpoint:

GET /current-user

Flow:

Client sends access token in Authorization header.

Server:

Verify JWT

Decode token

Extract userId

Find user from database

Remove sensitive fields

Return user object.

---

# 14. Change Password

Endpoint:

POST /change-password

Body:

oldPassword

newPassword

Flow:

Verify access token

Decode token

Get userId

Find user

Compare oldPassword

If correct:

Update password

Return success response.

---

# 15. Logout Flow

Endpoint:

POST /logout

Browser automatically sends cookies:

accessToken

refreshToken

Server:

Extract refreshToken

Verify refreshToken

Decode token

Get userId

Remove refreshToken from database

Clear cookies

Send response:

Logout successful

---

# 16. Delete User

Flow:

User clicks delete account

Client sends request with:

accessToken (header)

password (body)

Server:

Verify token

Get userId

Find user

Verify password

Delete user document

Clear tokens

Return success response.

---

# 17. Admin Protected Routes

Example:

GET /api/v1/users

Middleware chain:

verifyJWT → verifyRole("admin") → controller

Controller returns:

- user count
- user emails
- verification status

Only admin can access this route.

---

# 18. Security Measures

Security decisions implemented:

- Password hashing using bcrypt
- JWT authentication
- Access and Refresh token system
- HTTP-only cookies for tokens
- Email verification before login
- Hashed tokens stored in database

---

# 19. Example Request Flow

Example endpoint:

GET /api/v1/healthcheck

Flow:

Client → app.js → health.route.js → verifyJWT → verifyRole("admin") →
health controller → response
