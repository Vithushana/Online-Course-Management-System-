/**
 * Swagger Configuration for Student Service
 * Tells swagger-jsdoc where to find our JSDoc comments
 * and what metadata to display in the Swagger UI.
 */

const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Service API',
      version: '1.0.0',
      description:
        'Manages student registration and profile data for the Online Course Management System. ' +
        'Part of IT4020 Assignment 2 — implemented by Mathumitha G.',
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Student Service (direct)' },
    ],
  },
  // Path to files containing Swagger annotations
  apis: ['./services/student-service/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
