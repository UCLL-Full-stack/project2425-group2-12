// src/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cricket App API',
      version: '1.0.0',
      description: 'API documentation for the Cricket App back-end',
    },
    components: {  // Moved components inside definition
      schemas: {
        CreateTeamDTO: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Team A' },
          },
          required: ['name'],
        },
        AddPlayerDTO: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'MS Dhoni' },
            role: { type: 'string', example: 'Batsman', enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicket Keeper'] },
          },
          required: ['name', 'role'],
        },
      },
    },
  },
  apis: ['./controller/teamController.ts'], // Corrected path
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at /api-docs');
}
