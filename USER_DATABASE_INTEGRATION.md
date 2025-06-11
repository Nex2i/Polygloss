# User Database Integration

This document describes the implementation of user database integration with Supabase authentication.

## Overview

The application now creates users in the PostgreSQL database after Supabase signup and fetches user data after login. This provides a local database record for each user while maintaining Supabase for authentication.

## Changes Made

### 1. Database Schema

Added a `User` model to the Prisma schema (`server/prisma/schema.prisma`):

```prisma
model User {
  id            String    @id @default(cuid())
  supabaseId    String    @unique
  email         String    @unique
  name          String?
  avatar        String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}
```

### 2. Server-Side Changes

#### Prisma Client Setup
- Created `server/src/lib/prismaClient.ts` for database connection
- Added proper connection handling and logging

#### User Service
- Created `server/src/modules/user.service.ts` with methods for:
  - Creating users
  - Fetching users by Supabase ID
  - Fetching users by email
  - Updating user data
  - Deleting users

#### API Endpoints
Added new authentication routes to `server/src/routes/authentication.routes.ts`:

- `POST /api/auth/users` - Create user after signup
- `GET /api/auth/me` - Fetch current user data

### 3. Client-Side Changes

#### API Client
- Updated `client/src/lib/apiClient.ts` to use class-based approach
- Added methods for user creation and fetching
- Integrated with Supabase authentication tokens

#### Redux Store
- Created `client/src/store/userSlice.ts` for user state management
- Added async thunks for user operations
- Integrated with existing Redux store

#### Authentication Flow
- Updated `client/src/routes/auth.tsx` to create database users after signup
- Updated `client/src/routes/__root.tsx` to fetch user data after login
- Added proper loading states and error handling

## Authentication Flow

### Signup Process
1. User signs up with Supabase
2. Client calls `POST /api/auth/users` to create database record
3. User record is stored in Redux state
4. User is redirected to dashboard

### Login Process
1. User logs in with Supabase
2. Client calls `GET /api/auth/me` to fetch user data
3. If user doesn't exist in database, it's created automatically
4. User data is stored in Redux state
5. User is redirected to dashboard

### User Data Access
- Supabase handles authentication and sessions
- Database stores additional user profile data
- Redux store manages user state in the client
- Navigation shows user name or email as available

## API Endpoints

### Create User
```
POST /api/auth/users
Content-Type: application/json
```

Body:
```json
{
  "supabaseId": "string",
  "email": "string",
  "name": "string (optional)",
  "avatar": "string (optional)"
}
```

### Get Current User
```
GET /api/auth/me
Authorization: Bearer <supabase_token>
```

Response:
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string | null",
    "avatar": "string | null",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "supabaseUser": {
    "id": "string",
    "email": "string",
    "emailConfirmed": "boolean"
  }
}
```

## Error Handling

- Database connection errors are properly caught and logged
- Duplicate user creation is handled gracefully
- Missing users are created automatically on login
- Failed database operations don't prevent authentication

## Usage

After implementing these changes:

1. Run the database migration:
   ```bash
   cd server
   npx prisma migrate deploy
   ```

2. Start the server:
   ```bash
   npm run dev
   ```

3. Start the client:
   ```bash
   cd client
   npm run dev
   ```

4. Test the flow:
   - Sign up a new user
   - Verify user is created in database
   - Log out and log back in
   - Verify user data is fetched from database

The application now maintains a complete user record in the database while leveraging Supabase for secure authentication. 