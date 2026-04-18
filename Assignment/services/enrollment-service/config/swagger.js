/**
 * Swagger Configuration for Enrollment Service
 */

const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Enrollment Service API',
      version: '1.0.0',
      description:
        'Manages student-course enrollments for the Online Course Management System. ' +
        'Part of IT4020 Assignment 2 — implemented by Shangave M.',
    },
    servers: [
      { url: 'http://localhost:3003', description: 'Enrollment Service (direct)' },
    ],
  },
  apis: ['./services/enrollment-service/routes/*.js'],
};

module.exports = swaggerJSDoc(options);
