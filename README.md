# CodeColab

CodeColab is a full-stack real-time collaboration and communication platform built to demonstrate modern web development concepts from backend fundamentals to real-time systems, security, testing, Docker, and deployment.

The project is being built **module by module**, with each module completing a meaningful part of the application.

---

## 🚀 Project Goals

CodeColab is designed to demonstrate:

* Full-stack application development
* REST API architecture
* Authentication and authorization
* Secure JWT-based sessions
* User profiles and friendships
* Real-time communication
* WebSocket communication with Socket.IO
* Message persistence
* Notifications
* File and image uploads
* Pagination and search
* Redis
* Optimistic UI
* Application security
* Automated testing
* API documentation
* Docker
* CI/CD
* Production deployment

---

# 🛠️ Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Backend

* Node.js
* Express.js
* REST APIs
* Socket.IO

## Database

* MongoDB
* Mongoose

## Authentication & Security

* JWT
* HTTP-only cookies
* bcrypt
* Access tokens
* Refresh tokens
* Refresh-token rotation

## Planned Technologies

* Redis
* Docker
* Cloudinary
* Swagger / OpenAPI
* Unit & integration testing
* CI/CD

---

# 🏗️ High-Level Architecture

```text
                    ┌─────────────────────┐
                    │      Next.js        │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
              REST API                  Socket.IO
                 │                           │
                 ▼                           ▼
        ┌────────────────────────────────────────┐
        │          Node.js + Express             │
        │                                        │
        │        Application / API Layer         │
        └──────────────────────┬─────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │     Mongoose        │
                    └─────────────────────┘
                               │
                         Optional Redis
```

---

# 📦 Planned Data Models

The application is expected to contain the following major entities:

* User
* RefreshToken
* FriendRequest
* Friendship
* Conversation
* ConversationMember
* Message
* Notification

Additional models may be introduced if required during development.

---

# 🔐 Authentication Architecture

CodeColab uses a two-token authentication system.

## Access Token

The access token is:

* Short-lived
* JWT-based
* Sent through the `Authorization` header
* Used to access protected API endpoints

Example:

```text
Authorization: Bearer <access-token>
```

## Refresh Token

The refresh token is:

* Long-lived
* Stored in an HTTP-only cookie
* Hashed before being stored in MongoDB
* Rotated whenever a new access token is requested
* Revoked during logout

The refresh token is never returned in the normal login JSON response.

---

## Authentication Flow

```text
                    LOGIN
                      │
                      ▼
               Verify credentials
                      │
                      ▼
              Generate JWT tokens
                 /           \
                /             \
               ▼               ▼
       Access Token       Refresh Token
            │                  │
            │                  ▼
            │           Hash + store in DB
            │                  │
            ▼                  ▼
      JSON response       HTTP-only cookie
```

### Refresh Flow

```text
Client
  │
  │ Refresh request
  ▼
HTTP-only Refresh Cookie
  │
  ▼
Verify Refresh JWT
  │
  ▼
Find matching hashed token
  │
  ▼
Delete old token
  │
  ▼
Generate new tokens
  │
  ├──────────────► New Access Token
  │
  └──────────────► New Refresh Token
                         │
                         ▼
                   Store hash in DB
```

This provides **refresh-token rotation**, meaning an old refresh token becomes invalid after successful rotation.

---

# 🔌 Authentication API

Base URL:

```text
/api/auth
```

## Register

```http
POST /api/auth/register
```

Creates a new user account.

### Request

```json
{
  "name": "Shawn",
  "username": "shawn",
  "email": "shawn@example.com",
  "password": "password123"
}
```

---

## Login

```http
POST /api/auth/login
```

Authenticates a user.

Returns:

* User information
* Access token

The refresh token is stored in an HTTP-only cookie.

---

## Current User

```http
GET /api/auth/me
```

Protected endpoint.

Requires:

```http
Authorization: Bearer <access-token>
```

Returns the currently authenticated user.

---

## Refresh Token

```http
POST /api/auth/refresh
```

Uses the refresh-token cookie to:

1. Verify the refresh token
2. Find the corresponding stored token
3. Rotate the refresh token
4. Generate a new access token

---

## Logout

```http
POST /api/auth/logout
```

Revokes the refresh-token session and clears the refresh-token cookie.

---

# 🧱 Backend Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── auth.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── validation.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   └── refreshToken.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── health.routes.js
│   │
│   ├── services/
│   │   └── auth.service.js
│   │
│   ├── utils/
│   │   └── token.utils.js
│   │
│   ├── validators/
│   │   └── auth.validator.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

---

# 📋 Completed Modules

## Module 0 — Requirements & Architecture

**Status: ✅ Complete**

Defined:

* Project purpose
* Core features
* Technology stack
* Architecture
* Data models
* Authentication strategy
* Development roadmap

---

## Module 1 — Backend Foundation

**Status: ✅ Complete**

Implemented:

* Node.js backend
* Express server
* MongoDB connection
* Mongoose
* Environment variables
* CORS
* Cookie parser
* JSON parsing
* Health-check endpoint
* Backend folder structure

---

## Module 2 — Authentication

**Status: ✅ Complete**

Implemented:

* User model
* Refresh-token model
* User registration
* Request validation
* Password hashing with bcrypt
* Login
* JWT access tokens
* JWT refresh tokens
* HTTP-only refresh-token cookies
* Access-token middleware
* Protected `/me` endpoint
* Refresh-token hashing
* Refresh-token rotation
* Refresh-token expiration
* Logout
* Refresh-token revocation
* Duplicate email protection
* Duplicate username protection
* Invalid-token handling

### Authentication Testing

Verified successfully:

* Registration
* Duplicate email rejection
* Duplicate username rejection
* Password hashing
* Login
* Invalid password rejection
* Access-token authentication
* Protected `/me`
* Refresh token
* Refresh-token rotation
* Old refresh-token invalidation
* Logout
* Revoked refresh-token rejection
* Request validation

---

# 🔜 Current Development Status

**Completed:** Module 0 → Module 2

**Next:** Module 3 — User & Profile

---

# 🔄 Development Workflow

Every module follows this workflow:

```text
PLAN
  ↓
DESIGN
  ↓
IMPLEMENT
  ↓
TEST
  ↓
DEBUG
  ↓
EXPLAIN
  ↓
UPDATE README
  ↓
UPDATE ROADMAP
  ↓
NEXT MODULE
```

The README and roadmap are updated after every completed module so the project always reflects its current state.

---

# 📚 Learning Objective

CodeColab is not being built simply as a functional application.

The goal is to understand **why each technology and architectural decision is being used**, including:

* Authentication architecture
* API design
* Database design
* Security
* Real-time communication
* State management
* Scalability
* Caching
* Testing
* Containerization
* Deployment

Every major implementation should therefore be understood before moving to the next module.

---

# 📌 Project Status

```text
Module 0  ████████████████████  Complete
Module 1  ████████████████████  Complete
Module 2  ████████████████████  Complete
Module 3  ░░░░░░░░░░░░░░░░░░░░  Next
```

CodeColab is currently in **Phase 1 — Backend Foundation**.
