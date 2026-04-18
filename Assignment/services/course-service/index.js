/**
 * Course Service — Entry Point
 * Starts an Express server on port 3002.
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const courseRoutes = require('./routes/courseRoutes');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/courses', courseRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON endpoint (for gateway unified docs)
app.get('/swagger-json', (req, res) => {
  res.json(swaggerSpec);
});

app.get('/', (req, res) => {
  res.json({
    service: 'Course Service',
    status: 'running',
    docs: `http://localhost:${PORT}/api-docs`,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Course Service running on http://localhost:${PORT}`);
  console.log(`📄 Swagger docs: http://localhost:${PORT}/api-docs`);
});
