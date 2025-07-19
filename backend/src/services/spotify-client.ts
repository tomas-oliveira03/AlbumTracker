import { envs } from '@/config';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: envs.SPOTIFY_CLIENT_ID,
  clientSecret: envs.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'http://127.0.0.1:3000/callback',
});

export async function getAccessToken(){
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
}

export default spotifyApi;
