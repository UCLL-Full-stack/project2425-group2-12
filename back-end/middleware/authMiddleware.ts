import { Request, Response, NextFunction } from 'express'; // Import types from Express
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../types/express'; // Import your CustomJwtPayload type

import dotenv from 'dotenv';

dotenv.config(); // Ensure the .env file is loaded before using JWT_SECRET




export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
      
    }

    console.log('Token:', token); // Debugging token

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;

    console.log('Decoded token:', decoded); // Debugging decoded token
    console.log("Authorization Header:", req.headers.authorization);


    if (!decoded.id || !decoded.role) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}
export const authorizeRoles =  (...roles: string[]) => {
  
  return (req: Request, res: Response, next: NextFunction) => {

    if (req.user?.role === "admin") {
      return next(); // Admin bypasses role checks
    }
    // Ensure req.user exists and is an object
    if (!req.user || typeof req.user !== 'object' || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Forbidden: You do not have permission to access this resource',
        requiredRole: roles,
      });
    }
    next();
  };
};

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined. Check your .env file.");
}
const JWT_SECRET = process.env.JWT_SECRET!;

// Define payload (customize based on your needs)
const payload = {
  id: 'user123', // Replace with your user ID
  role: 'player', // Replace with your role ('player', 'captain', 'admin', etc.)
};

// Generate the token
const token = jwt.sign(payload,  JWT_SECRET, { expiresIn: '7d' });

console.log('Generated Token:', token);
console.log('JWT_SECRET:', process.env.JWT_SECRET);


