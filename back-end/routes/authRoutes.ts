// src/routes/authRoutes.js
import express from 'express';
import {
  registerUserController,
  loginUserController,
  logoutUserController
} from '../controller/authController';
import {
  validateBody,
  registrationSchema,
  loginSchema,
} from '../middleware/validationMiddleware';

  
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with an email, password, and role.
 *     requestBody:
 *       description: User registration details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum: [player, captain, admin, spectator]
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Internal server error.
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       description: User login details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid email or password.
 *       500:
 *         description: Internal server error.
 */



/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       description: User login details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid email or password.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     description: Clears the user's authentication cookie, ending the session.
 *     responses:
 *       200:
 *         description: Logout successful.
 *       500:
 *         description: Internal server error.
 */

const router = express.Router();



// Registration route
router.post('/register', validateBody(registrationSchema), registerUserController);
router.post('/login', validateBody(loginSchema), loginUserController);
router.post('/logout', logoutUserController);

export default router;
