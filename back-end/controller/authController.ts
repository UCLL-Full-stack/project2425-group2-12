import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();

// Define the type for req.body
interface RegisterBody {
  email: string;
  password: string;
  role: 'player' | 'captain' | 'admin' | 'spectator'; // Define valid roles
}

export const registerUserController = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      res.status(400).json({ message: "Email, password, and role are required." });
      return;
    }
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { id: user.id, email: user.email, role: user.role } 
    });
    
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt with:", email);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.warn("User not found.");
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    console.log("User found:", { id: user.id, role: user.role });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match:", isPasswordValid);

    if (!isPasswordValid) {
      console.warn("Invalid password.");
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      console.warn("⚠️ Account suspended:", email);
      return res.status(403).json({ message: 'Account suspended. Please contact support.' });
    }

    let playerDetails = {};
    if (user.role === 'player') {
      const player = await prisma.player.findUnique({ where: { userId: user.id } });
      if (player) {
        playerDetails = {
          playerId: player.id,
          playerName: player.name,
        };
        console.log("Player details:", playerDetails);
      }
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in environment variables");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, ...playerDetails },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log("JWT created:", token);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: 'Login successful' });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logoutUserController = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

