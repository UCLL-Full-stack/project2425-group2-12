import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import teamRoutes from './routes/teamRoutes';
import gameRoutes from './routes/gameRoutes';
import reservationRoutes from './routes/reservationRoutes';
import participationRoutes from './routes/participationRoutes';
import { setupSwagger } from './swagger';
import { seedDatabase } from './repository/prisma/seed';


import profileRoutes from './routes/profileRoutes';
import authRoutes from './routes/authRoutes';



const app = express();

const SHOULD_SEED = process.env.SEED_DATABASE === 'true';

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}




// Middleware
app.use(express.json()); // Parses JSON requests
app.use(cors()); // Enables CORS for all origins

// Error handler for JSON parsing issues
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    console.error('Bad JSON in request:', err.message);
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next();
});



// Seed database during server initialization
async function initializeDatabase() {
  console.log('Seeding database...');
  try {
    const seededData = await seedDatabase();
    console.log('Database seeded successfully:', JSON.stringify(seededData, null, 2));
  } catch (err) {
    console.error('Failed to seed the database:', err);
    process.exit(1);
  }
}


if (SHOULD_SEED) {
  initializeDatabase();
} else {
  console.log('Database seeding skipped.');
}
// Routes
app.use('/api', teamRoutes);
app.use('/api', gameRoutes);
app.use('/api', reservationRoutes);
app.use('/api', participationRoutes);
app.use('/api', profileRoutes);
app.use('/api', authRoutes);



// Swagger Documentation
setupSwagger(app);

// Global error handler
// Error handler for JSON parsing issues
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    console.error('Bad JSON in request:', err.message);
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
