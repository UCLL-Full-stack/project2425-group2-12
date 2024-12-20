// src/controller/teamController.ts
import { Request, Response } from 'express';
import { createTeam, addPlayerToTeam, removePlayerFromTeam, getTeamPlayers,  handleJoinRequest, getTeams,  getJoinRequests, updatePlayerRole, createJoinRequest,} from '../service/teamService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export enum PlayerRole {
  Batsman = "Batsman",
  Bowler = "Bowler",
  AllRounder = "All-rounder",
  WicketKeeper = "Wicket Keeper",
}


// Controller to fetch all teams
export async function getTeamsController(req: Request, res: Response): Promise<void> {
  try {
    console.log('Fetching teams from the database...');
    const teams = await getTeams();
    console.log('Fetched teams:', teams);
    res.status(200).json(teams);
  } catch (error: any) {
    console.error('Error fetching teams:', error.message);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};


/**
 * Create a new team.
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the team
 *                 example: "Team A"
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
export async function createTeamController(req: Request, res: Response): Promise<void> {
  const { name } = req.body;

  // Validate input
  if (!name || typeof name !== "string") {
    res.status(400).json({
      message: "Team name is required and must be a string.",
    });
    return;
  }

  try {
    const newTeam = await createTeam(name);
    res.status(201).json({
      message: "Team created successfully.",
      team: newTeam,
    });
  } catch (error: any) {
    // Handle duplicate team name or other database issues
    if (error.code === "P2002") {
      res.status(400).json({
        message: "A team with this name already exists.",
      });
    } else {
      res.status(500).json({
        message: "Failed to create team.",
        error: error.message,
      });
    }
  }
}

/**
 * Add a player to a team.
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the player
 *                 example: "John Doe"
 *               role:
 *                 type: string
 *                 description: Role of the player
 *                 enum: ["Batsman", "Bowler", "All-rounder", "Wicket Keeper"]
 *     responses:
 *       201:
 *         description: Player added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Team not found
 *       500:
 *         description: Internal server error
 */
export async function addPlayerController(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params;
  const { name, role } = req.body;

  // Validate input
  if (!name || typeof name !== "string" || !role || typeof role !== "string") {
    res.status(400).json({
      message: "Player name and role are required and must be valid strings.",
    });
    return;
  }

  if (!Object.values(PlayerRole).includes(role as PlayerRole)) {
    res.status(400).json({ message: "Invalid role provided." });
    return;
  }
  

  try {
    
    const newPlayer = await addPlayerToTeam(teamId, name, role as PlayerRole);
    

    if (!newPlayer) {
      res.status(404).json({
        message: "Team not found.",
      });
      return;
    }

    res.status(201).json({
      message: "Player added successfully.",
      player: newPlayer,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to add player to the team.",
      error: error.message,
    });
  }
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Player removed successfully
 *       404:
 *         description: Team or Player not found
 *       500:
 *         description: Internal server error
 */
export async function removePlayerController(req: Request, res: Response): Promise<void> {
  const { teamId, playerId } = req.params;

  try {
    // Call the service to remove the player from the team
    const isRemoved = await removePlayerFromTeam(teamId, playerId);

    if (!isRemoved) {
      res.status(404).json({ message: 'Team or Player not found' });
      return;
    }

    res.status(200).json({ message: 'Player removed successfully' });
  } catch (error: any) {
    console.error(`Error removing player: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
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
 *       500:
 *         description: Internal server error
 */
export async function getTeamPlayersController(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params;

  try {
    // Fetch players for the team using the service layer
    const players = await getTeamPlayers(teamId);

    if (!players) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    res.status(200).json(players);
  } catch (error: any) {
    console.error(`Error fetching players for team ${teamId}: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
}





// export const getTeams = (req: Request, res: Response) => {
//   res.json(teams); // Return the current list of teams
// };


/**
 * @swagger
 * /api/teams/{teamId}/players/{playerId}:
 *   patch:
 *     summary: Update a player's role in a team
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
 *         description: ID of the player
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: New role of the player
 *                 enum: [Batsman, Bowler, All-rounder, Wicket Keeper]
 *     responses:
 *       200:
 *         description: Player role updated successfully
 *       404:
 *         description: Team or player not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
export async function updatePlayerController(req: Request, res: Response): Promise<void> {
  const { teamId, playerId } = req.params;
  const { role } = req.body;

  if (!role) {
    res.status(400).json({ message: 'Player role is required' });
    return;
  }

  try {
    const updatedPlayer = await updatePlayerRole(teamId, playerId, role);

    if (!updatedPlayer) {
      res.status(404).json({ message: 'Team or player not found' });
      return;
    }

    res.status(200).json({ message: 'Player role updated successfully', player: updatedPlayer });
  } catch (error: any) {
    console.error(`Error updating player role: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
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
 *             type: object
 *             properties:
 *               playerId:
 *                 type: string
 *                 description: ID of the player requesting to join
 *               playerName:
 *                 type: string
 *                 description: Name of the player
 *     responses:
 *       201:
 *         description: Join request created successfully
 *       404:
 *         description: Team not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
export async function requestJoinTeamController(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params;
  const { playerId, playerName } = req.body;


  if (!playerId || !playerName) {
    res.status(400).json({ message: 'Player ID and name are required' });
    return;
  }
  

  try {
    // Check if the player is already in the team
    const isPartOfTeam = await prisma.player.findFirst({
      where: {
        id: playerId,
        teamId, // Ensure the player's team matches the requested team
      },
    });

    if (isPartOfTeam) {
      res.status(400).json({ message: 'Player is already part of this team.' });
      return;
    }
    const newJoinRequest = await createJoinRequest(teamId, playerId, playerName);
    res.status(201).json({
      message: 'Join request submitted successfully',
      request: newJoinRequest,
    });
  } catch (error) {
    console.error('Error in requestJoinTeamController:', error);
    res.status(500).json({
      message: 'Something went wrong on the server. Please try again later.',
    });
  }
};





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
 *       400:
 *         description: Invalid status
 *       500:
 *         description: Internal server error
 */
export async function handleJoinRequestController(req: Request, res: Response): Promise<void> {
  const { teamId, requestId } = req.params;
  const { status, role } = req.body;

  if (!['approved', 'denied'].includes(status)) {
    res.status(400).json({ message: 'Invalid status. Must be "approved" or "denied".' });
    return;
  }

  if (!['Batsman', 'Bowler', 'All-rounder', 'Wicket Keeper'].includes(role)) {
    res.status(400).json({ message: 'Invalid role. Must be one of "Batsman", "Bowler", "All-rounder", or "Wicket Keeper".' });
    return;
  }
  try {
    const success = await handleJoinRequest(teamId, requestId, status, role);

    if (!success) {
      res.status(404).json({ message: 'Team or join request not found' });
      return;
    }

    res.status(200).json({
      message: `Join request ${status} successfully.`,
    });
  } catch (error: any) {
    console.error(`Error processing join request: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
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
 *       500:
 *         description: Internal server error
 */
export async function getJoinRequestsController(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params;

  try {
    // Fetch join requests for the team
    const joinRequests = await getJoinRequests(teamId);



    res.status(200).json(joinRequests);
  } catch (error: any) {
    console.error(`Error fetching join requests: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}
