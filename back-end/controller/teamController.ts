// src/controller/teamController.ts
import { Request, Response } from 'express';
import { createTeam, addPlayerToTeam, removePlayerFromTeam, getTeamPlayers,  handleJoinRequest,   getJoinRequests,} from '../service/teamService';
import { CreateTeamDTO, AddPlayerDTO , JoinRequest} from '../types';
import { joinRequests, teams } from '../model/dataStore';
import { PlayerEntity } from '../model/Player';
import { TeamEntity } from '../model/Team';



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

  // Create a new TeamEntity instance
  const newTeam = new TeamEntity(
    (teams.length + 1).toString(),
    name,
    [] // Start with an empty players array
  );

  teams.push(newTeam); // Add the new team to the array
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

  const team = teams.find((t) => t.id === teamId);
  if (!team) {
    res.status(404).json({ message: 'Team not found' });
    return;
  }

  // Use PlayerEntity constructor
  const newPlayer = new PlayerEntity(
    (team.players.length + 1).toString(),
    name,
    role,
    teamId // Include teamId
  );

  team.players.push(newPlayer); // Push the PlayerEntity instance
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

  const team = teams.find((t) => t.id === teamId);
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





export const getTeams = (req: Request, res: Response) => {
  res.json(teams); // Return the current list of teams
};


export function updatePlayerController(req: Request, res: Response): void {
  const { teamId, playerId } = req.params;
  const { role } = req.body;

  if (!role) {
    res.status(400).json({ message: 'Player role is required' });
    return;
  }

  const team = teams.find((t) => t.id === teamId);
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

/**
 * @swagger
 * /api/teams/{teamId}/join:
 *   post:
 *     summary: Request to join a team
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
 *             $ref: '#/components/schemas/JoinRequestDTO'
 *     responses:
 *       201:
 *         description: Join request submitted successfully
 *       404:
 *         description: Team not found
 */



export function requestJoinTeamController(req: Request, res: Response): void {
  const { teamId } = req.params;
  const { playerId, playerName } = req.body as JoinRequest;

  
  // Access teamsData directly in the controller
  const team = teams.find((t) => t.id === teamId);
  if (!team) {
    res.status(404).json({ message: 'Team not found' });
    return;
  }

  const newRequest: JoinRequest = {
    id: (joinRequests.length + 1).toString(), // Generate unique ID
    playerId,
    playerName,
    teamId,
    status: 'pending',
  };

  joinRequests.push(newRequest);

  res.status(201).json({ message: 'Join request submitted successfully', request: newRequest });
}
/**
 * @swagger
 * /api/teams/{teamId}/requests/{requestId}:
 *   patch:
 *     summary: Approve or deny a join request
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the team
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the join request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, denied]
 *                 description: Status of the join request
 *     responses:
 *       200:
 *         description: Join request handled successfully
 *       404:
 *         description: Team or join request not found
 */
export function handleJoinRequestController(req: Request, res: Response): void {
  const { teamId, requestId } = req.params;
  const { status } = req.body;

  const success = handleJoinRequest(teamId, requestId, status);
  if (!success) {
    res.status(404).json({ message: 'Team or join request not found' });
    return;
  }

  res.status(200).json({ message: `Join request ${status}` });
}

/**
 * @swagger
 * /api/teams/{teamId}/requests:
 *   get:
 *     summary: Get all join requests for a team
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the team
 *     responses:
 *       200:
 *         description: List of join requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JoinRequestDTO'
 *       404:
 *         description: Team not found
 */
export function getJoinRequestsController(req: Request, res: Response): void {
  const { teamId } = req.params;

  const requests = getJoinRequests(teamId);
  if (!requests) {
    res.status(404).json({ message: 'Team not found' });
    return;
  }

  res.status(200).json(requests);
}