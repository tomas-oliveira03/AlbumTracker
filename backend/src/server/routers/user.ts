import express, { Request, Response } from 'express';
import { logger } from '@/lib/logger';
import userController from '@/controller/user';
import { loginSchema, registerSchema } from '../schemas/auth';
import { treeifyError } from 'zod';
import { authMiddleware } from '@/middleware/auth';
import BenignError from '../errors/benign-error';

const router = express.Router();

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
    try {
        const parseResult = registerSchema.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({
                message: 'Invalid registration data',
                errors: treeifyError(parseResult.error),
            });
        }

        const userData = parseResult.data;
        const result = await userController.registerUser(userData, res);

        return res.status(200).json(result);
    } 
    catch (error) {
        if (error instanceof BenignError) {
            return res.status(400).json({
                message: error.message
            });
        }
        logger.error('Registration error', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
    try {
        const parseResult = loginSchema.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({
                message: 'Invalid login data',
                errors: treeifyError(parseResult.error),
            });
        }

        const credentials = parseResult.data;
        const result = await userController.loginUser(credentials, res);

        return res.status(200).json(result);
    } 
    catch (error) {
        if (error instanceof BenignError) {
            return res.status(400).json({
                message: error.message
            });
        }

        logger.error('Login error', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Logout endpoint
router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
    try {
        const result = await userController.logoutUser(res);
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Logout error', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Get current user endpoint (protected route)
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        const user = await userController.getUserById(userId);
        return res.status(200).json(user);
    } 
    catch (error) {
        if (error instanceof BenignError) {
            return res.status(400).json({
                message: error.message
            });
        }

        logger.error('Get current user error', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

export default router;