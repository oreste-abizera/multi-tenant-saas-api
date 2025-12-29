# Multi-Tenant SaaS API

A production-ready multi-tenant SaaS backend built with Node.js, Express, TypeScript, PostgreSQL, and Prisma.

## Features

- 🔐 **JWT Authentication** - Secure user authentication with JSON Web Tokens
- 🏢 **Multi-Tenancy** - Organizations/workspaces with isolated data access
- 👥 **Role-Based Access Control** - Three roles: OWNER, ADMIN, MEMBER
- 🛡️ **Protected Routes** - Organization-scoped data access
- ✅ **Input Validation** - Request validation using express-validator
- 🚨 **Error Handling** - Centralized error handling middleware
- 🔒 **Security** - Helmet for security headers, CORS enabled
- 📊 **Database** - PostgreSQL with Prisma ORM
- 🏗️ **TypeScript** - Full type safety

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: Helmet, bcryptjs
- **CORS**: cors

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/oreste-abizera/multi-tenant-saas-api.git
cd multi-tenant-saas-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saas_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"
```

### 4. Set up the database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 5. Start the server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Organizations

#### Create Organization
```http
POST /api/organizations
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Organization"
}
```

#### Get All Organizations
```http
GET /api/organizations
Authorization: Bearer <token>
```

#### Get Organization Details
```http
GET /api/organizations/:organizationId
Authorization: Bearer <token>
```

#### Update Organization (Admin/Owner only)
```http
PUT /api/organizations/:organizationId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Organization Name"
}
```

#### Delete Organization (Owner only)
```http
DELETE /api/organizations/:organizationId
Authorization: Bearer <token>
```

### Members Management

#### Add Member (Admin/Owner only)
```http
POST /api/organizations/:organizationId/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "member@example.com",
  "role": "MEMBER"
}
```

#### Update Member Role (Admin/Owner only)
```http
PUT /api/organizations/:organizationId/members/:memberId
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "ADMIN"
}
```

#### Remove Member (Admin/Owner only)
```http
DELETE /api/organizations/:organizationId/members/:memberId
Authorization: Bearer <token>
```

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| **OWNER** | Full access: manage organization, members, roles, delete organization |
| **ADMIN** | Manage members, update organization settings |
| **MEMBER** | View organization data |

## Database Schema

### User
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password`: String (Hashed)
- `name`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Organization
- `id`: UUID (Primary Key)
- `name`: String
- `slug`: String (Unique)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Membership
- `id`: UUID (Primary Key)
- `role`: Enum (OWNER, ADMIN, MEMBER)
- `userId`: UUID (Foreign Key)
- `organizationId`: UUID (Foreign Key)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── index.ts     # App configuration
│   └── database.ts  # Prisma client
├── controllers/      # Route controllers
│   ├── auth.controller.ts
│   └── organization.controller.ts
├── middleware/       # Express middleware
│   ├── auth.ts      # JWT authentication
│   ├── error.ts     # Error handling
│   ├── organization.ts  # Organization & role checks
│   └── validate.ts  # Request validation
├── routes/          # API routes
│   ├── auth.routes.ts
│   ├── organization.routes.ts
│   └── index.ts
├── types/           # TypeScript types
│   └── index.ts
├── utils/           # Utility functions
│   ├── auth.ts      # Auth helpers
│   └── helpers.ts   # General helpers
├── app.ts           # Express app setup
└── index.ts         # Server entry point
```

## Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build            # Compile TypeScript
npm start                # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
```

## Security Considerations

1. **JWT Secret**: Always use a strong, random secret in production
2. **Password Hashing**: Passwords are hashed using bcrypt with salt rounds of 10
3. **CORS**: Configure CORS settings based on your frontend domain
4. **Helmet**: Security headers are automatically set
5. **Environment Variables**: Never commit `.env` file to version control

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": []  // Optional validation errors
}
```

## Health Check

```http
GET /health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## License

ISC

## Author

Oreste Abizera
