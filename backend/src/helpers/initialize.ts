import { initializeDatabase } from "@/db";
import redisClient from "@/lib/redis";
import { startSpotifyTokenAutoRefresh } from "@/services/spotify-client";

export const appInitialization = async () => {
	console.log('appInitialization');

	await initializeDatabase()
	await redisClient.initialize()

	await startSpotifyTokenAutoRefresh()

}