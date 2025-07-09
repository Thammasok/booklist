# Booklist Backend Service

This is the backend service for the Booklist application, built with Node.js, TypeScript, Express, and MongoDB.

## Features

- TypeScript for type safety
- Express.js web framework
- MongoDB with Mongoose ODM
- Environment configuration
- Basic error handling
- CORS enabled

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MongoDB (local or remote instance)
- Docker (optional, for containerized MongoDB)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Service
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
└── app.ts          # Express app configuration and server entry point
```

Note: The current implementation uses a single `app.ts` file for both Express configuration and server startup. The directory structure shows potential locations for future expansion.

## API Endpoints

- `GET /health` - Health check endpoint

## Environment Variables

- `PORT` - Server port (default: 3100)
- `NODE_ENV` - Environment (development, production, test)
- `MONGODB_URI` - MongoDB connection string

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
