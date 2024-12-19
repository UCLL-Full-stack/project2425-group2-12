import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload; // Explicitly reference CustomJwtPayload
    }
  }
}

// Extend the JwtPayload type to include custom properties
export interface CustomJwtPayload extends JwtPayload {
  id: string; // User ID
  role: string; // User role
  playerId?: string
  
}
