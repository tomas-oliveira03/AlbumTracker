import { envs } from '@/config';
import SpotifyWebApi from 'spotify-web-api-node';

const clientId = envs.SPOTIFY_CLIENT_ID
const clientSecret = envs.SPOTIFY_CLIENT_SECRET

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: 'http://127.0.0.1:3000/callback',
});

export async function getAccessToken(){
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);

    // const accessToken = "BQBSHh3YCJP2DcJGkQ8eaDtJnfg48QTRhdId9360QayLgAPpYUfAmw-nprUtHga3IRe0hPSrwJzj6thq3utEe-7GLwNSvMyKQ3Swqvfp7KrESC4NapBVcOOT3b5RDzdoR5zTvRuPRNQ"
    // spotifyApi.setAccessToken(accessToken);
}

export async function searchForSong(songName: string) {
    try {
        // Get access token (Client Credentials Flow)
        await getAccessToken()

        // Fetch artist info
        const response = await spotifyApi.searchTracks(songName, { limit: 5 });


        response.body.tracks?.items.forEach((track, index) => {
            console.log(`🎵 [${index + 1}] ${track.name} by ${track.artists.map(a => a.name).join(', ')}`);
            console.log(`    ▶️ ${track.external_urls.spotify}`);
            });


    } catch (err) {
        console.error('Failed to fetch artist:', err);
    }
}

export async function searchForAlbum(albumName: string) {
  try {
    // Get access token (Client Credentials Flow)
    await getAccessToken();

    // Search for albums
    const response = await spotifyApi.searchAlbums(albumName, { limit: 5 });

    response.body.albums?.items.forEach((album, index) => {
      console.log(`💿 [${index + 1}] ${album.name} by ${album.artists.map(a => a.name).join(', ')}`);
      console.log(`    📅 Release: ${album.release_date}`);
      console.log(`    ▶️ ${album.external_urls.spotify}`);
    });

  } catch (err) {
    console.error('Failed to fetch album:', err);
  }
}

export async function searchForArtist(artistName: string) {
  try {
    // Get access token (Client Credentials Flow)
    await getAccessToken();

    // Search for artists
    const response = await spotifyApi.searchArtists(artistName, { limit: 5 });


    response.body.artists?.items.forEach((artist, index) => {
      console.log(`🎤 [${index + 1}] ${artist.name}`);
      console.log(`    👥 Followers: ${artist.followers.total}`);
      console.log(`    🎶 Genres: ${artist.genres.join(', ') || 'N/A'}`);
      console.log(`    ▶️ ${artist.external_urls.spotify}`);
    });

    const artistsContent = response.body.artists
    return artistsContent

  } catch (err) {
    console.error('Failed to fetch artist:', err);
    return err
  }
}

