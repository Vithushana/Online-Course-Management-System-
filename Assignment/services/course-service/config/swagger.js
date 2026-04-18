/**
 * Swagger Configuration for Course Service
 */

const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Course Service API',
      version: '1.0.0',
      description:
        'Manages course details (title, description, schedule, etc.) for the Online Course Management System. ' +
        'Part of IT4020 Assignment 2 — implemented by Vithushana N.',
    },
    servers: [
      { url: 'http://localhost:3002', description: 'Course Service (direct)' },
    ],
  },
  apis: ['./services/course-service/routes/*.js'],
};

module.exports = swaggerJSDoc(options);
