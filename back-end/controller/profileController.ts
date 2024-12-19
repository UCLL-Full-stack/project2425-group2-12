import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CustomJwtPayload } from '../types/express';

const prisma = new PrismaClient();

export const getProfileController = async (req: Request, res: Response) => {
    try {
      // Ensure req.user is of type CustomJwtPayload
      const user = req.user as CustomJwtPayload | undefined;
  
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
      }
  
      const { id, role } = user;
  
      // Fetch data based on role
      if (role === 'player') {
        const participationDetails = await prisma.participation.findMany({
          where: { playerId: id },
          include: { game: true },
        });
        return res.status(200).json({ role, participationDetails });
      }
  
      if (role === 'captain') {
        const teamDetails = await prisma.team.findMany({
          where: {
            players: {
              some: { userId: id },
            },
          },
          include: { players: true },
        });
        return res.status(200).json({ role, teamDetails });
      }
  
      if (role === 'admin') {
        const allTeams = await prisma.team.findMany({
          include: { players: true, gamesHome: true, gamesAway: true },
        });
        const allGames = await prisma.game.findMany();
        return res.status(200).json({ role, allTeams, allGames });
      }
  
      // If no role matched
      return res.status(403).json({ message: 'Role not recognized' });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };