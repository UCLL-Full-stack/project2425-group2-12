// src/app.ts
import express from 'express';
import teamRoutes from './routes/teamRoutes';
import { setupSwagger } from './swagger';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes';


const app = express();
app.use(express.json());

app.use(cors()); // Enables CORS for all origins

// Use the team routes
app.use('/api', teamRoutes);
app.use('/api', gameRoutes);


// Set up Swagger documentation
setupSwagger(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
