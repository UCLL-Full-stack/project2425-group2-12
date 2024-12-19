// src/routes/teamRoutes.ts
import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware'


import { createTeamController, addPlayerController, removePlayerController, getTeamPlayersController, getTeamsController, updatePlayerController, requestJoinTeamController,
    handleJoinRequestController,
    getJoinRequestsController, } from '../controller/teamController';

    /**
 * @swagger
 * /teams:
 *   get:
 *     summary: Get all teams
 *     description: Fetches all teams. Accessible to `player` and `captain` roles.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved teams.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   players:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         role:
 *                           type: string
 *       401:
 *         description: Unauthorized - No token or invalid token provided.
 *       403:
 *         description: Forbidden - Insufficient permissions.
 *       500:
 *         description: Internal server error.
 */

const router = express.Router();


// Protected routes
router.get('/teams', protect, authorizeRoles('player', 'captain', 'admin'), getTeamsController); // Accessible to players and captains
router.post('/teams', protect, authorizeRoles('captain', 'admin'), createTeamController); // Captains only
router.post('/teams/:teamId/players', protect, authorizeRoles('captain', 'admin'), addPlayerController); // Captains only
router.delete('/teams/:teamId/players/:playerId', protect, authorizeRoles('captain', 'admin'), removePlayerController); // Captains only
router.get('/teams/:teamId/players', protect, authorizeRoles('player', 'captain', 'admin'), getTeamPlayersController); // Players and captains
router.patch('/teams/:teamId/players/:playerId', protect, authorizeRoles('captain', 'admin'), updatePlayerController); // Captains only

// Routes for join requests
router.post('/teams/:teamId/join', protect, authorizeRoles('player', 'admin'), requestJoinTeamController); // Players only
router.patch('/teams/:teamId/requests/:requestId', protect, authorizeRoles('captain', 'admin'), handleJoinRequestController); // Captains only
router.get('/teams/:teamId/requests', protect, authorizeRoles('captain', 'admin'), getJoinRequestsController);

// Admin-only route
// router.delete('/teams/:id', protect, authorizeRoles('admin'), (req, res) => {
//   res.send('Accessible to admins only');
// });



export default router;
