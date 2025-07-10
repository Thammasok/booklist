# Booklist Backend Service

This is the backend service for the Booklist application, built with Node.js, TypeScript, Express, and MongoDB. It provides a RESTful API for the Booklist web application.

## 🚀 Features

- **Modern Stack**: Built with Node.js, TypeScript, and Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication system
- **API Documentation**: Interactive Swagger UI
- **Validation**: Request validation with express-validator
- **Error Handling**: Comprehensive error handling middleware
- **Environment Configuration**: Support for different environments (dev, prod)
- **Type Safety**: Full TypeScript support
- **Containerized**: Ready for Docker deployment

## 📁 Project Structure

```
service/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── app.ts          # Express app configuration
│   └── server.ts       # Server entry point
├── .env.example       # Example environment variables
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

## 🛠️ Prerequisites

- Node.js (v18 or later)
- MongoDB (local or remote)
- npm or yarn

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Update the .env file with your configuration
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the API**
   - API Base URL: http://localhost:3100
   - API Documentation: http://localhost:3100/api-docs

## 📚 API Documentation

Interactive API documentation is available at `/api-docs` when the server is running. It includes:

- All available endpoints
- Request/response schemas
- Example requests
- Authentication requirements

## 🔒 Authentication

The API uses JWT for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

## 🧪 Testing

Run tests with:

```bash
npm test
```

## 🐳 Docker

Build and run with Docker:

```bash
docker-compose up -d
```

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MongoDB (local or remote instance)
- Docker (optional, for containerized MongoDB)

## API Documentation

### Interactive API Documentation with Swagger UI

The application includes an interactive API documentation system built with Swagger UI, which provides a web interface to:

- 📚 View all available API endpoints with detailed descriptions
- 🔍 Test API calls directly from your browser
- 📝 View request/response schemas and examples
- 🔐 Understand authentication requirements for each endpoint
- 📱 See example requests and responses

**Access the Swagger UI at:** [http://localhost:3100/api-docs/](http://localhost:3100/api-docs/)

### Available API Endpoints

#### Authentication
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Authenticate user and get JWT token
- `GET /api/v1/users/verify-email/:token` - Verify email address
- `POST /api/v1/users/resend-verification` - Resend verification email

#### User Management
- `GET /api/v1/users/me` - Get current user profile
- `DELETE /api/v1/users/delete-account` - Soft delete user account
- `POST /api/v1/users/restore-account` - Restore soft-deleted account

### Working with the API

#### Authentication
Most endpoints require a JWT token for authentication. Include the token in the `Authorization` header:
```
Authorization: Bearer your.jwt.token.here
```

#### Request/Response Format
- All API responses follow a standard format:
  ```json
  {
    "success": true,
    "message": "Operation completed successfully",
    "data": {}
  }
  ```
- Error responses include an error message and appropriate HTTP status code

### OpenAPI Specification

The API follows the OpenAPI 3.0 specification. You can generate the OpenAPI specification file:

```bash
npm run generate:openapi
```

This will create an `openapi.json` file in the project root, which can be used to:
- Generate client SDKs for various languages
- Import into API testing tools like Postman
- Generate additional documentation

### Testing the API

You can test the API directly from the Swagger UI by:
1. Opening [http://localhost:3100/api-docs/](http://localhost:3100/api-docs/)
2. Clicking on an endpoint
3. Clicking "Try it out"
4. Entering any required parameters
5. Clicking "Execute"

### Example API Requests

#### Register a New User
```http
POST /api/v1/users/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### Get Current User (Authenticated)
```http
GET /api/v1/users/me
Authorization: Bearer your.jwt.token.here
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Thammasok/booklist.git
   cd service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and update the values as needed.

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The server will be available at `http://localhost:3100`

## Available Scripts

- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── app.ts                 # Express app configuration and server entry point
├── config/                # Configuration files
│   └── db.ts              # Database connection setup
├── controllers/           # Route controllers
│   ├── authController.ts  # Authentication logic
│   └── userController.ts  # User management logic
├── middleware/            # Custom middleware
│   └── auth.ts            # Authentication middleware
├── models/                # Database models
│   └── User.ts            # User model and interfaces
├── routes/                # API routes
│   └── userRoutes.ts      # User-related routes
├── services/              # Business logic services
│   └── emailService.ts    # Email sending functionality
└── types/                 # TypeScript type definitions
    └── express/           # Extended Express types
```

## Authentication Flow

1. **Registration**
   - User provides email, username, and password
   - System creates a new user with `isVerified: false`
   - Verification email is sent with a time-limited token

2. **Email Verification**
   - User clicks verification link in email
   - System verifies token and updates user to `isVerified: true`

3. **Login**
   - User provides email and password
   - System verifies credentials and returns JWT token
   - Subsequent requests include token in `Authorization: Bearer <token>` header

4. **Account Recovery**
   - User requests password reset
   - System sends email with reset link
   - User sets new password using the link

5. **Account Deletion**
   - User can soft-delete their account
   - Account is marked as deleted but retained for 30 days
   - Can be restored within the grace period

## API Endpoints

### Authentication

#### Register a new user
```
POST /api/v1/users/register
```

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
- Creates a new user with default role 'user'
- Sends a verification email with a verification link
- User must verify their email before they can log in

#### Login user
```
POST /api/v1/users/login
```

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Responses:**
- `200` - Successfully logged in
- `401` - Invalid credentials
- `403` - Email not verified (includes `requiresVerification: true`)
- `401` - Account deactivated

#### Verify email
```
GET /api/v1/users/verify-email/:token
```

**Response:**
- Verifies the user's email using the token sent to their email
- After verification, user can log in

#### Resend verification email
```
POST /api/v1/users/resend-verification
```

**Request Body:**
```json
{
  "email": "test@example.com"
}
```

#### Get current user
```
GET /api/v1/users/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
- Returns the current authenticated user's information
- Excludes sensitive data like password and verification tokens

#### Delete account (soft delete)
```
DELETE /api/v1/users/delete-account
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
- Marks the user's account as deleted
- Account can be restored within 30 days
- After 30 days, the account will be permanently deleted

#### Restore account
```
POST /api/v1/users/restore-account
```

**Request Body:**
```json
{
  "email": "test@example.com"
}
```

**Response:**
- Restores a soft-deleted account if within the 30-day window

### Health Check
- `GET /health` - Health check endpoint

## Environment Variables

### Server Configuration
- `PORT` - Server port (default: 3100)
- `NODE_ENV` - Application environment (development, production, test)

### Database
- `MONGODB_URI` - MongoDB connection string
  - Format: `mongodb://[username:password@]host[:port]/database[?options]`
  - Example: `mongodb://root:example@localhost:27017/booklist?authSource=admin`

### JWT Authentication
- `JWT_SECRET` - Secret key for signing JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time (e.g., '1d', '24h', '7d')

### Email Configuration
- `SMTP_HOST` - SMTP server hostname (e.g., 'smtp.gmail.com')
- `SMTP_PORT` - SMTP port (e.g., 587 for TLS, 465 for SSL)
- `SMTP_SECURE` - Use SSL/TLS (true for port 465, false for others)
- `SMTP_USER` - SMTP authentication username/email
- `SMTP_PASS` - SMTP authentication password or app password
- `EMAIL_FROM_NAME` - Sender name for emails
- `EMAIL_FROM_ADDRESS` - Sender email address
- `CLIENT_URL` - Frontend URL for email links

### Timeouts and Limits
- `EMAIL_VERIFICATION_TTL` - Hours until verification link expires (default: 24)
- `ACCOUNT_RECOVERY_TTL` - Hours until password reset link expires (default: 1)
- `ACCOUNT_DELETION_GRACE_DAYS` - Days before permanently deleting soft-deleted accounts (default: 30)

## Development

1. Make sure MongoDB is running locally or update the `MONGODB_URI` in `.env`
2. Run `npm run dev` for development with hot-reload
3. The server will restart automatically when you make changes

## Production

1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

## License

This project is licensed under the MIT License.
