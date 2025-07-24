import spotifyApi from './spotify-client';

export async function searchForTrack(songName: string) {
    try {
        const response = await spotifyApi.searchTracks(songName, { limit: 15 });
        const tracksContent = response.body.tracks;
        return tracksContent;

    } catch (err) {
        throw new Error('Song search failed');
    }
}

export async function searchForAlbum(albumName: string) {
  try {
    const response = await spotifyApi.searchAlbums(albumName, { limit: 15 });
    const albumsContent = response.body.albums;
    return albumsContent;

  } catch (err) {
    throw new Error('Album search failed');
  }
}

export async function searchForArtist(artistName: string) {
	try {
		const response = await spotifyApi.searchArtists(artistName, { limit: 15 });
		const artistsContent = response.body.artists
		return artistsContent

	} catch (err) {
		throw new Error('Artist search failed');
	}
}



export async function getArtistInfo(artistId: string) {
	try {
		const response = await spotifyApi.getArtist(artistId);
		return response.body;
		
	} catch (err) {
		throw new Error('Failed to retrieve artist info');
	}
}

export async function getAlbumsByArtist(artistId: string) {
	try {
		const response = await spotifyApi.getArtistAlbums(artistId, { 
      limit: 15,
      include_groups: 'album'
    });
		return response.body.items;
		
	} catch (err) {
		throw new Error('Failed to retrieve artist info');
	}
}

export async function getArtistFullInformation(artistId: string){
  const artist = await getArtistInfo(artistId)
  const albums = await getAlbumsByArtist(artistId)

  return {
    artist: artist,
    albums: albums
  }
}


export async function getAlbumInfo(albumId: string){
  try {
		const response = await spotifyApi.getAlbum(albumId);
		return response.body;
		
	} catch (err) {
		throw new Error('Failed to retrieve artist info');
	}
}

export async function getTrackInfo(trackId: string) {
  try {
    const response = await spotifyApi.getTrack(trackId);
    return response.body;
  } catch (err) {
    throw new Error('Failed to get track info');
  }
}