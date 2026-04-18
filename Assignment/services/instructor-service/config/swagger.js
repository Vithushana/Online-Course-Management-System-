/**
 * Swagger Configuration for Instructor Service
 */

const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Instructor Service API',
      version: '1.0.0',
      description:
        'Manages instructor profiles and their assigned courses for the Online Course Management System. ' +
        'Part of IT4020 Assignment 2 — implemented by Prasadh N H.',
    },
    servers: [
      { url: 'http://localhost:3004', description: 'Instructor Service (direct)' },
    ],
  },
  apis: ['./services/instructor-service/routes/*.js'],
};

module.exports = swaggerJSDoc(options);
