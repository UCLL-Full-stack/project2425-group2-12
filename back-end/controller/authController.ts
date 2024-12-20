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

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
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
      }
    }

    // Include player details in the JWT token if applicable
    const token = jwt.sign(
      { id: user.id, role: user.role, ...playerDetails },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

