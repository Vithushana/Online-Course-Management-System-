/**
 * Proxy Configuration
 * Maps incoming URL paths to the correct microservice.
 *
 * How it works:
 *   When the gateway receives a request like GET /api/students,
 *   it looks at this table and forwards (proxies) the request
 *   to http://localhost:3001 where the Student Service is running.
 *   The client only ever talks to port 3000 (the gateway).
 */

const services = [
  {
    // All student-related requests → Student Service
    route: '/api/students',
    target: 'http://localhost:3001',
  },
  {
    // All course-related requests → Course Service
    route: '/api/courses',
    target: 'http://localhost:3002',
  },
  {
    // All enrollment-related requests → Enrollment Service
    route: '/api/enrollments',
    target: 'http://localhost:3003',
  },
  {
    // All instructor-related requests → Instructor Service
    route: '/api/instructors',
    target: 'http://localhost:3004',
  },
];

module.exports = services;
