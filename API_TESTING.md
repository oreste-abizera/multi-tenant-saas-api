# API Testing Guide

This document provides examples for testing all API endpoints using curl or any HTTP client.

## Prerequisites

1. Ensure PostgreSQL is running
2. Set up the database: `npm run prisma:migrate`
3. Start the server: `npm run dev` or `npm start`

## Authentication Endpoints

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get User Profile

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "memberships": []
  }
}
```

## Organization Endpoints

### 4. Create Organization

```bash
curl -X POST http://localhost:3000/api/organizations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Company"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": {
    "id": "org-uuid",
    "name": "My Company",
    "slug": "my-company",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "memberships": [
      {
        "id": "membership-uuid",
        "role": "OWNER",
        "userId": "user-uuid",
        "organizationId": "org-uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": "user-uuid",
          "email": "john@example.com",
          "name": "John Doe"
        }
      }
    ]
  }
}
```

### 5. Get All Organizations (for current user)

```bash
curl -X GET http://localhost:3000/api/organizations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "org-uuid",
      "name": "My Company",
      "slug": "my-company",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "role": "OWNER"
    }
  ]
}
```

### 6. Get Organization Details

```bash
curl -X GET http://localhost:3000/api/organizations/ORG_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "org-uuid",
    "name": "My Company",
    "slug": "my-company",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "memberships": [
      {
        "id": "membership-uuid",
        "role": "OWNER",
        "userId": "user-uuid",
        "organizationId": "org-uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": "user-uuid",
          "email": "john@example.com",
          "name": "John Doe"
        }
      }
    ]
  }
}
```

### 7. Update Organization (Admin/Owner only)

```bash
curl -X PUT http://localhost:3000/api/organizations/ORG_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Company Name"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Organization updated successfully",
  "data": {
    "id": "org-uuid",
    "name": "Updated Company Name",
    "slug": "updated-company-name",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 8. Delete Organization (Owner only)

```bash
curl -X DELETE http://localhost:3000/api/organizations/ORG_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Organization deleted successfully"
}
```

## Member Management Endpoints

### 9. Add Member to Organization (Admin/Owner only)

```bash
curl -X POST http://localhost:3000/api/organizations/ORG_ID/members \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "member@example.com",
    "role": "MEMBER"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Member added successfully",
  "data": {
    "id": "membership-uuid",
    "role": "MEMBER",
    "userId": "member-user-uuid",
    "organizationId": "org-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "member-user-uuid",
      "email": "member@example.com",
      "name": "Member Name"
    }
  }
}
```

### 10. Update Member Role (Admin/Owner only)

```bash
curl -X PUT http://localhost:3000/api/organizations/ORG_ID/members/MEMBER_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "ADMIN"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Member role updated successfully",
  "data": {
    "id": "membership-uuid",
    "role": "ADMIN",
    "userId": "member-user-uuid",
    "organizationId": "org-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "member-user-uuid",
      "email": "member@example.com",
      "name": "Member Name"
    }
  }
}
```

### 11. Remove Member from Organization (Admin/Owner only)

```bash
curl -X DELETE http://localhost:3000/api/organizations/ORG_ID/members/MEMBER_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Member removed successfully"
}
```

## Health Check

### 12. Server Health Check

```bash
curl -X GET http://localhost:3000/health
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Valid email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "No token provided"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Access denied: Requires one of [OWNER, ADMIN] role"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "User not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "User already exists"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Server error"
}
```

## Testing Workflow

1. **Register a user** to get a token
2. **Create an organization** (you'll be the OWNER)
3. **Register another user** (different email)
4. **Add the second user as a member** using their email
5. **Try to update the organization** as the member (should fail with 403)
6. **Update member role to ADMIN**
7. **Now update the organization** as the admin (should succeed)
8. **Try to delete the organization** as admin (should fail - only OWNER can delete)

This workflow tests all the role-based access control features!
