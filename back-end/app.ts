import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import teamRoutes from './routes/teamRoutes';

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3000;

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Team API',
      version: '1.0.0',
      description: 'API for team management',
    },
  },
  apis: ['./controllers/*.ts', './routes/*.ts'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/teams', teamRoutes);

// Basic health check route
app.get('/status', (req, res) => {
  res.json({ message: 'Back-end is running...' });
});

// // Optional error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// Server start
app.listen(port, () => {
  console.log(`Back-end is running on port ${port}.`);
});

export default app;
