import swaggerJsdoc from 'swagger-jsdoc';
const { version } = require('../../package.json');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Booklist API Documentation',
      version,
      description: 'API documentation for the Booklist application',
      contact: {
        name: 'API Support',
        email: 'support@booklist.com',
        url: 'https://booklist.com/support',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3100/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.booklist.com/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
        },
        BadRequest: {
          description: 'The request was invalid or cannot be served',
        },
        NotFound: {
          description: 'The requested resource was not found',
        },
        ServerError: {
          description: 'Internal server error',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Users',
        description: 'User management',
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/models/*.ts',
    './src/middleware/*.ts'
  ],
};

export const specs = swaggerJsdoc(options);
