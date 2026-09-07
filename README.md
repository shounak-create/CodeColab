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
                    │      Next.js        │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
              REST API                  Socket.IO
                 │                           │
                 ▼                           ▼
        ┌────────────────────────────────────────┐
        │          Node.js + Express             │
        │                                        │
        │        Application / API Layer         │
        └──────────────────────┬─────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │     Mongoose        │
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
                 /           \
                /             \
               ▼               ▼
       Access Token       Refresh Token
            │                  │
            │                  ▼
            │           Hash + store in DB
            │                  │
            ▼                  ▼
      JSON response       HTTP-only cookie
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
# 👤 User & Profile System
The user system builds on top of the authentication system and provides profile management and user discovery.
## Profile Features
Authenticated users can:
* View their own profile
* Update their name
* Update their username
* Update their avatar
* Change their email
* Change their password
* Search for other users
Users can also view another user's **public profile**.
---
## Profile Data Security
Public profiles expose only non-sensitive information:
```text
name
username
avatar
status
createdAt
```
Private information such as email is only returned through authenticated profile access.
Passwords are never returned by the API.
Passwords remain hashed using bcrypt in MongoDB.
---
## User API
Base URL:
```text
/api/users
```
### Get Own Profile
```http
GET /api/users/me
```
Authentication required.
Uses the authenticated user's ID from the verified JWT.
---
### Get Public Profile
```http
GET /api/users/:username
```
Returns public profile information for the specified username.
---
### Update Profile
```http
PATCH /api/users/me
```
Can update:
```json
{
  "name": "New Name",
  "username": "new_username",
  "avatar": "https://example.com/avatar.jpg"
}
```
Authentication and validation are required.
Username uniqueness is checked before updating.
---
### Change Email
```http
PATCH /api/users/me/email
```
Example:
```json
{
  "email": "newemail@example.com"
}
```
The email is normalized and checked for duplicates.
---
### Change Password
```http
PATCH /api/users/me/password
```
Example:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```
The current password is verified with bcrypt before the new password is hashed and stored.
---
### Search Users
```http
GET /api/users/search?q=sha
```
Searches users by:
* Name
* Username
Results are limited to 20 users and only return non-sensitive profile information.
---
# 🧱 Backend Structure
```text
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── validation.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   └── refreshToken.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── health.routes.js
│   │   └── user.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   └── user.service.js
│   │
│   ├── utils/
│   │   └── token.utils.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   └── user.validator.js
│   │
│   ├── app.js
│   └── server.js
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
* Development workflow
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
* Refresh
* Refresh-token rotation
* Old refresh-token invalidation
* Logout
* Revoked refresh-token rejection
* Request validation
---
## Module 3 — User & Profile
**Status: ✅ Complete**
Implemented:
* Get authenticated user's profile
* Get public user profile
* Update profile
* Update name
* Update username
* Update avatar
* Username uniqueness checking
* Change email
* Email uniqueness checking
* Change password
* Current-password verification
* New-password hashing
* User search
* Search by name
* Search by username
* Search result limiting
* Profile validation
* Sensitive-field protection
### User & Profile Testing
Verified successfully:
* Own profile retrieval
* Public profile retrieval
* Nonexistent user handling
* Profile updates
* Username updates
* Duplicate username rejection
* Avatar validation
* Email updates
* Duplicate email rejection
* Password changes
* Incorrect current-password rejection
* Old password invalidation
* New password verification
* Sensitive fields not exposed
* User search
* Search validation
* Authentication protection
---
# 🤝 Connections
## Module 4 — Friend Requests
**Status: ✅ Complete**
Implemented:
Friend request creation
Received request retrieval
Sent request retrieval
Accept, reject, and cancel flows
Duplicate request protection
Reverse pending-request protection
Self-request protection
Request validation
Request ownership checks
Authentication protection
### Friend Request API
```text
POST   /api/friend-requests/:userId
GET    /api/friend-requests/received
GET    /api/friend-requests/sent
PATCH  /api/friend-requests/:requestId/accept
PATCH  /api/friend-requests/:requestId/reject
DELETE /api/friend-requests/:requestId
```
### Testing
Verified successfully:
Send request
Duplicate request rejection
Reverse pending request rejection
Self-request rejection
Nonexistent user handling
Invalid user ID handling
Received requests
Sent requests
Unauthorized accept
Request acceptance
Double acceptance protection
Request rejection
Request cancellation
Unauthorized cancellation
Authentication protection
---
## Module 5 — Friendships
**Status: ✅ Complete**
Implemented:
Friendship creation after request acceptance
Normalized user-pair representation
Unique friendship constraint
Friend list retrieval
Bidirectional friendship checks
Friendship removal
Friendship validation
Authentication and authorization protection
Sensitive-field protection
Friendships are created through the friend-request acceptance flow rather than through a public friendship-creation endpoint.
### Friendship API
```text
GET    /api/friendships
GET    /api/friendships/check/:userId
DELETE /api/friendships/:userId
```
### Testing
Verified successfully:
Friendship creation after acceptance
Friend list for both users
Bidirectional friendship checks
Non-friend checks
Duplicate friendship protection
Friendship removal
Removal reflected for both users
Nonexistent friendship handling
Invalid user ID handling
Authentication protection
---
# 🔜 Current Development Status
**Completed:** Module 0 → Module 3
**Next:** Module 6 — Conversations
---
# 🔄 Development Workflow
Every module follows:
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
The README and roadmap are updated after every completed module.
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
Module 0  ████████████████████  Complete
Module 1  ████████████████████  Complete
Module 2  ████████████████████  Complete
Module 3  ████████████████████  Complete
Module 4  ░░░░░░░░░░░░░░░░░░░░  Next
```
CodeColab is currently progressing through **Phase 2 — Connections** and is ready to begin **Phase 3 — Chat Backend** with Module 6 — Conversations.