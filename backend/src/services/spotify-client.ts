import { envs } from '@/config';
import informationHash from '@/lib/information-hash';
import { logger } from '@/lib/logger';
import redisClient from '@/lib/redis';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
	clientId: envs.SPOTIFY_CLIENT_ID,
	clientSecret: envs.SPOTIFY_CLIENT_SECRET,
	redirectUri: envs.SPOTIFY_REDIRECT_URI
});


async function generateNewAccessToken(redisKey: string): Promise<number>{
	const data = await spotifyApi.clientCredentialsGrant()
	spotifyApi.setAccessToken(data.body['access_token']);

	const accessTokenEncrypted = informationHash.encrypt(data.body['access_token']) 
	const expiresIn = Number(data.body['expires_in']);

	await redisClient.hSet(redisKey, {
		accessTokenEncrypted: accessTokenEncrypted,
		expiresIn: String(expiresIn),
		createdAt: String(Date.now())
	});

	return expiresIn * 1000 // delay in ms
}


async function setSpotifyAccessToken(): Promise<number>{
    const redisKey = 'spotify:access-token'
    const accessTokenStoredInfo = await redisClient.hGetAll(redisKey) 

	if (Object.keys(accessTokenStoredInfo).length === 0){
		return await generateNewAccessToken(redisKey)
	}

	const { accessTokenEncrypted, expiresIn, createdAt } = accessTokenStoredInfo;
	if (!accessTokenEncrypted || !expiresIn || !createdAt) {
		throw new Error(`Invalid Redis token format for key ${redisKey}`);
	}

	const expiresInNum = Number(expiresIn); 
	const createdAtNum = Number(createdAt); 
	const now = Date.now();
	
	const expiresAt = createdAtNum + expiresInNum * 1000;	
	const isTokenValid = now < expiresAt
	
	if (!isTokenValid){
		return await generateNewAccessToken(redisKey)
	}
	else {
		const accessToken = informationHash.decrypt(accessTokenEncrypted)
		spotifyApi.setAccessToken(accessToken);
		const timeLeft = Math.floor((expiresAt - now) / 1000);

		return timeLeft;
	}
}

async function refreshAndSchedule() {
	try {
		const nextDelayMs = await setSpotifyAccessToken();

		// Schedule refresh slightly before token expiry (30s early),
		// but never refresh more frequently than once per minute
		const safeDelayMs = Math.max(nextDelayMs - 30_000, 60_000);

		setTimeout(refreshAndSchedule, safeDelayMs);
	} catch (err) {
		logger.error('Error while setting Spotify token:', err);
		setTimeout(refreshAndSchedule, 30_000);
	}
}

export async function startSpotifyTokenAutoRefresh() {
	await refreshAndSchedule();
}

export default spotifyApi;
