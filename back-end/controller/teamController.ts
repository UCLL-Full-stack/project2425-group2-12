// src/controller/teamController.ts
import { Request, Response } from 'express';
import { createTeam, addPlayerToTeam, removePlayerFromTeam, getTeamPlayers } from '../service/teamService';
import { CreateTeamDTO, AddPlayerDTO } from '../types';

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTeamDTO'
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateTeamDTO'
 *       400:
 *         description: Team name is required
 */
export function createTeamController(req: Request, res: Response): void {
  const { name } = req.body as CreateTeamDTO;
  if (!name) {
    res.status(400).json({ message: 'Team name is required' });
    return;
  }

  const newTeam = {
    id: (teamsData.length + 1).toString(), // Example for unique ID generation
    name,
    players: [],
  };

  teamsData.push(newTeam); // Add the new team to the shared array
  res.status(201).json(newTeam); // Return the new team as a response
}

/**
 * @swagger
 * /api/teams/{teamId}/players:
 *   post:
 *     summary: Add a player to a team
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the team
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddPlayerDTO'
 *     responses:
 *       201:
 *         description: Player added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddPlayerDTO'
 *       400:
 *         description: Player name and role are required
 *       404:
 *         description: Team not found
 */
export function addPlayerController(req: Request, res: Response): void {
  const { teamId } = req.params;
  const { name, role } = req.body as AddPlayerDTO;

  if (!name || !role) {
    res.status(400).json({ message: 'Player name and role are required' });
    return;
  }

  const team = teamsData.find((t) => t.id === teamId);
  if (!team) {
    res.status(404).json({ message: 'Team not found' });
    return;
  }

  const newPlayer = { id: (team.players.length + 1).toString(), name, role };
  team.players.push(newPlayer);
  res.status(201).json(newPlayer);
}

/**
 * @swagger
 * /api/teams/{teamId}/players/{playerId}:
 *   delete:
 *     summary: Remove a player from a team
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the team
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the player to be removed
 *     responses:
 *       200:
 *         description: Player removed successfully
 *       404:
 *         description: Team or Player not found
 */
export function removePlayerController(req: Request, res: Response): void {
  const { teamId, playerId } = req.params;

  const team = teamsData.find((t) => t.id === teamId);
  if (!team) {
    res.status(404).json({ message: 'Team not found' });
    return;
  }

  const playerIndex = team.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1) {
    res.status(404).json({ message: 'Player not found' });
    return;
  }

  team.players.splice(playerIndex, 1); // Remove player from the array
  res.status(200).json({ message: 'Player removed successfully' });
}

/**
 * @swagger
 * /api/teams/{teamId}/players:
 *   get:
 *     summary: Get all players in a team
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the team
 *     responses:
 *       200:
 *         description: List of players in the team
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AddPlayerDTO'
 *       404:
 *         description: Team not found
 */
export function getTeamPlayersController(req: Request, res: Response): void {
  const { teamId } = req.params;

  const players = getTeamPlayers(teamId);
  if (!players) {
    res.status(404).json({ message: 'Team not found' });
    return;
  }

  

  res.status(200).json(players);
}


const teamsData = [
  {
    id: '1',
    name: 'Team A',
    players: [
      { id: '1', name: 'Player 1', role: 'Batsman' },
      { id: '2', name: 'Player 2', role: 'Bowler' },
    ],
  },
  {
    id: '2',
    name: 'Team B',
    players: [
      { id: '3', name: 'Player 3', role: 'All-rounder' },
      { id: '4', name: 'Player 4', role: 'Wicket Keeper' },
    ],
  },
];


export const getTeams = (req: Request, res: Response) => {
  res.json(teamsData); // Return the current list of teams
};


export function updatePlayerController(req: Request, res: Response): void {
  const { teamId, playerId } = req.params;
  const { role } = req.body;

  if (!role) {
    res.status(400).json({ message: 'Player role is required' });
    return;
  }

  const team = teamsData.find((t) => t.id === teamId);
  if (!team) {
    res.status(404).json({ message: 'Team not found' });
    return;
  }

  const player = team.players.find((p) => p.id === playerId);
  if (!player) {
    res.status(404).json({ message: 'Player not found' });
    return;
  }

  player.role = role;
  res.status(200).json({ message: 'Player role updated successfully', player });
}