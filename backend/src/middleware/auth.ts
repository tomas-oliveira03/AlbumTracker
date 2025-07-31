import { verifyToken } from '@/lib/jwt';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized: No token provided'
        });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized: No token provided'
        });
    }
    
    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
        return res.status(401).json({
            message: 'Unauthorized: Invalid token'
        });
    }

    // Add user to request
    req.user = payload;
    return next();
}
