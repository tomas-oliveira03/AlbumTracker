import { envs } from '@/config';
import { User } from '@/db/entities/User';
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    email: string;
}

export function createToken(user: User): string {
    const payload: UserPayload = {
        id: user.id,
        email: user.email
    };

    return jwt.sign(payload, envs.JWT_SECRET, {
        expiresIn: '7d' // Token expires in 7 days
    });
}

export function verifyToken(token: string): UserPayload | null {
    try {
        return jwt.verify(token, envs.JWT_SECRET) as UserPayload;
    } catch (error) {
        return null;
    }
}
