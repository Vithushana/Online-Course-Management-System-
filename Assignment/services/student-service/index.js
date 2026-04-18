/**
 * Student Service — Entry Point
 * Starts an Express server on port 3001.
 * Mounts student routes and Swagger documentation.
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = 3001;

// ---------- Middleware ----------
app.use(cors());                    // Allow cross-origin requests
app.use(express.json());            // Parse JSON request bodies
app.use(morgan('dev'));             // Log HTTP requests to console

// ---------- Routes ----------
app.use('/api/students', studentRoutes);

// ---------- Swagger UI ----------
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ---------- Swagger JSON (for gateway unified docs) ----------
app.get('/swagger-json', (req, res) => {
  res.json(swaggerSpec);
});

// ---------- Health check ----------
app.get('/', (req, res) => {
  res.json({
    service: 'Student Service',
    status: 'running',
    docs: `http://localhost:${PORT}/api-docs`,
  });
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`✅ Student Service running on http://localhost:${PORT}`);
  console.log(`📄 Swagger docs: http://localhost:${PORT}/api-docs`);
});
