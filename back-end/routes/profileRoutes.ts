import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getProfileController } from '../controller/profileController';

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile based on role
 *     description: Fetches user-specific data depending on the role (`player`, `captain`, or `admin`).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 role:
 *                   type: string
 *                   example: "player"
 *                 participationDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       game:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           date:
 *                             type: string
 *                             format: date
 *                           time:
 *                             type: string
 *                           venue:
 *                             type: string
 *       401:
 *         description: Unauthorized - No token or invalid token provided.
 *       403:
 *         description: Forbidden - Role not recognized.
 *       500:
 *         description: Internal server error.
 */


const router = express.Router();

// Profile route
router.get('/profile', protect, getProfileController);

export default router;
