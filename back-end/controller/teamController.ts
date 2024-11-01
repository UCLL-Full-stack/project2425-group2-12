// back-end/controller/TeamController.ts

import { Request, Response } from 'express';
import { TeamService } from '../service/TeamService';
import { CreateTeamDTO, AddPlayerDTO } from '../types/index';
import { User } from '../model/User';

export class TeamController {
  static async getAllTeams(req: Request, res: Response) {
    try {
      const teams = TeamService.getAllTeams();  // Fetch all teams from the service
      res.status(200).json(teams);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching teams', error: (error as Error).message });
    }
  }

  static async createTeam(req: Request, res: Response) {
    const { name, captain }: CreateTeamDTO = req.body;
    try {
      const captainUser = new User(
        captain.user_id,
        captain.name,
        captain.email,
        captain.password,
        captain.role
      );
      const team = TeamService.createTeam(name, captainUser);
      res.status(201).json(team);
    } catch (error) {
      res.status(400).json({ message: 'Error creating team', error: (error as Error).message });
    }
  }

  static async addPlayerToTeam(req: Request, res: Response) {
    const { id } = req.params;
    const { player }: AddPlayerDTO = req.body;
    try {
      const playerUser = new User(
        player.user_id,
        player.name,
        player.email,
        player.password,
        player.role
      );
      const updatedTeam = TeamService.addPlayerToTeam(id, playerUser);
      res.status(200).json(updatedTeam);
    } catch (error) {
      res.status(400).json({ message: 'Error adding player', error: (error as Error).message });
    }
  }

  static async getTeamDetails(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const team = TeamService.getTeamById(id);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      res.status(200).json(team);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching team details', error: (error as Error).message });
    }
  }

  static async removePlayerFromTeam(req: Request, res: Response) {
    const { id, playerId } = req.params;
    try {
      const updatedTeam = TeamService.removePlayerFromTeam(id, playerId);
      res.status(200).json(updatedTeam);
    } catch (error) {
      res.status(400).json({ message: 'Error removing player', error: (error as Error).message });
    }
  }
}
