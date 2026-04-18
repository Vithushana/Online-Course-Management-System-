/**
 * API Gateway — Entry Point
 * Runs on port 3000 and proxies requests to the 4 microservices.
 *
 * Why do we need this?
 *   Without the gateway, clients would need to know 4 different ports
 *   (3001, 3002, 3003, 3004). The gateway provides ONE entry point
 *   (port 3000) and routes each request to the correct service.
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');
const services = require('./config/proxy');

const app = express();
const PORT = 3000;

// ---------- Middleware ----------
app.use(cors());
app.use(morgan('dev'));

// ---------- Unified Swagger UI ----------
// Serves a single Swagger dashboard at /api-docs with a dropdown
// to switch between all 4 microservice API specs.
// Each spec is fetched from the native service's swagger-json endpoint.

// Proxy each service's swagger-json so it is accessible via port 3000
app.get('/swagger-json/students', async (req, res) => {
  try {
    const resp = await fetch('http://localhost:3001/swagger-json');
    const spec = await resp.json();
    // Rewrite the server URL so "Try it out" calls go through the gateway
    spec.servers = [{ url: 'http://localhost:3000', description: 'API Gateway' }];
    res.json(spec);
  } catch (err) {
    res.status(502).json({ message: 'Student Service unavailable' });
  }
});

app.get('/swagger-json/courses', async (req, res) => {
  try {
    const resp = await fetch('http://localhost:3002/swagger-json');
    const spec = await resp.json();
    spec.servers = [{ url: 'http://localhost:3000', description: 'API Gateway' }];
    res.json(spec);
  } catch (err) {
    res.status(502).json({ message: 'Course Service unavailable' });
  }
});

app.get('/swagger-json/enrollments', async (req, res) => {
  try {
    const resp = await fetch('http://localhost:3003/swagger-json');
    const spec = await resp.json();
    spec.servers = [{ url: 'http://localhost:3000', description: 'API Gateway' }];
    res.json(spec);
  } catch (err) {
    res.status(502).json({ message: 'Enrollment Service unavailable' });
  }
});

app.get('/swagger-json/instructors', async (req, res) => {
  try {
    const resp = await fetch('http://localhost:3004/swagger-json');
    const spec = await resp.json();
    spec.servers = [{ url: 'http://localhost:3000', description: 'API Gateway' }];
    res.json(spec);
  } catch (err) {
    res.status(502).json({ message: 'Instructor Service unavailable' });
  }
});

// Mount Swagger UI with dropdown (urls option)
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    urls: [
      { url: '/swagger-json/students',    name: 'Student Service API' },
      { url: '/swagger-json/courses',     name: 'Course Service API' },
      { url: '/swagger-json/enrollments', name: 'Enrollment Service API' },
      { url: '/swagger-json/instructors', name: 'Instructor Service API' },
    ],
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));

// ---------- Proxy routes ----------
// For each service entry, create a proxy that forwards matching requests
services.forEach(({ route, target }) => {
  app.use(
    route,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      // Log when a request is proxied (helpful for debugging)
      onProxyReq: (proxyReq, req) => {
        console.log(`🔀 Proxying ${req.method} ${req.originalUrl} → ${target}${req.originalUrl}`);
      },
    })
  );
});

// ---------- Gateway landing page ----------
app.get('/', (req, res) => {
  res.json({
    service: 'API Gateway',
    status: 'running',
    message: 'Online Course Management System — API Gateway',
    routes: {
      students: '/api/students   → http://localhost:3001',
      courses: '/api/courses    → http://localhost:3002',
      enrollments: '/api/enrollments → http://localhost:3003',
      instructors: '/api/instructors → http://localhost:3004',
    },
    documentation: {
      unifiedDocs: 'http://localhost:3000/api-docs',
      studentDocs: 'http://localhost:3001/api-docs',
      courseDocs: 'http://localhost:3002/api-docs',
      enrollmentDocs: 'http://localhost:3003/api-docs',
      instructorDocs: 'http://localhost:3004/api-docs',
    },
  });
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
  console.log(`📄 Unified Swagger docs: http://localhost:${PORT}/api-docs`);
  console.log('');
  console.log('   Routes:');
  services.forEach(({ route, target }) => {
    console.log(`   ${route} → ${target}`);
  });
  console.log('');
});
