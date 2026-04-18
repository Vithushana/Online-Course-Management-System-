/**
 * Instructor Service — Entry Point
 * Starts an Express server on port 3004.
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const instructorRoutes = require('./routes/instructorRoutes');

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/instructors', instructorRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON endpoint (for gateway unified docs)
app.get('/swagger-json', (req, res) => {
  res.json(swaggerSpec);
});

app.get('/', (req, res) => {
  res.json({
    service: 'Instructor Service',
    status: 'running',
    docs: `http://localhost:${PORT}/api-docs`,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Instructor Service running on http://localhost:${PORT}`);
  console.log(`📄 Swagger docs: http://localhost:${PORT}/api-docs`);
});
