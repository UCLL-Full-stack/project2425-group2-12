import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secure_secret'; // Fallback for hardcoded value




// Function to generate a token based on id and role
const generateToken = (id, role) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Generate and log tokens for all roles
const logTokens = () => {
  console.log('JWT_SECRET:', JWT_SECRET);
  console.log('Player Token:', generateToken('player-id', 'player'));
  console.log('Captain Token:', generateToken('captain-id', 'captain'));
  console.log('Admin Token:', generateToken('admin-id', 'admin'));
  console.log('Spectator Token:', generateToken('spectator-id', 'spectator'));
};

// Call the function to log tokens
logTokens();
