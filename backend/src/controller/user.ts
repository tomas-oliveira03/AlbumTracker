import { AppDataSource } from "@/db";
import { User } from "@/db/entities/User";
import { createToken } from "@/lib/jwt";
import BenignError from "@/server/errors/benign-error";
import { LoginRequest, RegisterRequest } from "@/server/schemas/auth";
import bcrypt from "bcrypt";

export class UserController {
    async registerUser(userData: RegisterRequest) {
        // Check if user already exists
        const existingUser = await AppDataSource.getRepository(User).findOne({
            where: { email: userData.email }
        });

        if (existingUser) {
            throw new BenignError('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Create user
        const newUser = AppDataSource.getRepository(User).create({
            email: userData.email,
            password: hashedPassword,
            displayName: userData.displayName
        });

        await AppDataSource.getRepository(User).insert(newUser);

        // Generate token
        const token = createToken(newUser);

        // Return user data without password and token
        const { password, ...userWithoutPassword } = newUser;
        return {
            user: userWithoutPassword,
            token
        };
    }

    async loginUser(credentials: LoginRequest) {
        // Find user
        const user = await AppDataSource.getRepository(User).findOne({
            where: { email: credentials.email }
        });

        if (!user || !user.password) {
            throw new BenignError('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new BenignError('Invalid email or password');
        }

        // Generate token
        const token = createToken(user);

        // Return user data without password and token
        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token
        };
    }

    async getUserById(userId: string) {
        const user = await AppDataSource.getRepository(User).findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new BenignError('User not found');
        }

        // Return user data without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

const userController = new UserController();
export default userController;
